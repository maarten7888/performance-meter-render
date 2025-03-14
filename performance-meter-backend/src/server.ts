import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './config/database';
import timeEntryRoutes from './routes/timeEntryRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/time-entries', timeEntryRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Er is een fout opgetreden op de server' });
});

// Database connection and server start
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Server draait op poort ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer(); 