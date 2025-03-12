import { Response } from 'express';
import { pool } from '../config/database';
import { TimeEntry, TimeEntryInput } from '../models/TimeEntry';
import { AuthRequest } from '../middleware/auth';

export class TimeEntryController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { project_id, hours, entry_date }: TimeEntryInput = req.body;
      const user_id = req.user?.id;

      // Verify project belongs to user
      const [projects] = await pool.query(
        'SELECT id FROM projects WHERE id = ? AND user_id = ?',
        [project_id, user_id]
      );

      if (!(projects as any[]).length) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }

      await pool.query(
        'INSERT INTO time_entries (project_id, user_id, hours, entry_date) VALUES (?, ?, ?, ?)',
        [project_id, user_id, hours, entry_date]
      );

      res.status(201).json({ message: 'Time entry created successfully' });
    } catch (error) {
      console.error('Time entry creation error:', error);
      res.status(500).json({ message: 'Error creating time entry' });
    }
  }

  async getMonthlyReport(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;
      const { year = new Date().getFullYear() } = req.query;

      const [entries] = await pool.query(`
        SELECT 
          MONTH(te.entry_date) as month,
          SUM(te.hours) as total_hours,
          SUM(te.hours * p.hourly_rate) as total_amount
        FROM time_entries te
        JOIN projects p ON te.project_id = p.id
        WHERE te.user_id = ? 
        AND YEAR(te.entry_date) = ?
        GROUP BY MONTH(te.entry_date)
        ORDER BY month
      `, [user_id, year]);

      res.json(entries);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      res.status(500).json({ message: 'Error fetching monthly report' });
    }
  }

  async getYearlyTarget(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;
      const year = new Date().getFullYear();
      
      // Calculate total amount for the year from active projects
      const [result] = await pool.query(`
        SELECT 
          SUM(te.hours * p.hourly_rate) as total_amount
        FROM time_entries te
        JOIN projects p ON te.project_id = p.id
        WHERE te.user_id = ? 
        AND YEAR(te.entry_date) = ?
      `, [user_id, year]);

      const totalAmount = (result as any[])[0]?.total_amount || 0;

      // Get all active projects for calculating target
      const [activeProjects] = await pool.query(`
        SELECT hourly_rate
        FROM projects
        WHERE user_id = ?
        AND end_date >= CURRENT_DATE()
      `, [user_id]);

      // Calculate yearly target based on active projects
      const yearlyTarget = (activeProjects as any[]).reduce((sum: number, project: any) => 
        sum + (project.hourly_rate * 1800), 0); // 1800 = target hours per year

      res.json({
        currentAmount: totalAmount,
        yearlyTarget: yearlyTarget,
        progressPercentage: (totalAmount / yearlyTarget) * 100
      });
    } catch (error) {
      console.error('Error fetching yearly target:', error);
      res.status(500).json({ message: 'Error fetching yearly target' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { project_id, hours, entry_date }: TimeEntryInput = req.body;
      const user_id = req.user?.id;

      const [result] = await pool.query(
        'UPDATE time_entries SET project_id = ?, hours = ?, entry_date = ? WHERE id = ? AND user_id = ?',
        [project_id, hours, entry_date, id, user_id]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Time entry not found or unauthorized' });
      }

      res.json({ message: 'Time entry updated successfully' });
    } catch (error) {
      console.error('Time entry update error:', error);
      res.status(500).json({ message: 'Error updating time entry' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      const [result] = await pool.query(
        'DELETE FROM time_entries WHERE id = ? AND user_id = ?',
        [id, user_id]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Time entry not found or unauthorized' });
      }

      res.json({ message: 'Time entry deleted successfully' });
    } catch (error) {
      console.error('Time entry deletion error:', error);
      res.status(500).json({ message: 'Error deleting time entry' });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;

      const [entries] = await pool.query(
        `SELECT 
          t.id,
          t.project_id as projectId,
          p.name as projectName,
          t.hours,
          t.entry_date as date
        FROM time_entries t
        JOIN projects p ON t.project_id = p.id
        WHERE t.user_id = ?
        ORDER BY t.entry_date DESC`,
        [user_id]
      );

      res.json(entries);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      res.status(500).json({ message: 'Error fetching time entries' });
    }
  }
} 