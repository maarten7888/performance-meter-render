import express, { Router } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Consultants Route] ${req.method} ${req.path}`);
  console.log('[Consultants Route] Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Test endpoint zonder authenticatie
router.get('/test', (req, res) => {
  console.log('[Consultants Route] Test endpoint hit');
  res.json({ message: 'Test endpoint werkt!' });
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Specifieke routes (met parameters) moeten VOOR algemene routes komen
router.get('/:id', consultantController.getConsultant as express.RequestHandler);

// Algemene routes
router.get('/', consultantController.getConsultants as express.RequestHandler);

export default router; 