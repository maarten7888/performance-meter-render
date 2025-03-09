import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Geen toegangstoken gevonden' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      id: number;
      email: string;
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Ongeldig toegangstoken' });
  }
}; 