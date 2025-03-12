import express, { Request } from 'express';
import { db } from '../database/db';
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
    };
}

// Ophalen van alle projecten voor de ingelogde gebruiker
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user?.id) {
            console.error('User ID is missing in request');
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const [projects] = await db.query<ProjectRow[]>(
            'SELECT id, name, hourly_rate, start_date, end_date FROM projects WHERE user_id = ?',
            [req.user.id]
        );

        res.json(projects.map(project => ({
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
        // Controleer eerst of er een gebruiker ID is
        if (!req.user?.id) {
            console.error('User ID is missing in request');
            return res.status(401).json({ error: 'Niet geautoriseerd' });
        }

        const { name, hourlyRate, startDate, endDate } = req.body;

        if (!name || hourlyRate === undefined || !startDate || !endDate) {
            return res.status(400).json({ error: 'Alle velden zijn verplicht' });
        }

        // Log de ontvangen data voor debugging
        console.log('Received project data:', { 
            name, 
            hourlyRate, 
            startDate, 
            endDate,
            userId: req.user.id 
        });

        const [result] = await db.query(
            'INSERT INTO projects (name, hourly_rate, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
            [name, hourlyRate, new Date(startDate), new Date(endDate), req.user.id]
        );

        const [newProject] = await db.query<ProjectRow[]>(
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