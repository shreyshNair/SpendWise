import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const expenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string(),
  subcategory: z.string().optional().nullable(),
  description: z.string().max(200).optional().nullable(),
  date: z.string().optional(),
  tags: z.any().optional(),
});

export const incomeSchema = z.object({
  source: z.string().min(2),
  amount: z.number().positive(),
  date: z.string().optional(),
  frequency: z.enum(['one-time', 'weekly', 'monthly']),
  category: z.string(),
  notes: z.string().optional().nullable(),
});

export const goalSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  targetAmount: z.number().positive(),
});
