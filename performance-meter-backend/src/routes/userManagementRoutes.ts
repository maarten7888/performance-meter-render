import express, { Router } from 'express';
import { UserManagementController } from '../controllers/UserManagementController';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
const userManagementController = new UserManagementController();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[UserManagement] ${req.method} ${req.path}`);
  console.log('[UserManagement] Full path:', req.originalUrl);
  next();
});

// Alle routes vereisen authenticatie
router.use(authenticateToken as express.RequestHandler);

// Routes voor gebruikersbeheer
// GET /api/user-management/users
router.get('/users', userManagementController.getAllUsers as (req: AuthRequest, res: express.Response) => Promise<void>);

// PUT /api/user-management/users/:userId/yearly-target
router.put('/users/:userId/yearly-target', userManagementController.updateYearlyTarget as (req: AuthRequest, res: express.Response) => Promise<void>);

// GET /api/user-management/users/:userId/yearly-target
router.get('/users/:userId/yearly-target', userManagementController.getUserYearlyTarget as (req: AuthRequest, res: express.Response) => Promise<void>);

export default router; 