import express from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';
import pool from '../lib/db';
import { RowDataPacket } from 'mysql2';
import { Request, Response } from 'express';
import { User } from '../models/User';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  yearlyTarget?: number;
  firstName?: string;
  lastName?: string;
}

const router = express.Router();
const userController = new UserController();

// Gebruiker ophalen
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, name FROM users WHERE id = ?',
      [req.user.userId]
    );

    const user = users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    res.json({
      id: user.id.toString(),
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker' });
  }
});

router.get('/monthly-data', authenticateToken, async (req, res) => {
  try {
    // Voorlopig dummy data
    const monthlyData = [
      { month: 'Jan', hours: 160, revenue: 12000 },
      { month: 'Feb', hours: 140, revenue: 10500 },
      { month: 'Mar', hours: 180, revenue: 13500 },
      { month: 'Apr', hours: 150, revenue: 11250 },
      { month: 'Mei', hours: 170, revenue: 12750 },
      { month: 'Jun', hours: 160, revenue: 12000 },
      { month: 'Jul', hours: 120, revenue: 9000 },
      { month: 'Aug', hours: 100, revenue: 7500 },
      { month: 'Sep', hours: 160, revenue: 12000 },
      { month: 'Okt', hours: 180, revenue: 13500 },
      { month: 'Nov', hours: 170, revenue: 12750 },
      { month: 'Dec', hours: 140, revenue: 10500 }
    ];
    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de maandelijkse data' });
  }
});

router.get('/year-target', authenticateToken, async (req, res) => {
  try {
    // Voorlopig een vast target
    res.json({ target: 150000 });
  } catch (error) {
    console.error('Error fetching year target:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van het jaardoel' });
  }
});

// Jaartarget bijwerken voor een gebruiker
router.put('/year-target/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { target } = req.body;

    // Controleer of de gebruiker bestaat
    const [users] = await pool.query<UserRow[]>(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    // Update het jaartarget
    await pool.query(
      'UPDATE users SET yearlyTarget = ? WHERE id = ?',
      [target, userId]
    );

    res.json({ message: 'Jaartarget succesvol bijgewerkt' });
  } catch (error) {
    console.error('Error updating year target:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
  }
});

// Alle gebruikers met hun jaartargets ophalen
router.get('/all-with-targets', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, name, yearlyTarget FROM users ORDER BY email ASC'
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Geen gebruikers gevonden' });
    }

    const usersWithTargets = users.map((user: UserRow) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      yearTarget: user.yearlyTarget || 150000 // Gebruik het opgeslagen target of een standaardwaarde
    }));

    res.json({ users: usersWithTargets });
  } catch (error) {
    console.error('Error fetching users with targets:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruikers en hun jaardoelen' });
  }
});

export default router; 