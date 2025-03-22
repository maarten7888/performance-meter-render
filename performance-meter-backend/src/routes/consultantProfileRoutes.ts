import express from 'express';
import { ConsultantProfileController } from '../controllers/ConsultantProfileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const consultantProfileController = new ConsultantProfileController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`ConsultantProfile Route: ${req.method} ${req.path}`);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken);

// Basis routes
router.get('/:email', consultantProfileController.getConsultantProfile);
router.post('/', consultantProfileController.createConsultantProfile);
router.put('/:email', consultantProfileController.updateConsultantProfile);
router.delete('/:email', consultantProfileController.deleteConsultantProfile);

export default router; 