import express from 'express';
import { getConsultantProfile, createConsultantProfile, updateConsultantProfile } from '../controllers/consultantProfileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Alle routes zijn beschermd met authenticatie
router.use(authenticateToken);

// GET /api/consultant-profile/:email
router.get('/:email', getConsultantProfile);

// POST /api/consultant-profile
router.post('/', createConsultantProfile);

// PUT /api/consultant-profile/:email
router.put('/:email', updateConsultantProfile);

export default router; 