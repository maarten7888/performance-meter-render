import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { authenticateToken } from './middleware/auth';
import { AuthRequest } from './types/express';

// Import routes
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/users', userRoutes);

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// 404 handler
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

export default app;