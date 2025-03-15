import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

// Debug log voor setup-admin route
router.post('/setup-admin', (req, res, next) => {
  console.log('[DEBUG] Setup-admin route aangeroepen');
  return authController.setupAdmin(req, res);
});

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router; 