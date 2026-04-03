import { Router } from 'express';
import { getDashboard, getRecommendations } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, getDashboard);
router.get('/recommendations', authenticate, getRecommendations);

export default router;
