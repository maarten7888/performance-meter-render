import express, { Router } from 'express';
import { UserManagementController } from '../controllers/UserManagementController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();
const userManagementController = new UserManagementController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[UserManagement] ${req.method} ${req.path}`);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Routes voor gebruikersbeheer
router.get('/users', userManagementController.getAllUsers as express.RequestHandler);
router.put('/users/:userId/yearly-target', userManagementController.updateYearlyTarget as express.RequestHandler);
router.get('/users/:userId/yearly-target', userManagementController.getUserYearlyTarget as express.RequestHandler);

export default router; 