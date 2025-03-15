import express from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();
const consultantController = new ConsultantController();

// Bescherm alle routes met authenticatie en admin rechten
router.use(authenticateToken);
router.use(requireAdmin);

// Consultant routes
router.get('/', consultantController.getAllConsultants);
router.put('/:id/target', consultantController.updateYearTarget);

export default router; 