import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';
import process from 'node:process';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@spendwise.com' },
    update: {},
    create: {
      email: 'demo@spendwise.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      currencyPreference: 'INR',
    },
  });

  console.log('User created:', user.email);

  await prisma.income.createMany({
    data: [
      { userId: user.id, source: 'Salary', amount: 85000, category: 'Employment', date: new Date(), frequency: 'monthly' },
      { userId: user.id, source: 'Freelance Project', amount: 15000, category: 'Freelance', date: new Date(), frequency: 'one-time' },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { userId: user.id, amount: 1200, category: 'Food & Dining', description: 'Dinner with friends', date: new Date() },
      { userId: user.id, amount: 450, category: 'Transportation', description: 'Uber to work', date: new Date() },
      { userId: user.id, amount: 3500, category: 'Utilities & Bills', description: 'Electricity bill', date: new Date() },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
