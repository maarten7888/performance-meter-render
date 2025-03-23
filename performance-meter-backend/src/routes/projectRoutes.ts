import express, { Request } from 'express';
import { pool, query } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

interface ProjectRow extends RowDataPacket {
    id: number;
    name: string;
    hourly_rate: number;
    start_date: Date;
    end_date: Date;
    user_id: number;
}

// Extend Request type to include user
interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

// Verwijderen van een project
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
    console.log('=== DELETE Route Hit ===');
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    console.log('User:', req.user);
    console.log('Project ID:', req.params.id);
    console.log('=====================');
    
    try {
        if (!req.user?.id) {
            console.error('User ID is missing in request');
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const { id } = req.params;
        console.log('Attempting to delete project:', { id, userId: req.user.id });

        // Controleer eerst of het project bestaat en van de juiste gebruiker is
        console.log('Checking if project exists and belongs to user...');
        const project = await query(
            'SELECT id FROM projects WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        console.log('Project check result:', project);

        if (!(project as any[]).length) {
            console.log('Project not found or unauthorized:', { id, userId: req.user.id });
            return res.status(404).json({ error: 'Project niet gevonden of niet geautoriseerd' });
        }

        // Controleer of er tijdregistraties zijn voor dit project
        console.log('Checking for time entries...');
        const timeEntries = await query(
            'SELECT COUNT(*) as count FROM time_entries WHERE project_id = ?',
            [id]
        );
        console.log('Time entries check result:', timeEntries);

        if ((timeEntries as any[])[0]?.count > 0) {
            console.log('Cannot delete project with time entries:', { id, count: (timeEntries as any[])[0].count });
            return res.status(400).json({ 
                error: 'Kan project niet verwijderen omdat er tijdregistraties aan gekoppeld zijn' 
            });
        }

        // Verwijder het project
        console.log('Executing delete query...');
        const result = await query(
            'DELETE FROM projects WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );
        console.log('Delete query result:', result);

        if ((result as any).affectedRows === 0) {
            console.log('No rows affected when deleting project:', { id, userId: req.user.id });
            return res.status(404).json({ error: 'Project niet gevonden of niet geautoriseerd' });
        }

        console.log('Project successfully deleted:', { id, userId: req.user.id });
        res.json({ message: 'Project succesvol verwijderd' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van het project' });
    }
});

// Ophalen van een individueel project
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
    console.log('=== GET Single Project Route Hit ===');
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    console.log('User:', req.user);
    console.log('Project ID:', req.params.id);
    console.log('=====================');
    
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const { id } = req.params;
        
        // Gebruik dezelfde query structuur als de werkende route
        const [projects] = await pool.query<ProjectRow[]>(
            'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (!projects.length) {
            return res.status(404).json({ error: 'Project niet gevonden' });
        }

        const project = projects[0];
        res.json({
            id: project.id,
            name: project.name,
            hourlyRate: project.hourly_rate,
            startDate: project.start_date,
            endDate: project.end_date
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van het project' });
    }
});

// Ophalen van alle projecten voor de ingelogde gebruiker
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user?.id) {
            console.error('User ID is missing in request');
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const [projects] = await pool.query<ProjectRow[]>(
            'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE user_id = ?',
            [req.user.id]
        );

        res.json(projects.map((project: ProjectRow) => ({
            id: project.id,
            name: project.name,
            hourlyRate: project.hourly_rate,
            startDate: project.start_date,
            endDate: project.end_date
        })));
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de projecten' });
    }
});

// Aanmaken van een nieuw project
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user?.id) {
            console.error('User ID is missing in request');
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const { name, hourlyRate, startDate, endDate } = req.body;

        if (!name || hourlyRate === undefined || !startDate || !endDate) {
            return res.status(400).json({ error: 'Alle velden zijn verplicht' });
        }

        console.log('Received project data:', { 
            name, 
            hourlyRate, 
            startDate, 
            endDate,
            userId: req.user.id 
        });

        const [result] = await pool.query(
            'INSERT INTO projects (name, hourly_rate, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
            [name, hourlyRate, new Date(startDate), new Date(endDate), req.user.id]
        );

        const [newProject] = await pool.query<ProjectRow[]>(
            'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE id = ?',
            [(result as any).insertId]
        );

        res.status(201).json({
            id: newProject[0].id,
            name: newProject[0].name,
            hourlyRate: newProject[0].hourly_rate,
            startDate: newProject[0].start_date,
            endDate: newProject[0].end_date
        });
    } catch (error) {
        console.error('Project creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
        res.status(500).json({ error: `Er is een fout opgetreden bij het aanmaken van het project: ${errorMessage}` });
    }
});

export default router; 