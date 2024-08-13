import express from 'express';
import { subscriptionCheckout, subscriptionWebhook , cancelSubscription} from '../controllers/subscriptionController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/create-checkout-session', authenticateToken, subscriptionCheckout);
router.post('/create-customer-portal-session', authenticateToken, cancelSubscription);
router.post('/webhook',subscriptionWebhook);


export default router;
