import express, { RequestHandler } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware voor consultant routes
router.use((req, res, next) => {
  console.log(`[ConsultantRoutes] ${req.method} ${req.url}`);
  next();
});

// Bescherm alle routes met authenticatie
router.use(authenticateToken as RequestHandler);

// Consultant routes
router.get('/', consultantController.getAllConsultants as RequestHandler);
router.put('/:id/target', consultantController.updateYearTarget as RequestHandler);

export default router; 