import express from 'express';
import { generateScreenshot } from '../controllers/screenshotController.js';


const router = express.Router();

router.post('/generate-screenshot', generateScreenshot);
 // New endpoint for refreshing tokens

export default router;