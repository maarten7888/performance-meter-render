import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, query } from './config/database';
import { authenticateToken, AuthRequest } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userRoutes from './routes/userRoutes';
import consultantRoutes from './routes/consultantRoutes';
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

// Simpele test routes
app.get('/test', (req, res) => {
  console.log('[App] Root test endpoint hit');
  res.json({ message: 'Root test endpoint werkt!' });
});

app.get('/api/simple-test', (req, res) => {
  console.log('[App] Simple test endpoint hit');
  res.json({ message: 'Simple test endpoint werkt!' });
});

// Test endpoint voor /api route
app.get('/api/test', (req, res) => {
  console.log('[App] Test endpoint hit');
  res.json({ message: 'API test endpoint werkt!' });
});

// API routes met extra logging
app.use('/api/auth', (req, res, next) => {
  console.log('[App] Auth route hit:', req.originalUrl);
  next();
}, authRoutes);

app.use('/api/projects', (req, res, next) => {
  console.log('[App] Projects route hit:', req.originalUrl);
  next();
}, projectRoutes);

app.use('/api/time-entries', (req, res, next) => {
  console.log('[App] Time entries route hit:', req.originalUrl);
  next();
}, timeEntryRoutes);

app.use('/api/users', (req, res, next) => {
  console.log('[App] Users route hit:', req.originalUrl);
  next();
}, userRoutes);

app.use('/api/consultants', (req, res, next) => {
  console.log('[App] Consultants route hit:', req.originalUrl);
  console.log('[App] Consultants path:', req.path);
  console.log('[App] Consultants baseUrl:', req.baseUrl);
  next();
}, consultantRoutes);

// Log alle geregistreerde routes
console.log('[App] Alle routes geregistreerd');
app._router.stack.forEach((r: any) => {
    if (r.route) {
        // Routes zonder parameters
        console.log(`[App] Route geregistreerd: ${Object.keys(r.route.methods)} ${r.route.path}`);
    } else if (r.name === 'router') {
        // Routes met parameters
        console.log(`[App] Router geregistreerd: ${r.regexp}`);
        r.handle.stack.forEach((handler: any) => {
            if (handler.route) {
                console.log(`[App] Parameter route geregistreerd: ${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});

// Logging middleware - must appear after route registration
app.use((req, res, next) => {
  console.log(`[Post-Registration] ${req.method} ${req.path} reached`);
  console.log('[Post-Registration] Base URL:', req.baseUrl);
  console.log('[Post-Registration] Original URL:', req.originalUrl);
  console.log('[Post-Registration] Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// 404 handler - must be AFTER all routes
app.use((req, res) => {
  const message = `Route niet gevonden: ${req.method} ${req.url}`;
  console.log(`[${new Date().toISOString()}] 404 Not Found:`, message);
  console.log('[404] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[404] URL:', req.url);
  console.log('[404] Method:', req.method);
  console.log('[404] Path:', req.path);
  console.log('[404] Query:', req.query);
  res.status(404).json({ error: message });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.url,
    method: req.method,
    headers: req.headers
  });
  res.status(500).json({ message: 'Er is een fout opgetreden op de server' });
});

// Test database connection
pool.query('SELECT 1')
  .then(() => {
    console.log('[Database] Connected successfully');
  })
  .catch((error: Error) => {
    console.error('[Database] Connection error:', error);
  });

export default app;