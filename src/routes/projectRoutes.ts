import express from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const projectController = new ProjectController();

// Project routes (all protected)
router.use(authenticateToken);

router.post('/', projectController.create);
router.get('/', projectController.getAll);
router.get('/active', projectController.getActive);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router; 