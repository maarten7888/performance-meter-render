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
      console.log('Debug: Geen token gevonden in request');
      return res.status(401).json({ message: 'Geen token gevonden' });
    }

    console.log('Debug: Token ontvangen voor verificatie');
    
    // Token decoderen zonder verificatie voor debug doeleinden
    const decodedWithoutVerify = jwt.decode(token);
    console.log('Debug: Token inhoud:', decodedWithoutVerify);
    
    // Token verifiëren
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { 
      id: number; 
      email: string; 
      role: string 
    };
    
    console.log('Debug: Geverifieerde token data:', decoded);
    
    // Controleer verplichte velden
    if (!decoded.id || !decoded.email || !decoded.role) {
      console.error('Debug: Ontbrekende verplichte velden in token:', {
        hasId: !!decoded.id,
        hasEmail: !!decoded.email,
        hasRole: !!decoded.role
      });
      return res.status(401).json({ message: 'Ongeldig token formaat' });
    }
    
    // Gebruiker ophalen uit database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('Debug: Gebruiker niet gevonden in database voor id:', decoded.id);
      return res.status(401).json({ message: 'Ongeldige gebruiker' });
    }

    console.log('Debug: Gebruiker gevonden in database:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Verifieer dat de role in het token overeenkomt met de database
    if (decoded.role !== user.role) {
      console.error('Debug: Role mismatch:', { 
        tokenRole: decoded.role, 
        dbRole: user.role 
      });
      return res.status(401).json({ message: 'Ongeldige gebruiker rol' });
    }

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

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
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