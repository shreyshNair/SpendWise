import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const getDashboard = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [incomeData, expenseData, categoryData] = await Promise.all([
      prisma.income.aggregate({
        where: { userId, date: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { userId, date: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { userId, date: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }) as Promise<(any & { category: string; _sum: { amount: number | null } })[]>,
    ]);

    const totalIncome = incomeData._sum.amount || 0;
    const totalExpenses = expenseData._sum.amount || 0;
    const remainingSavings = totalIncome - totalExpenses;

    // Daily spending trend for current month
    const expenses = await prisma.expense.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
      select: { date: true, amount: true },
      orderBy: { date: 'asc' },
    });

    const dailyTrend = expenses.reduce((acc: any, curr) => {
      const date = format(curr.date, 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + curr.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        remainingSavings,
        daysRemaining: endOfMonth(now).getDate() - now.getDate(),
      },
      categoryBreakdown: categoryData.map((c) => ({
        category: c.category,
        amount: c._sum.amount,
        percentage: totalExpenses > 0 ? ((c._sum.amount || 0) / totalExpenses) * 100 : 0,
      })),
      dailyTrend: Object.entries(dailyTrend).map(([date, amount]) => ({ date, amount })),
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    const [currentMonthExpenses, previousMonthExpenses] = await Promise.all([
      prisma.expense.groupBy({
        by: ['category'],
        where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { userId, date: { gte: previousMonthStart, lte: previousMonthEnd } },
        _sum: { amount: true },
      }),
    ]);

    const recommendations = (currentMonthExpenses as any[]).map((curr: any) => {
      const prev = (previousMonthExpenses as any[]).find((p) => p.category === curr.category);
      const currAmount = curr._sum.amount || 0;
      const prevAmount = prev ? prev._sum.amount || 0 : 0;
      const percentChange = prevAmount > 0 ? ((currAmount - prevAmount) / prevAmount) * 100 : 100;

      let message = '';
      let potentialSavings = 0;
      let trend = 'STABLE';

      if (percentChange > 10) {
        trend = 'UP';
        message = `You spent ${percentChange.toFixed(1)}% more on ${curr.category} compared to last month.`;
        potentialSavings = currAmount * 0.1; // Suggesting a 10% reduction
      } else if (percentChange < -10) {
        trend = 'DOWN';
        message = `Great job! You spent ${Math.abs(percentChange).toFixed(1)}% less on ${curr.category} compared to last month.`;
      }

      return {
        category: curr.category,
        currentAmount: currAmount,
        trend,
        message,
        potentialSavings,
        action: potentialSavings > 0 ? `Try reducing ${curr.category} spending by ${potentialSavings.toFixed(0)} to save more.` : 'Keep up the good work!',
      };
    });

    res.json({ success: true, recommendations: recommendations.filter(r => r.potentialSavings > 0 || r.trend === 'UP').sort((a,b) => b.potentialSavings - a.potentialSavings) });
  } catch (error) {
    next(error);
  }
};
