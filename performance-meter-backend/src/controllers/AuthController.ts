import { Request, Response } from 'express';
import { pool } from '../config/database';
import jwt from 'jsonwebtoken';
import { User, validatePassword, hashPassword } from '../models/User';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('Debug: Login poging voor:', email);

      // 1. Gebruiker ophalen met alle benodigde velden
      const [users] = await pool.query(
        'SELECT id, email, password, role FROM users WHERE email = ?',
        [email]
      );

      const user = (users as any[])[0];

      if (!user) {
        console.log('Debug: Gebruiker niet gevonden');
        res.status(401).json({ message: 'Ongeldige inloggegevens' });
        return;
      }

      console.log('Debug: Gebruiker gevonden:', {
        id: user.id,
        email: user.email,
        role: user.role
      });

      // 2. Wachtwoord valideren met de helper functie
      const validPassword = await validatePassword(user.password, password);
      if (!validPassword) {
        console.log('Debug: Ongeldig wachtwoord');
        res.status(401).json({ message: 'Ongeldige inloggegevens' });
        return;
      }

      // 3. Response data voorbereiden
      const userData = {
        id: user.id.toString(),
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role
      };

      // 4. JWT token maken
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      // 5. Debug: Verifieer token data
      const decodedToken = jwt.decode(token);
      console.log('Debug: Token payload:', tokenPayload);
      console.log('Debug: Decoded token:', decodedToken);

      // 6. Response versturen
      const response = {
        token,
        user: userData
      };

      console.log('Debug: Sending response:', JSON.stringify(response, null, 2));
      res.json(response);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het inloggen' });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check of email al bestaat
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        res.status(400).json({ message: 'Email is al in gebruik' });
        return;
      }

      // Hash het wachtwoord met de helper functie
      const hashedPassword = await hashPassword(password);

      // Maak nieuwe gebruiker aan
      const [result] = await pool.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, 'user']
      );

      const userId = (result as any).insertId;

      // Haal de nieuwe gebruiker op
      const [users] = await pool.query(
        'SELECT id, email, role FROM users WHERE id = ?',
        [userId]
      );

      const user = (users as any[])[0];

      const userData = {
        id: user.id.toString(),
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role
      };

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: userData
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het registreren' });
    }
  }

  public async setupAdmin(req: Request, res: Response): Promise<void> {
    try {
      console.log('Debug: Starting setupAdmin...');
      
      const [users] = await pool.query(
        'SELECT id, email, role FROM users WHERE email = ?',
        ['maarten.jansen@tothepointcompany.nl']
      );

      const user = (users as any[])[0];

      if (!user) {
        console.log('Debug: User not found');
        res.status(404).json({ message: 'Gebruiker niet gevonden' });
        return;
      }

      await pool.query(
        'UPDATE users SET role = ? WHERE id = ?',
        ['admin', user.id]
      );
      
      const [updatedUsers] = await pool.query(
        'SELECT id, email, role FROM users WHERE id = ?',
        [user.id]
      );
      
      const updatedUser = (updatedUsers as any[])[0];
      console.log('Debug: Updated user:', JSON.stringify(updatedUser, null, 2));

      res.json({ 
        message: 'Admin rol succesvol toegekend',
        user: updatedUser
      });
    } catch (error) {
      console.error('Setup admin error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het toekennen van admin rechten' });
    }
  }
} 