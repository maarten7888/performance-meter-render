import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import consultantRoutes from './routes/consultantRoutes';

dotenv.config();

const app = express();

// Debug middleware (voor het loggen van requests)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/consultants', consultantRoutes);

// 404 handler (voor niet-bestaande routes)
app.use((req, res) => {
  console.log(`[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route niet gevonden' });
});

// Error handling middleware (moet na routes komen)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).json({ message: 'Er is een fout opgetreden op de server' });
});

// Database connection
sequelize.sync()
  .then(() => {
    console.log('Database connected and synchronized');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 