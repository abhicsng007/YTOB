import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


async function createBillingPortalConfig() {
  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'YTOB partners with Stripe for simplified billing.',
    },
    features: {
      invoice_history: {
        enabled: true,
      },
    },
  });

  console.log('Billing portal configuration created:', configuration.id);
  // Store configuration.id in your database or an environment variable
}

createBillingPortalConfig();
