import express from 'express';
import { generateBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { generateImage } from '../controllers/aimageController.js';
import { addScreenshotToBlog } from '../controllers/screenshotController.js';
import authenticateToken from '../middleware/authenticateToken.js';
const router = express.Router();

router.get('/generate', authenticateToken, generateBlog);
router.post('/generate-image', authenticateToken, generateImage);
router.post('/generate-screenshot', authenticateToken, addScreenshotToBlog);
router.get('/allblogs', authenticateToken, getAllBlogs);
router.get('/:id', authenticateToken, getBlogById);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;
