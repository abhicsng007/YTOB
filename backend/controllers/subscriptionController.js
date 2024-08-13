import Stripe from 'stripe';
import Credit from "../models/Credit.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const planPrices = {
  'Free': { id: null, credits: 3 },
  'Neural': { id: 'price_1PgplARtq5bYEjmK52WYe87z', credits: 100 },
  'Synapse': { id: 'price_1PgplnRtq5bYEjmKbfgsGPIC', credits: 500 },
  'Quantum': { id: 'price_1PgpmLRtq5bYEjmK0VRd1NP1', credits: 1000 },
};

export const subscriptionCheckout = async (req, res) => {
  try {
    const { planName } = req.body;
    const userId = req.user.userId;
    console.log(`${userId} : ${planName}`);

    if (planName === 'Free') {
      return res.status(400).json({ error: 'Cannot checkout for free plan' });
    }

    if (!planName || !planPrices[planName]) {
      return res.status(400).json({ error: 'Invalid plan name' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.username, // Assuming username is the email
      payment_method_types: ['card'],
      line_items: [
        {
          price: planPrices[planName].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: userId.toString(),
        planName: planName
      },
      expand: ['subscription']
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const subscriptionWebhook = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
 
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object, event.type);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      default:
        console.log(`Received event ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing ${event.type}:`, error);
  }

  response.json({received: true});
};

async function handleSubscriptionChange(subscription, eventType) {
  let userId = subscription.metadata?.userId;
  let planName = subscription.metadata?.planName;

  if (!userId || !planName) {
    console.error('Missing metadata for subscription:', subscription.id);
    return;
  }

  let credit = await Credit.findOne({ user: userId });
  

  credit.subscriptionStatus = 'active';
  credit.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
  credit.plan = planName;

  
  let unusedCredits = credit.count;
  credit.count = unusedCredits + planPrices[planName].credits;
  credit.totalCount = unusedCredits + planPrices[planName].credits;
  credit.lastUpdated = new Date();
  await credit.save();
  

  
}

async function handleSubscriptionCancellation(subscription) {
  const userId = subscription.metadata?.userId;
  const planName = subscription.metadata?.planName;

  
  if (!userId) {
    console.error('User ID not found for cancelled subscription:', subscription.id);
    return;
  }

  const credit = await Credit.findOne({ user: userId });
  if (credit) {
    // Calculate remaining credits after removing plan-specific credits
    let remainingCredits = credit.count - planPrices[planName].credits;
    
    // Ensure the user keeps any remaining credits from their free allowance
    credit.count = Math.max(remainingCredits, 0);
    
    credit.subscriptionStatus = 'cancelled';
    credit.plan = 'Free';
    credit.totalCount = 3;  // Reset total count to Free plan limit
    credit.lastUpdated = new Date();
    await credit.save();
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const planName = session.metadata.planName;

  if (session.subscription) {
    await stripe.subscriptions.update(session.subscription, {
      metadata: {
        userId: userId,
        planName: planName
      }
    });
  }

  console.log(`Checkout completed for user ${userId}`);
}

async function handleInvoicePaid(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata?.userId;
  const planName = subscription.metadata?.planName;

  if (!userId || !planName) {
    console.error('Missing metadata for subscription:', subscription.id);
    return;
  }

  // let credit = await Credit.findOne({ user: userId });
  

  // let unusedCredits = credit.count;
  // credit.count = unusedCredits + planPrices[planName].credits;
  // credit.totalCount = unusedCredits + planPrices[planName].credits;
  // credit.lastUpdated = new Date();
  // await credit.save();

  console.log(`Invoice paid for user ${userId}, credits updated`);
}


export const cancelSubscription = async (req, res) => {
  const email  = req.user.username;
  const user   = req.user.userId;

  const customers = await stripe.customers.list({ email: email, limit: 1 });
    
    let customer;
    if (customers.data.length > 0) {
      // Use existing customer
      customer = customers.data[0];
    } else {
      // Create new customer
      customer = await stripe.customers.create({ email: email });
    }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });
    const credit = await Credit.findOne({ user: user });
    

    if (credit) {
      const planName = credit.plan;
    
      // Calculate remaining credits after removing plan-specific credits
      let remainingCredits = credit.count - planPrices[planName].credits;
      
      // Ensure the user keeps any remaining credits from their free allowance
      credit.count = Math.max(remainingCredits, 0);
      
      credit.subscriptionStatus = 'cancelled';
      credit.plan = 'Free';
      credit.totalCount = 3;  // Reset total count to Free plan limit
      credit.lastUpdated = new Date();
      await credit.save();
    }

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
}