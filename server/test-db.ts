import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    const users = await prisma.user.findMany();
    console.log('Connection successful! Users found:', users.length);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
