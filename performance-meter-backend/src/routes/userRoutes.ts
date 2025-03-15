import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// @ts-ignore - TypeScript heeft moeite met de type definitie van de middleware
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id },
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    // Debug logging
    console.log('User found in /me:', user.toJSON());

    const userData = {
      id: user.id.toString(),
      email: user.email,
      name: user.email.split('@')[0],
      role: user.role
    };

    console.log('Sending user data:', userData);

    res.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker' });
  }
});

export default router; 