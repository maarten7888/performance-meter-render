import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types/express';

export class TimeEntryController {
  async getTimeEntries(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const [entries] = await pool.query(
        `SELECT te.*, p.name as projectName 
         FROM time_entries te 
         JOIN projects p ON te.projectId = p.id 
         WHERE te.userId = ? 
         ORDER BY te.date DESC`,
        [userId]
      );

      res.json(entries);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de tijdregistraties' });
    }
  }

  async createTimeEntry(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { projectId, date, hours, description } = req.body;

      const [result] = await pool.query(
        'INSERT INTO time_entries (userId, projectId, date, hours, description) VALUES (?, ?, ?, ?, ?)',
        [userId, projectId, date, hours, description]
      );

      res.status(201).json({ id: (result as any).insertId, message: 'Tijdregistratie succesvol toegevoegd' });
    } catch (error) {
      console.error('Error creating time entry:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het toevoegen van de tijdregistratie' });
    }
  }

  async updateTimeEntry(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { id } = req.params;
      const { projectId, date, hours, description } = req.body;

      await pool.query(
        'UPDATE time_entries SET projectId = ?, date = ?, hours = ?, description = ? WHERE id = ? AND userId = ?',
        [projectId, date, hours, description, id, userId]
      );

      res.json({ message: 'Tijdregistratie succesvol bijgewerkt' });
    } catch (error) {
      console.error('Error updating time entry:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van de tijdregistratie' });
    }
  }

  async deleteTimeEntry(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { id } = req.params;

      await pool.query(
        'DELETE FROM time_entries WHERE id = ? AND userId = ?',
        [id, userId]
      );

      res.json({ message: 'Tijdregistratie succesvol verwijderd' });
    } catch (error) {
      console.error('Error deleting time entry:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het verwijderen van de tijdregistratie' });
    }
  }

  async getMonthlyReport(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const [entries] = await pool.query(
        `SELECT 
          MONTH(te.date) as month,
          SUM(te.hours) as total_hours,
          SUM(te.hours * p.hourlyRate) as total_amount
         FROM time_entries te 
         JOIN projects p ON te.projectId = p.id 
         WHERE te.userId = ? 
         AND YEAR(te.date) = YEAR(CURRENT_DATE())
         GROUP BY MONTH(te.date)
         ORDER BY month ASC`,
        [userId]
      );

      res.json(entries);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het maandoverzicht' });
    }
  }

  async getYearlyTarget(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      // Haal het jaardoel op van de gebruiker
      const [user] = await pool.query(
        'SELECT yearlyTarget FROM users WHERE id = ?',
        [userId]
      );

      const yearlyTarget = (user as any[])[0]?.yearlyTarget || 0;

      // Bereken het totaal gefactureerd bedrag voor het huidige jaar
      const [result] = await pool.query(
        `SELECT SUM(te.hours * p.hourlyRate) as currentAmount
         FROM time_entries te 
         JOIN projects p ON te.projectId = p.id 
         WHERE te.userId = ? 
         AND YEAR(te.date) = YEAR(CURRENT_DATE())`,
        [userId]
      );

      const currentAmount = (result as any[])[0]?.currentAmount || 0;
      const progressPercentage = yearlyTarget > 0 ? (currentAmount / yearlyTarget) * 100 : 0;

      res.json({
        currentAmount,
        yearlyTarget,
        progressPercentage
      });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het jaardoel' });
    }
  }
} 