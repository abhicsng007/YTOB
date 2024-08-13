import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { generateSearchImages , proxyImage } from '../controllers/searchimageController.js';
const router = express.Router();

router.post('/free-image-search', authenticateToken, generateSearchImages);
router.get('/proxy-image', authenticateToken, proxyImage);

export default router;
