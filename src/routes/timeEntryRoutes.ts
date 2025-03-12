import express from 'express';
import { TimeEntryController } from '../controllers/TimeEntryController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const timeEntryController = new TimeEntryController();

// Time entry routes (all protected)
router.use(authenticateToken);

router.get('/', timeEntryController.getAll);
router.post('/', timeEntryController.create);
router.get('/monthly-report', timeEntryController.getMonthlyReport);
router.get('/yearly-target', timeEntryController.getYearlyTarget);
router.put('/:id', timeEntryController.update);
router.delete('/:id', timeEntryController.delete);

export default router; 