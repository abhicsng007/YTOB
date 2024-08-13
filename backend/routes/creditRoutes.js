import express from 'express';
import {getCreditInfo} from '../controllers/creditController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/get-credits', authenticateToken, getCreditInfo);

export default router;
