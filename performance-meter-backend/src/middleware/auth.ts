import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

// Type definitie voor de user in de request
interface RequestUser {
  id: number;
  email: string;
  role: string;
}

// AuthRequest interface voor gebruik in controllers
export interface AuthRequest extends Request {
  user?: RequestUser;
}

// Extend de Request interface om user property toe te voegen
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('Debug: Geen token gevonden in request');
      return res.status(401).json({ message: 'Geen token gevonden' });
    }

    console.log('Debug: Token ontvangen voor verificatie');
    
    // Token decoderen zonder verificatie voor debug doeleinden
    const decodedWithoutVerify = jwt.decode(token);
    console.log('Debug: Token inhoud:', decodedWithoutVerify);
    
    // Token verifiëren
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    console.log('Debug: Geverifieerde token data:', decoded);
    
    // Controleer verplichte velden
    if (!decoded.userId || !decoded.email) {
      console.error('Debug: Ontbrekende verplichte velden in token:', {
        hasUserId: !!decoded.userId,
        hasEmail: !!decoded.email
      });
      return res.status(401).json({ message: 'Ongeldig token formaat' });
    }
    
    // Gebruiker ophalen uit database
    const [users] = await pool.query(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (!(users as any[]).length) {
      console.log('Debug: Gebruiker niet gevonden in database voor id:', decoded.userId);
      return res.status(401).json({ message: 'Ongeldige gebruiker' });
    }

    const user = (users as any[])[0];
    console.log('Debug: Gebruiker gevonden in database:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Gebruiker aan request toevoegen
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log('Debug: Request user object ingesteld:', req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Ongeldig token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Niet geauthenticeerd' });
  }
  
  if (req.user.role !== 'admin') {
    console.log('Debug: Toegang geweigerd - geen admin rechten voor gebruiker:', req.user.email);
    return res.status(403).json({ message: 'Geen toegang. Admin rechten vereist.' });
  }
  
  console.log('Debug: Admin toegang verleend aan:', req.user.email);
  next();
}; 