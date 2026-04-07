import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import incomeRoutes from './routes/income.routes';
import goalRoutes from './routes/goal.routes';
import analyticsRoutes from './routes/analytics.routes';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const app = express();
const prisma = new PrismaClient().$extends(withAccelerate());

// Middleware
// Helmet can conflict with Vercel serverless; disable in production
if (process.env.NODE_ENV !== 'production') {
  app.use(helmet());
}
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://spend-wise-ivory.vercel.app',
    'https://spend-wise-xi-ten.vercel.app',
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.json({ message: 'SpendWise API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { prisma };
export default app;
