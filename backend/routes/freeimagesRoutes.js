import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { generateFreeImages } from '../controllers/freeimageController.js';
const router = express.Router();

router.post('/text-to-image', authenticateToken, generateFreeImages);

export default router;
