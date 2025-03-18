import express, { Router, RequestHandler } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware voor consultant routes
router.use((req, res, next) => {
  console.log(`[ConsultantRoutes] ${req.method} ${req.url}`);
  console.log('[ConsultantRoutes] Headers:', req.headers);
  next();
});

// Bescherm alle routes met authenticatie
router.use(authenticateToken as RequestHandler);

// Consultant routes
router.get('/', (req, res) => {
  console.log('[ConsultantRoutes] GET / route aangeroepen');
  return consultantController.getAllConsultants(req, res);
});

router.put('/:id/target', (req, res) => {
  console.log(`[ConsultantRoutes] PUT /${req.params.id}/target route aangeroepen`);
  return consultantController.updateYearTarget(req, res);
});

export default router; 