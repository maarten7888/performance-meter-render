import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, query } from './config/database';
import { authenticateToken, AuthRequest } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userRoutes from './routes/userRoutes';
import consultantProfileRoutes from './routes/consultantProfileRoutes';
import projectRoutes from './routes/projectRoutes';
import path from 'path';

// Debug logging voor imports
console.log('[App] Start imports...');
console.log('[App] Current directory:', process.cwd());
console.log('[App] __dirname:', __dirname);

console.log('[App] Imports voltooid');
console.log('[App] Project routes module:', projectRoutes);

dotenv.config();

// Log working directory and file existence
console.log('[App] Process Current Directory:', process.cwd());
console.log('[App] __dirname:', __dirname);
console.log('[App] App.ts location:', path.resolve(__filename));

const app = express();

// CORS configuratie
const corsOptions = {
  origin: [
    'https://pm.tothepointcompany.nl',
    'http://localhost:3000',
    'https://performance-meter-render-6i1b.onrender.com',
    'https://performance-meter.vercel.app',
    '*'  // Add a wildcard for troubleshooting
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Toegevoegd voor OPTIONS requests
};

console.log('[App] Middleware configureren...');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware voor ALLE requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('[Debug] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[Debug] Path:', req.path);
  console.log('[Debug] Base URL:', req.baseUrl);
  console.log('[Debug] Original URL:', req.originalUrl);
  console.log('[Debug] Method:', req.method);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('[Debug] Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

console.log('[App] Routes registreren...');
console.log('[App] Base URL:', '/api');

// Test DELETE route
app.delete('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    console.log('=== Direct DELETE Route Hit ===');
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    console.log('User:', req.user);
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

// Project routes
console.log('[App] Project routes registreren op /api/projects...');
app.use('/api/projects', projectRoutes);
console.log('[App] Project routes geregistreerd');

// Auth routes
console.log('[App] Auth routes registreren op /api/auth...');
app.use('/api/auth', authRoutes);
console.log('[App] Auth routes geregistreerd');

// Time entry routes
console.log('[App] Time entry routes registreren op /api/time-entries...');
app.use('/api/time-entries', timeEntryRoutes);
console.log('[App] Time entry routes geregistreerd');

// User routes
console.log('[App] User routes registreren op /api/users...');
app.use('/api/users', userRoutes);
console.log('[App] User routes geregistreerd');

// Consultant profile routes
console.log('[App] Consultant profile routes registreren op /api/consultant-profiles...');
app.use('/api/consultant-profiles', consultantProfileRoutes);
console.log('[App] Consultant profile routes geregistreerd');

// Log alle geregistreerde routes
console.log('[App] Alle routes geregistreerd');
app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
        console.log(`[App] Route geregistreerd: ${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

// Logging middleware - must appear after route registration
app.use((req, res, next) => {
  console.log(`