import { Router } from 'express';
import { createGoal, getGoals, getCurrentGoal } from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.get('/current', authenticate, getCurrentGoal);

export default router;
