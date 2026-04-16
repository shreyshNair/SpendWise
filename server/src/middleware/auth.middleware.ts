import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId || decoded.sub;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token payload' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.userId = user.id;
      next();
    } catch (err: any) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Authentication error' });
  }
};
