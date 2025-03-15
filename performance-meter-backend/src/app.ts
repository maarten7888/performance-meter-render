import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/authRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import consultantRoutes from './routes/consultantRoutes';

dotenv.config();

const app = express();

// CORS configuratie
const corsOptions = {
  origin: ['https://pm.tothepointcompany.nl', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/consultants', consultantRoutes);

// 404 handler
app.use((req, res) => {
  const message = `Route niet gevonden: ${req.method} ${req.url}`;
  console.log(`[${new Date().toISOString()}] 404 Not Found:`, message);
  res.status(404).json({ message });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.url,
    method: req.method
  });
  res.status(500).json({ message: 'Er is een fout opgetreden op de server' });
});

// Database connection
sequelize.sync()
  .then(() => {
    console.log('[Database] Connected and synchronized');
  })
  .catch((error: Error) => {
    console.error('[Database] Connection error:', error);
  });

export default app; 