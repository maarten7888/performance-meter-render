import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';

// Import routes
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://pm.tothepointcompany.nl',
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
};

// Initialize database connection
const initializeDatabase = async () => {
  try {
    const connection = await createConnection(dbConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);

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