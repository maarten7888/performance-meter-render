import express from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

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

export default router; 