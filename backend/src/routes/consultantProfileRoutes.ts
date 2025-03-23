import express from 'express';
import { ConsultantProfileController } from '../controllers/consultantProfileController';

const router = express.Router();
const consultantProfileController = new ConsultantProfileController();

// GET /api/consultant-profiles/:email
router.get('/:email', consultantProfileController.getConsultantProfile.bind(consultantProfileController));

// PUT /api/consultant-profiles/:email
router.put('/:email', consultantProfileController.updateConsultantProfile.bind(consultantProfileController));

export default router; 