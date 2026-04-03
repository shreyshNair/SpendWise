import { Router } from 'express';
import { createIncome, getIncomes, updateIncome, deleteIncome } from '../controllers/income.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createIncome);
router.get('/', authenticate, getIncomes);
router.put('/:id', authenticate, updateIncome);
router.delete('/:id', authenticate, deleteIncome);

export default router;
