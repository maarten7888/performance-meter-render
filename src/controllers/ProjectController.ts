import { Response } from 'express';
import { pool } from '../config/database';
import { Project, ProjectInput } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export class ProjectController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { name, hourly_rate, start_date, end_date }: ProjectInput = req.body;
      const user_id = req.user?.id;

      const [result] = await pool.query(
        'INSERT INTO projects (name, hourly_rate, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
        [name, hourly_rate, start_date, end_date, user_id]
      );

      res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
      console.error('Project creation error:', error);
      res.status(500).json({ message: 'Error creating project' });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;
      const [projects] = await pool.query<Project[]>(
        'SELECT * FROM projects WHERE user_id = ? ORDER BY start_date DESC',
        [user_id]
      );

      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  }

  async getActive(req: AuthRequest, res: Response) {
    try {
      const user_id = req.user?.id;
      const currentDate = new Date().toISOString().split('T')[0];
      
      const [projects] = await pool.query<Project[]>(
        'SELECT * FROM projects WHERE user_id = ? AND end_date >= ? ORDER BY start_date',
        [user_id, currentDate]
      );

      res.json(projects);
    } catch (error) {
      console.error('Error fetching active projects:', error);
      res.status(500).json({ message: 'Error fetching active projects' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, hourly_rate, start_date, end_date }: ProjectInput = req.body;
      const user_id = req.user?.id;

      const [result] = await pool.query(
        'UPDATE projects SET name = ?, hourly_rate = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ?',
        [name, hourly_rate, start_date, end_date, id, user_id]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }

      res.json({ message: 'Project updated successfully' });
    } catch (error) {
      console.error('Project update error:', error);
      res.status(500).json({ message: 'Error updating project' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      // First check if there are any time entries for this project
      const [timeEntries] = await pool.query(
        'SELECT COUNT(*) as count FROM time_entries WHERE project_id = ?',
        [id]
      );

      if ((timeEntries as any[])[0]?.count > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete project with existing time entries' 
        });
      }

      const [result] = await pool.query(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [id, user_id]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Project deletion error:', error);
      res.status(500).json({ message: 'Error deleting project' });
    }
  }
} 