import express, { Router, RequestHandler } from 'express';
import { ConsultantController } from '../controllers/ConsultantController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const consultantController = new ConsultantController();

console.log('[ConsultantRoutes] Router aangemaakt');

// Debug middleware voor consultant routes
router.use((req, res, next) => {
  console.log(`[ConsultantRoutes] ${req.method} ${req.url}`);
  console.log('[ConsultantRoutes] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[ConsultantRoutes] Body:', req.body);
  console.log('[ConsultantRoutes] Query:', req.query);
  console.log('[ConsultantRoutes] Params:', req.params);
  next();
});

console.log('[ConsultantRoutes] Debug middleware geregistreerd');

// Bescherm alle routes met authenticatie
router.use(authenticateToken as RequestHandler);

console.log('[ConsultantRoutes] Auth middleware geregistreerd');

// Consultant routes
router.get('/test', (req, res) => {
  console.log('[ConsultantRoutes] GET /test route aangeroepen');
  return consultantController.test(req, res);
});

console.log('[ConsultantRoutes] GET /test route geregistreerd');

router.get('/', (req, res) => {
  console.log('[ConsultantRoutes] GET / route aangeroepen');
  console.log('[ConsultantRoutes] Request user:', req.user);
  return consultantController.getAllConsultants(req, res);
});

console.log('[ConsultantRoutes] GET / route geregistreerd');

router.put('/:id/target', (req, res) => {
  console.log(`[ConsultantRoutes] PUT /${req.params.id}/target route aangeroepen`);
  console.log('[ConsultantRoutes] Request user:', req.user);
  return consultantController.updateYearTarget(req, res);
});

console.log('[ConsultantRoutes] PUT /:id/target route geregistreerd');

export default router; 