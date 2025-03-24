import express from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const consultantController = new ConsultantController();

// Debug middleware
router.use((req, res, next) => {
    console.log(`[Consultants Route] ${req.method} ${req.path}`);
    console.log('[Consultants Route] Full URL:', req.originalUrl);
    console.log('[Consultants Route] Base URL:', req.baseUrl);
    next();
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Consultant routes werken!' });
});

// GET consultant by ID (zonder authenticatie voor testen)
router.get('/:id', consultantController.getConsultantById.bind(consultantController));

// Beschermde routes
router.use(authenticateToken);

// GET alle consultants
router.get('/', consultantController.getAllConsultants.bind(consultantController));

// POST nieuwe consultant
router.post('/', consultantController.createConsultant.bind(consultantController));

// PUT update consultant
router.put('/:id', consultantController.updateConsultant.bind(consultantController));

// DELETE consultant
router.delete('/:id', consultantController.deleteConsultant.bind(consultantController));

export default router; 