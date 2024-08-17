import express from 'express';
import { signup, login, logout, refreshAccessToken , validateToken , changePassword } from '../controllers/authController.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken); // New endpoint for refreshing tokens
router.post('/validate', validateToken);
router.post('/change-password', changePassword);

export default router;
