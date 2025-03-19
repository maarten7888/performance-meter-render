import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import authRoutes from './routes/authRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userManagementRoutes from './routes/userManagementRoutes';
import userRoutes from './routes/userRoutes';
import { UserManagementController } from './controllers/UserManagementController';
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

// Super simple diagnostics route
app.get('/all-routes', (req, res) => {
  console.log('[Debug] All routes endpoint aangeroepen');
  res.json({ 
    message: 'All routes diagnostics',
    cwd: process.cwd(),
    dirname: __dirname,
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version
  });
});

// Simple mock data route
app.get('/api/mock/users', (req, res) => {
  console.log('[Mock] Mock users endpoint aangeroepen');
  res.json({
    users: [
      { id: 1, email: 'test1@example.com', yearlyTarget: 1000 },
      { id: 2, email: 'test2@example.com', yearlyTarget: 1500 },
      { id: 3, email: 'test3@example.com', yearlyTarget: 2000 }
    ]
  });
});

// ======== USER MANAGEMENT DIRECT ROUTES =========
const directUserController = new UserManagementController();

// All users route (no auth)
app.get('/api/user-management/users', (req, res) => {
  console.log('[Direct] Get users endpoint aangeroepen');
  directUserController.getAllUsers(req, res);
});

// Update target (no auth)
app.put('/api/user-management/users/:userId/yearly-target', (req, res) => {
  console.log('[Direct] Update target endpoint aangeroepen');
  directUserController.updateYearlyTarget(req, res);
});

// Get target (no auth)
app.get('/api/user-management/users/:userId/yearly-target', (req, res) => {
  console.log('[Direct] Get target endpoint aangeroepen');
  directUserController.getUserYearlyTarget(req, res);
});

// ======== ROUTER REGISTRATION =========

// API routes
console.log('[App] Auth routes registreren...');
app.use('/api/auth', authRoutes);

console.log('[App] Time entry routes registreren...');
app.use('/api/time-entries', timeEntryRoutes);

console.log('[App] User routes registreren...');
app.use('/api/users', userRoutes);

// Logging middleware - must appear after route registration
app.use((req, res, next) => {
  console.log(`[Post-Registration] ${req.method} ${req.path} reached`);
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