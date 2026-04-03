import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

export const createIncome = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { source, amount, date, frequency, category, notes } = req.body;

    if (!source || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Source, amount, and category are required' });
    }

    const income = await prisma.income.create({
      data: {
        userId: req.userId,
        source,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        frequency: frequency || 'one-time',
        category,
        notes,
      },
    });

    res.status(201).json({ success: true, income });
  } catch (error) {
    next(error);
  }
};

export const getIncomes = async (req: any, res: Response, next: NextFunction) => {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, incomes });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { source, amount, date, frequency, category, notes } = req.body;

    const income = await prisma.income.findFirst({
      where: { id, userId: req.userId },
    });

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }

    const updatedIncome = await prisma.income.update({
      where: { id },
      data: {
        source: source || income.source,
        amount: amount ? parseFloat(amount) : income.amount,
        date: date ? new Date(date) : income.date,
        frequency: frequency || income.frequency,
        category: category || income.category,
        notes: notes || income.notes,
      },
    });

    res.json({ success: true, income: updatedIncome });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const income = await prisma.income.findFirst({
      where: { id, userId: req.userId },
    });

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }

    await prisma.income.delete({ where: { id } });

    res.json({ success: true, message: 'Income deleted successfully' });
  } catch (error) {
    next(error);
  }
};
