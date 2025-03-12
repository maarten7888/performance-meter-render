import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../lib/db';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../types/auth';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Valideer input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    // Check of email al bestaat
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email is al in gebruik' });
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Voeg gebruiker toe
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, name]
    );

    // Haal de nieuwe gebruiker op
    const [newUser] = await pool.query(
      'SELECT id, email, name, createdAt FROM users WHERE id = ?',
      [(result as any).insertId]
    );

    const user = (Array.isArray(newUser) ? newUser[0] : null) as any;

    const response: RegisterResponse = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Registratie error details:', {
      error,
      message: error?.message || 'Onbekende fout',
      stack: error?.stack,
      sqlMessage: error?.sqlMessage
    });
    res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het registreren', 
      details: error?.message || 'Onbekende fout' 
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Valideer input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
    }

    // Zoek gebruiker
    const [users] = await pool.query(
      'SELECT id, email, password, name FROM users WHERE email = ?',
      [email]
    );

    const user = Array.isArray(users) && users.length > 0 ? users[0] as any : null;

    if (!user) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Verifieer wachtwoord
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Genereer JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    const response: LoginResponse = {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het inloggen' });
  }
});

export default router; 