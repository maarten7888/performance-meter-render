import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id },
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    res.json({
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker' });
  }
});

export default router; 