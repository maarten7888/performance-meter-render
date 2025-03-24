import express, { Router } from 'express';
import { ConsultantController } from '../controllers/consultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware
router.use((req, res, next) => {
    console.log(`[Consultants Route] ${req.method} ${req.path}`);
    console.log('[Consultants Route] Full URL:', req.originalUrl);
    console.log('[Consultants Route] Base URL:', req.baseUrl);
    next();
});

// Test endpoint zonder authenticatie
router.get('/test', (req, res) => {
    console.log('[Consultants Route] Test endpoint hit');
    res.json({ message: 'Consultants test endpoint werkt!' });
});

// Root endpoint zonder authenticatie
router.get('/', (req, res) => {
    console.log('[Consultants Route] Root endpoint hit');
    res.json({ message: 'Consultants root endpoint werkt!' });
});

// Alle routes hieronder vereisen authenticatie
router.use(authenticateToken);

router.get('/:id', consultantController.getConsultantById);
router.put('/:id', consultantController.updateConsultant);
router.delete('/:id', consultantController.deleteConsultant);
router.post('/', consultantController.createConsultant);

export default router; 