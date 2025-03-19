import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { UserManagementController } from '../controllers/UserManagementController';

const router = express.Router();
const userManagementController = new UserManagementController();

// Alle routes zijn beschermd met authenticateToken
router.use(authenticateToken);

// Routes voor gebruikersbeheer
router.get('/users', userManagementController.getAllUsers);
router.put('/users/:userId/yearly-target', userManagementController.updateYearlyTarget);
router.get('/users/:userId/yearly-target', userManagementController.getUserYearlyTarget);

export default router; 