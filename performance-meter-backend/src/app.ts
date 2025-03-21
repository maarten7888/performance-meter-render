import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import authRoutes from './routes/authRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userRoutes from './routes/userRoutes';
import path from 'path';

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
  credentials: true
};

console.log('[App] Middleware configureren...');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('[Debug] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[Debug] Path:', req.path);
  console.log('[Debug] Base URL:', req.baseUrl);
  console.log('[Debug] Original URL:', req.originalUrl);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('[Debug] Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

console.log('[App] Routes registreren...');

// Handle OPTIONS requests for CORS
app.options('*', cors(corsOptions));

// ======== DIRECT ROUTES WITHOUT ROUTER MIDDLEWARE =========

// Root health check
app.get('/', (req, res) => {
  console.log('[Root] Root route aangeroepen');
  res.json({ message: 'Welcome to Performance Meter API' });
});

// ======== ROUTER REGISTRATION =========

// API routes
console.log('[App] Routes registreren...');
console.log('[App] Base URL:', '/api');

console.log('[App] Auth routes registreren...');
app.use('/api/auth', authRoutes);

console.log('[App] Time entry routes registreren...');
app.use('/api/time-entries', timeEntryRoutes);

console.log('[App] User routes registreren...');
app.use('/api/users', userRoutes);

// Logging middleware - must appear after route registration
app.use((req, res, next) => {
  console.log(`[Post-Registration] ${req.method} ${req.path} reached`);
  console.log('[Post-Registration] Base URL:', req.baseUrl);
  console.log('[Post-Registration] Original URL:', req.originalUrl);
  // Continue down the middleware chain
  next();
});

// ======== ERROR HANDLING =========

// 404 handler - must be AFTER all routes
app.use((req, res) => {
  const message = `Route niet gevonden: ${req.method} ${req.url}`;
  console.log(`[${new Date().toISOString()}] 404 Not Found:`, message);
  console.log('[404] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[404] URL:', req.url);
  console.log('[404] Method:', req.method);
  console.log('[404] Path:', req.path);
  console.log('[404] Query:', req.query);
  res.status(404).json({ message });
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