import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ message: 'Ongeldige inloggegevens' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ message: 'Ongeldige inloggegevens' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het inloggen' });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email is al in gebruik' });
        return;
      }

      const user = await User.create({
        email,
        password,
        role: 'user' // Standaard rol voor nieuwe gebruikers
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het registreren' });
    }
  }

  // Tijdelijke methode om admin rol toe te kennen
  public async setupAdmin(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({
        where: { email: 'maarten.jansen@tothepointcompany.nl' }
      });

      if (!user) {
        res.status(404).json({ message: 'Gebruiker niet gevonden' });
        return;
      }

      await user.update({ role: 'admin' });
      res.json({ message: 'Admin rol succesvol toegekend' });
    } catch (error) {
      console.error('Setup admin error:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het toekennen van admin rechten' });
    }
  }
} 