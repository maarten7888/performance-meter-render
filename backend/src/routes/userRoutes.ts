import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all users with their year targets
router.get('/all-with-targets', authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        yearlyTarget: true,
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      yearTarget: user.yearlyTarget || 150000,
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users with targets:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruikers' });
  }
});

// Update user's year target
router.put('/year-target/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { target } = req.body;

    if (!target || isNaN(Number(target))) {
      return res.status(400).json({ error: 'Ongeldig jaartarget' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { yearlyTarget: Number(target) },
    });

    res.json({
      message: 'Jaartarget succesvol bijgewerkt',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        yearTarget: updatedUser.yearlyTarget,
      },
    });
  } catch (error) {
    console.error('Error updating year target:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
  }
});

export default router; 