import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  loginUser,
  registerUser,
  getMe,
} from '../controller/authController.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);

export default router;
