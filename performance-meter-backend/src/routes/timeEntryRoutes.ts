import express, { Router } from 'express';
import { TimeEntryController } from '../controllers/TimeEntryController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const timeEntryController = new TimeEntryController();

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

router.get('/', timeEntryController.getTimeEntries as express.RequestHandler);
router.get('/monthly-report', timeEntryController.getMonthlyReport as express.RequestHandler);
router.get('/yearly-target', timeEntryController.getYearlyTarget as express.RequestHandler);
router.get('/total-hours', timeEntryController.getTotalHours as express.RequestHandler);
router.post('/', timeEntryController.createTimeEntry as express.RequestHandler);
router.put('/:id', timeEntryController.updateTimeEntry as express.RequestHandler);
router.delete('/:id', timeEntryController.deleteTimeEntry as express.RequestHandler);

export default router; 