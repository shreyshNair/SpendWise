import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

export const createExpense = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { amount, category, subcategory, description, date, tags } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ success: false, message: 'Amount and category are required' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: req.userId,
        amount: parseFloat(amount),
        category,
        subcategory,
        description,
        date: date ? new Date(date) : new Date(),
        tags: tags || {},
      },
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, category, minAmount, maxAmount } = req.query;

    const where: any = {
      userId: req.userId,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (category) {
      where.category = category;
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount as string);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount as string);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const total = await prisma.expense.count({ where });

    res.json({ success: true, expenses, total });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { amount, category, subcategory, description, date, tags } = req.body;

    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : expense.amount,
        category: category || expense.category,
        subcategory,
        description,
        date: date ? new Date(date) : expense.date,
        tags: tags || expense.tags,
      },
    });

    res.json({ success: true, expense: updatedExpense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id } });

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
