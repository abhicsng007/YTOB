import express from 'express';
import { generateShorts } from '../controllers/shortsController.js';
import authenticateToken from '../middleware/authenticateToken.js';
const router = express.Router();

router.get('/generate-shorts', authenticateToken, generateShorts);


export default router;
