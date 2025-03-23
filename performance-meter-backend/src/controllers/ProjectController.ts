import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types/express';
import { RowDataPacket } from 'mysql2';

interface ProjectRow extends RowDataPacket {
  id: number;
  name: string;
  hourly_rate: number;
  start_date: Date;
  end_date: Date;
  user_id: number;
}

export class ProjectController {
  async getProjects(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Niet geautoriseerd' });
      }

      const [projects] = await pool.query<ProjectRow[]>(
        'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE user_id = ?',
        [userId]
      );

      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de projecten' });
    }
  }

  async getProject(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Niet geautoriseerd' });
      }

      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Ongeldig project ID' });
      }

      const [projects] = await pool.query<ProjectRow[]>(
        'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE id = ? AND user_id = ?',
        [projectId, userId]
      );

      if (!projects.length) {
        return res.status(404).json({ error: 'Project niet gevonden' });
      }

      res.json(projects[0]);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van het project' });
    }
  }

  async createProject(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Niet geautoriseerd' });
      }

      const { name, hourlyRate, startDate, endDate } = req.body;

      if (!name || hourlyRate === undefined || !startDate || !endDate) {
        return res.status(400).json({ error: 'Alle velden zijn verplicht' });
      }

      const [result] = await pool.query(
        'INSERT INTO projects (name, hourly_rate, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
        [name, hourlyRate, new Date(startDate), new Date(endDate), userId]
      );

      const [newProject] = await pool.query<ProjectRow[]>(
        'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE id = ?',
        [(result as any).insertId]
      );

      res.status(201).json(newProject[0]);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van het project' });
    }
  }

  async deleteProject(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Niet geautoriseerd' });
      }

      const { id } = req.params;

      // Controleer of er tijdregistraties zijn
      const [timeEntries] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM time_entries WHERE project_id = ?',
        [id]
      );

      if (timeEntries[0]?.count > 0) {
        return res.status(400).json({ 
          error: 'Kan project niet verwijderen omdat er tijdregistraties aan gekoppeld zijn' 
        });
      }

      await pool.query(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      res.json({ message: 'Project succesvol verwijderd' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van het project' });
    }
  }
} 