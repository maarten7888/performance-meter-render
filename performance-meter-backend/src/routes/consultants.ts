import express, { Router } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`Consultant Route: ${req.method} ${req.path}`);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Specifieke routes (met parameters) moeten VOOR algemene routes komen
router.get('/:id', consultantController.getConsultant as express.RequestHandler);

// Algemene routes
router.get('/', consultantController.getConsultants as express.RequestHandler);

export default router; 