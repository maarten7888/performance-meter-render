import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database';
import authRoutes from './routes/authRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userManagementRoutes from './routes/userManagementRoutes';
import userRoutes from './routes/userRoutes';
import { UserManagementController } from './controllers/UserManagementController';

dotenv.config();

const app = express();

// CORS configuratie
const corsOptions = {
  origin: [
    'https://pm.tothepointcompany.nl',
    'http://localhost:3000',
    'https://performance-meter-render-6i1b.onrender.com',
    'https://performance-meter.vercel.app'
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

// Nieuwe test route om te verifiëren dat routes werken
app.get('/api/test', (req, res) => {
  console.log('[Test] Route aangeroepen');
  res.json({ status: 'ok', message: 'Test route werkt correct', timestamp: new Date().toISOString() });
});

// Health check route
app.get('/', (req, res) => {
  console.log('[Health Check] Route aangeroepen');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Debug route
app.get('/debug/routes', (req, res) => {
  console.log('[Debug] Routes route aangeroepen');
  const routes: any[] = [];
  
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        type: 'direct',
        path: middleware.route.path,
        methods: middleware.route.methods
      });
    } else if (middleware.name === 'router') {
      const baseRoute = middleware.regexp.toString().replace('/^\\', '').replace('\\/?(?=\\/|$)/i', '');
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({
            type: 'router',
            base: baseRoute,
            path: handler.route.path,
            method: handler.route.stack[0].method.toUpperCase(),
            fullPath: `${baseRoute}${handler.route.path}`
          });
        }
      });
    } else {
      routes.push({
        type: 'middleware',
        name: middleware.name
      });
    }
  });
  
  res.json(routes);
});

console.log('[App] Routes registreren...');

// API routes
console.log('[App] Auth routes registreren...');
app.use('/api/auth', authRoutes);

console.log('[App] Time entry routes registreren...');
app.use('/api/time-entries', timeEntryRoutes);

console.log('[App] User routes registreren...');
app.use('/api/users', userRoutes);

// Direct register user management endpoints without router layer
const directUserController = new UserManagementController();

// Super simple mock endpoint that doesn't use the database
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

// Public test endpoint
app.get('/api/user-management-test', (req, res) => {
  console.log('[Public Test] User management test endpoint aangeroepen');
  res.json({ message: 'Public test endpoint works!', timestamp: new Date().toISOString() });
});

// Direct user management endpoints (no authentication for testing)
app.get('/api/user-management-direct/users', (req, res) => {
  console.log('[Direct] Get all users endpoint aangeroepen');
  directUserController.getAllUsers(req, res);
});

app.put('/api/user-management-direct/users/:userId/yearly-target', (req, res) => {
  console.log('[Direct] Update yearly target endpoint aangeroepen');
  directUserController.updateYearlyTarget(req, res);
});

app.get('/api/user-management-direct/users/:userId/yearly-target', (req, res) => {
  console.log('[Direct] Get yearly target endpoint aangeroepen');
  directUserController.getUserYearlyTarget(req, res);
});

// Directe test route voor user management
app.get('/api/user-management/test', (req, res) => {
  console.log('[UserManagement Test] Route aangeroepen');
  res.json({ status: 'ok', message: 'User management test route werkt correct' });
});

console.log('[App] User management routes registreren...');
app.use('/api/user-management', userManagementRoutes);

console.log('[App] Alle routes zijn geregistreerd');

// Debug: Toon alle geregistreerde routes
console.log('[App] Geregistreerde routes:');
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`[App] Route: ${middleware.route.path}`);
    console.log(`[App] Methods:`, middleware.route.methods);
  } else if (middleware.name === 'router') {
    console.log(`[App] Router: ${middleware.regexp}`);
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        console.log(`[App] ${handler.route.stack[0].method.toUpperCase()} ${handler.route.path}`);
        console.log(`[App] Full path: ${middleware.regexp}${handler.route.path}`);
      }
    });
  }
});

// 404 handler
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