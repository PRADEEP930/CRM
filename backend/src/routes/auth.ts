import { Router } from 'express';
import { register, login, getProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (protected route)
router.get('/profile', authenticate, getProfile);

export default router;