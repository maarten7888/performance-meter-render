import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

// Debug log voor setup-admin route
router.post('/setup-admin', (req, res, next) => {
  console.log('[DEBUG] Setup-admin route aangeroepen');
  return authController.setupAdmin(req, res);
});

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

export default router; 