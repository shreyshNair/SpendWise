import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

export const createGoal = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { month, year, targetAmount } = req.body;

    if (!month || !year || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Month, year, and target amount are required' });
    }

    const goal = await prisma.savingsGoal.upsert({
      where: {
        id: (await prisma.savingsGoal.findFirst({ where: { userId: req.userId, month, year } }))?.id || 'new-id',
      },
      update: {
        targetAmount: parseFloat(targetAmount),
      },
      create: {
        userId: req.userId,
        month: parseInt(month),
        year: parseInt(year),
        targetAmount: parseFloat(targetAmount),
      },
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req: any, res: Response, next: NextFunction) => {
  try {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId: req.userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    res.json({ success: true, goals });
  } catch (error) {
    next(error);
  }
};

export const getCurrentGoal = async (req: any, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const goal = await prisma.savingsGoal.findFirst({
      where: { userId: req.userId, month, year },
    });

    if (!goal) {
      return res.json({ success: true, goal: null });
    }

    // Calculate current savings
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const incomes = await prisma.income.aggregate({
      where: { userId: req.userId, date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    });

    const expenses = await prisma.expense.aggregate({
      where: { userId: req.userId, date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    });

    const currentSavings = (incomes._sum.amount || 0) - (expenses._sum.amount || 0);
    const progress = (currentSavings / goal.targetAmount) * 100;

    res.json({
      success: true,
      goal: {
        ...goal,
        currentSavings,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};
