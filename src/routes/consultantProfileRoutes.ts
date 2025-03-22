import express from 'express';
import { ConsultantProfileController } from '../controllers/ConsultantProfileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const consultantProfileController = new ConsultantProfileController();

// Alle routes zijn beschermd met authenticatie
router.use(authenticateToken);

// CRUD routes voor consultant profielen
router.get('/:email', consultantProfileController.getProfile);
router.post('/', consultantProfileController.createProfile);
router.put('/:email', consultantProfileController.updateProfile);
router.delete('/:email', consultantProfileController.deleteProfile);

export default router; 