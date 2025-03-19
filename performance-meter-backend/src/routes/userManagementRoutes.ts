import express from 'express';
import { UserManagementController } from '../controllers/UserManagementController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const userManagementController = new UserManagementController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`UserManagement Route: ${req.method} ${req.path}`);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Routes voor gebruikersbeheer
router.get('/users', userManagementController.getAllUsers);
router.put('/users/:userId/yearly-target', userManagementController.updateYearlyTarget);
router.get('/users/:userId/yearly-target', userManagementController.getUserYearlyTarget);

export default router; 