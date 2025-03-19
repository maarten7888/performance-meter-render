import { Request, Response } from 'express';
import { pool } from '../config/database';

export class UserManagementController {
  // Haal alle gebruikers op met hun jaartargets
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const [users] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users ORDER BY email'
      );
      
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de gebruikers' });
    }
  }

  // Update het jaartarget van een gebruiker
  public async updateYearlyTarget(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { yearlyTarget } = req.body;

      if (yearlyTarget === undefined || yearlyTarget === null) {
        res.status(400).json({ message: 'Jaartarget is verplicht' });
        return;
      }

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearlyTarget, userId]
      );

      res.json({ message: 'Jaartarget succesvol bijgewerkt' });
    } catch (error) {
      console.error('Error updating yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }

  // Haal het jaartarget op van een specifieke gebruiker
  public async getUserYearlyTarget(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const [users] = await pool.query(
        'SELECT yearlyTarget FROM users WHERE id = ?',
        [userId]
      );

      if ((users as any[]).length === 0) {
        res.status(404).json({ message: 'Gebruiker niet gevonden' });
        return;
      }

      res.json({ yearlyTarget: (users as any[])[0].yearlyTarget });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het jaartarget' });
    }
  }
} 