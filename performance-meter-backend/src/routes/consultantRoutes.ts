import express, { Router } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware
router.use((req, res, next) => {
    console.log(`[Consultants Route] ${req.method} ${req.path}`);
    next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken);

// Specifieke routes (met parameters) moeten VOOR algemene routes komen
router.get('/:id', consultantController.getConsultant as express.RequestHandler);
router.put('/:id', consultantController.updateConsultant as express.RequestHandler);
router.delete('/:id', consultantController.deleteConsultant as express.RequestHandler);

// Algemene routes
router.post('/', consultantController.createConsultant as express.RequestHandler);

export default router; 