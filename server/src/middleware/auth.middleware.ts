import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Provide a valid URL structure as fallback
const SUPABASE_URL = process.env.SUPABASE_URL?.startsWith('http') 
  ? process.env.SUPABASE_URL 
  : 'https://placeholder.supabase.co';

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    // Supabase validation
    const { data, error } = await supabase.auth.getUser(token);

    let user;

    if (data && data.user && !error) {
       // Find user by email in case their Prisma UUID differs from their Supabase UUID (migrated users)
       if (data.user.email) {
         user = await prisma.user.findUnique({ where: { email: data.user.email } });
       }
       // Fallback to searching by ID if needed
       if (!user && data.user.id) {
         user = await prisma.user.findUnique({ where: { id: data.user.id } });
       }
    } else {
       // Fallback for legacy custom JWTs
       try {
         const decoded: any = jwt.verify(token, JWT_SECRET);
         const userId = decoded.sub || decoded.userId;
         if (userId) {
           user = await prisma.user.findUnique({ where: { id: userId } });
         }
       } catch (err: any) {
         return res.status(401).json({ success: false, message: 'Invalid token: ' + err.message });
       }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.userId = user.id; // Use the Prisma user's ID
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Authentication error' });
  }
};
