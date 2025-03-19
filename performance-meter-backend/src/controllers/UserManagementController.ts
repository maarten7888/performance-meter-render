import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types/express';

export class UserManagementController {
  // Haal alle gebruikers op met hun jaartargets
  public async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      console.log('Debug: getAllUsers aangeroepen door user:', userId);

      const [users] = await pool.query(
        `SELECT u.id, u.email, u.yearlyTarget,
         COUNT(DISTINCT te.id) as totalTimeEntries,
         SUM(te.hours) as totalHours
         FROM users u
         LEFT JOIN time_entries te ON u.id = te.userId
         GROUP BY u.id, u.email, u.yearlyTarget
         ORDER BY u.email`
      );
      
      console.log('Debug: Users opgehaald uit database:', users);
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de gebruikers' });
    }
  }

  // Update het jaartarget van een specifieke gebruiker
  public async updateYearlyTarget(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { userId: targetUserId } = req.params;
      const { yearlyTarget } = req.body;

      console.log('Debug: updateYearlyTarget aangeroepen door user:', userId, 'voor user:', targetUserId);

      if (yearlyTarget === undefined || yearlyTarget === null) {
        return res.status(400).json({ message: 'Jaartarget is verplicht' });
      }

      // Controleer eerst of de gebruiker bestaat
      const [existingUser] = await pool.query(
        'SELECT id FROM users WHERE id = ?',
        [targetUserId]
      );

      if ((existingUser as any[]).length === 0) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearlyTarget, targetUserId]
      );

      console.log('Debug: Jaartarget bijgewerkt voor gebruiker:', targetUserId);
      res.json({ 
        message: 'Jaartarget succesvol bijgewerkt',
        userId: targetUserId,
        yearlyTarget 
      });
    } catch (error) {
      console.error('Error updating yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }

  // Haal het jaartarget op van een specifieke gebruiker
  public async getUserYearlyTarget(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { userId: targetUserId } = req.params;

      console.log('Debug: getUserYearlyTarget aangeroepen door user:', userId, 'voor user:', targetUserId);

      const [users] = await pool.query(
        `SELECT u.yearlyTarget,
         COUNT(DISTINCT te.id) as totalTimeEntries,
         SUM(te.hours) as totalHours
         FROM users u
         LEFT JOIN time_entries te ON u.id = te.userId
         WHERE u.id = ?
         GROUP BY u.yearlyTarget`,
        [targetUserId]
      );

      if ((users as any[]).length === 0) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }

      const userData = (users as any[])[0];
      console.log('Debug: Jaartarget opgehaald voor gebruiker:', targetUserId);
      
      res.json({ 
        yearlyTarget: userData.yearlyTarget,
        totalTimeEntries: userData.totalTimeEntries,
        totalHours: userData.totalHours
      });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het jaartarget' });
    }
  }
} 