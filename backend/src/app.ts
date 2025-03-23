import express from 'express';
import cors from 'cors';
import { consultantProfileRoutes } from './routes/consultantProfileRoutes';
import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/consultant-profile', consultantProfileRoutes);
app.use('/api/users', userRoutes);

// ... existing code ... 