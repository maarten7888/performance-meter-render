import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

export class UserManagementController {
  // Haal alle gebruikers op met hun jaartargets
  public async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('Debug: getAllUsers aangeroepen');
      console.log('Debug: Request headers:', req.headers);
      console.log('Debug: Authenticated user:', req.user);

      const [users] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users ORDER BY email'
      );
      
      console.log('Debug: Users opgehaald uit database:', users);
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de gebruikers' });
    }
  }

  // Update het jaartarget van een specifieke gebruiker
  public async updateYearlyTarget(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { yearlyTarget } = req.body;

      console.log('Debug: updateYearlyTarget aangeroepen', { userId, yearlyTarget });
      console.log('Debug: Request headers:', req.headers);
      console.log('Debug: Authenticated user:', req.user);

      if (yearlyTarget === undefined || yearlyTarget === null) {
        console.log('Debug: Jaartarget ontbreekt in request');
        res.status(400).json({ message: 'Jaartarget is verplicht' });
        return;
      }

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearlyTarget, userId]
      );

      console.log('Debug: Jaartarget bijgewerkt voor gebruiker:', userId);
      res.json({ message: 'Jaartarget succesvol bijgewerkt' });
    } catch (error) {
      console.error('Error updating yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }

  // Haal het jaartarget op van een specifieke gebruiker
  public async getUserYearlyTarget(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      console.log('Debug: getUserYearlyTarget aangeroepen voor gebruiker:', userId);
      console.log('Debug: Request headers:', req.headers);
      console.log('Debug: Authenticated user:', req.user);

      const [users] = await pool.query(
        'SELECT yearlyTarget FROM users WHERE id = ?',
        [userId]
      );

      if ((users as any[]).length === 0) {
        console.log('Debug: Gebruiker niet gevonden:', userId);
        res.status(404).json({ message: 'Gebruiker niet gevonden' });
        return;
      }

      console.log('Debug: Jaartarget opgehaald voor gebruiker:', userId);
      res.json({ yearlyTarget: (users as any[])[0].yearlyTarget });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het jaartarget' });
    }
  }
} 