import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Geen token gevonden' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; email: string; role: string };
    
    // Debug logging voor token data
    console.log('Decoded token:', decoded);
    
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Ongeldige gebruiker' });
    }

    // Verifieer dat de role in het token overeenkomt met de database
    if (decoded.role !== user.role) {
      console.error('Role mismatch:', { tokenRole: decoded.role, dbRole: user.role });
      return res.status(401).json({ message: 'Ongeldige gebruiker rol' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Debug logging voor user data
    console.log('Authenticated user:', req.user);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ongeldig token' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Geen toegang. Admin rechten vereist.' });
  }
  next();
}; 