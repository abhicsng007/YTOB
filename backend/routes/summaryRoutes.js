import express from 'express';
import { generateSummary, getAllSummaries, getSummaryById, updateSummary, deleteSummary } from '../controllers/summaryController.js';
import authenticateToken from '../middleware/authenticateToken.js';
const router = express.Router();

router.post('/generate-summary', authenticateToken, generateSummary);
router.get('/allsummaries', authenticateToken, getAllSummaries);
router.get('/:id', authenticateToken, getSummaryById);
router.put('/:id', authenticateToken, updateSummary);
router.delete('/:id', authenticateToken, deleteSummary);

export default router;
