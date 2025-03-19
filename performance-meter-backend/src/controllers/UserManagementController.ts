import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types/express';

export class UserManagementController {
  // Haal alle gebruikers op met hun jaartargets
  public async getAllUsers(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        console.log('Debug: Geen user ID gevonden in request');
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      console.log('Debug: getAllUsers aangeroepen door user:', userId);
      console.log('Debug: Request headers:', req.headers);

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
  public async updateYearlyTarget(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        console.log('Debug: Geen user ID gevonden in request');
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { userId: targetUserId } = req.params;
      const { yearlyTarget } = req.body;

      console.log('Debug: updateYearlyTarget aangeroepen door user:', userId, 'voor user:', targetUserId);
      console.log('Debug: Request headers:', req.headers);

      if (yearlyTarget === undefined || yearlyTarget === null) {
        console.log('Debug: Jaartarget ontbreekt in request');
        return res.status(400).json({ message: 'Jaartarget is verplicht' });
      }

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearlyTarget, targetUserId]
      );

      console.log('Debug: Jaartarget bijgewerkt voor gebruiker:', targetUserId);
      res.json({ message: 'Jaartarget succesvol bijgewerkt' });
    } catch (error) {
      console.error('Error updating yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }

  // Haal het jaartarget op van een specifieke gebruiker
  public async getUserYearlyTarget(req: AuthRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        console.log('Debug: Geen user ID gevonden in request');
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { userId: targetUserId } = req.params;

      console.log('Debug: getUserYearlyTarget aangeroepen door user:', userId, 'voor user:', targetUserId);
      console.log('Debug: Request headers:', req.headers);

      const [users] = await pool.query(
        'SELECT yearlyTarget FROM users WHERE id = ?',
        [targetUserId]
      );

      if ((users as any[]).length === 0) {
        console.log('Debug: Gebruiker niet gevonden:', targetUserId);
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }

      console.log('Debug: Jaartarget opgehaald voor gebruiker:', targetUserId);
      res.json({ yearlyTarget: (users as any[])[0].yearlyTarget });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het jaartarget' });
    }
  }
} 