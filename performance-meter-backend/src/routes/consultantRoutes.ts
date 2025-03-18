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
router.get('/', (req, res, next) => {
  console.log('[ConsultantRoutes] GET / - Fetching all consultants');
  consultantController.getAllConsultants(req, res).catch(next);
});

router.put('/:id/target', (req, res, next) => {
  console.log(`[ConsultantRoutes] PUT /${req.params.id}/target - Updating year target`);
  consultantController.updateYearTarget(req, res).catch(next);
});

export default router; 