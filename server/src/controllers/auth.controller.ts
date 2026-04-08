import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Provide a valid URL structure as fallback so createClient doesn't crash the Lambda on boot.
const SUPABASE_URL = process.env.SUPABASE_URL?.startsWith('http') 
  ? process.env.SUPABASE_URL 
  : 'https://placeholder.supabase.co';

// They added their anon key to ANON_PUBLIC, so we look for that first just in case.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.ANON_PUBLIC || 'placeholder-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        }
      }
    });

    if (authError || !authData.user) {
      return res.status(400).json({ success: false, message: authError?.message || 'Failed to create Supabase user' });
    }

    // 2. Mirror the user in our Prisma database
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: authData.user.id, // match Supabase UUID
          email,
          passwordHash: 'supabase', // We no longer store the hash
          firstName,
          lastName,
        },
      });
    }

    const token = authData.session?.access_token || jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Attempt login with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      return res.status(401).json({ success: false, message: authError?.message || 'Invalid credentials' });
    }

    // Check if user exists in Prisma DB (for backwards compatibility/relations)
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
       // Auto-create if they somehow logged in but aren't in public schema
       user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email,
          passwordHash: 'supabase',
          firstName: authData.user.user_metadata?.firstName || 'User',
          lastName: authData.user.user_metadata?.lastName || '',
        },
      });
    }

    res.json({
      success: true,
      token: authData.session.access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
        currencyPreference: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
