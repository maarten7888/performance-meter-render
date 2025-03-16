import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('Debug: Login poging voor:', email);

      // 1. Gebruiker ophalen met alle benodigde velden
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'email', 'password', 'role']
      });

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

      // 2. Wachtwoord valideren
      const validPassword = await bcrypt.compare(password, user.password);
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
        role: user.role // Expliciet role toevoegen
      };

      // 4. JWT token maken
      const tokenPayload = {
        id: user.id, // Gebruik 'id' in plaats van 'userId'
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

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email is al in gebruik' });
        return;
      }

      const user = await User.create({
        email,
        password,
        role: 'user'
      });

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
      
      const user = await User.findOne({
        where: { email: 'maarten.jansen@tothepointcompany.nl' },
        attributes: ['id', 'email', 'role']
      });

      if (!user) {
        console.log('Debug: User not found');
        res.status(404).json({ message: 'Gebruiker niet gevonden' });
        return;
      }

      await user.update({ role: 'admin' });
      
      const updatedUser = await User.findOne({
        where: { email: 'maarten.jansen@tothepointcompany.nl' },
        attributes: ['id', 'email', 'role']
      });
      
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