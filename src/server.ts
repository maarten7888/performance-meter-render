import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';
import authRoutes from './routes/auth';
import consultantProfileRoutes from './routes/consultantProfileRoutes';
import { initializeDatabase } from './database/init';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://pm.tothepointcompany.nl', 'http://localhost:3000'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/consultant-profiles', consultantProfileRoutes);

// Debug routes
app.get('/debug/routes', (req, res) => {
    const routes = app._router.stack
        .filter((r: any) => r.route)
        .map((r: any) => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods)
        }));
    res.json(routes);
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Performance Meter API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
}); 