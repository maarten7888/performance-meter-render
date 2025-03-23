import express, { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const projectController = new ProjectController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`Project Route: ${req.method} ${req.path}`);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Specifieke routes (met parameters) moeten VOOR algemene routes komen
router.get('/:id', projectController.getProject as express.RequestHandler);
router.put('/:id', projectController.updateProject as express.RequestHandler);
router.delete('/:id', projectController.deleteProject as express.RequestHandler);

// Algemene routes
router.get('/', projectController.getProjects as express.RequestHandler);
router.post('/', projectController.createProject as express.RequestHandler);

export default router; 