import express, { Response, Request } from 'express';
import { authenticateToken } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// @ts-ignore - TypeScript heeft moeite met de type definitie van de middleware
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('Debug: Request user from token:', req.user);

    const user = await User.findOne({
      where: { id: req.user?.id },
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      console.log('Debug: No user found in database');
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    // Debug logging voor database user
    console.log('Debug: User from database:', user.toJSON());

    const userData = {
      id: user.id.toString(),
      email: user.email,
      name: user.email.split('@')[0],
      role: user.role // Expliciet de role meegeven
    };

    // Debug logging voor response data
    console.log('Debug: Sending user data:', userData);

    res.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker' });
  }
});

export default router; 