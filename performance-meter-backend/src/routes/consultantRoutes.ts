import express, { RequestHandler } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const consultantController = new ConsultantController();

// Bescherm alle routes met authenticatie
router.use(authenticateToken as RequestHandler);

// Consultant routes
router.get('/', consultantController.getAllConsultants);
router.put('/:id/target', consultantController.updateYearTarget);

export default router; 