import cron from 'node-cron';
import { prisma } from '../app';
import { startOfMonth, subMonths, endOfMonth } from 'date-fns';

// Schedule monthly summary generation at the start of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('Generating monthly summaries for all users...');
  
  const users = await prisma.user.findMany();
  const lastMonth = subMonths(new Date(), 1);
  const month = lastMonth.getMonth() + 1;
  const year = lastMonth.getFullYear();

  for (const user of users) {
    // Basic summary calculation to store in MonthlySummary table
    const incomes = await prisma.income.aggregate({
      where: { userId: user.id, date: { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) } },
      _sum: { amount: true },
    });
    
    const expenses = await prisma.expense.aggregate({
      where: { userId: user.id, date: { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) } },
      _sum: { amount: true },
    });

    const categoryBreakdown = await prisma.expense.groupBy({
        by: ['category'],
        where: { userId: user.id, date: { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) } },
        _sum: { amount: true },
    });

    const totalIncome = incomes._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const savingsGoal = await prisma.savingsGoal.findFirst({
        where: { userId: user.id, month, year },
    });

    await prisma.monthlySummary.create({
      data: {
        userId: user.id,
        month,
        year,
        totalIncome,
        totalExpenses,
        savingsAchieved: totalIncome - totalExpenses,
        savingsProgress: savingsGoal ? ((totalIncome - totalExpenses) / savingsGoal.targetAmount) * 100 : 0,
        categoryBreakdown: (categoryBreakdown as any[]).map(c => ({ category: c.category, amount: c._sum.amount })),
        topExpenses: [], // Logic to find top 5 expenses could go here
        recommendations: [], // Recommendation algorithm could be triggered here
      },
    });
  }
});
