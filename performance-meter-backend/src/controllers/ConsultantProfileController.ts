import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types/express';

export class ConsultantProfileController {
  async getConsultantProfile(req: AuthRequest, res: Response) {
    try {
      const { email } = req.params;

      // Haal het profiel op
      const [profiles] = await pool.query(
        `SELECT cp.*, u.email 
         FROM consultant_profiles cp 
         JOIN users u ON cp.userId = u.id 
         WHERE u.email = ?`,
        [email]
      );

      const profile = (profiles as any[])[0];

      if (!profile) {
        return res.status(404).json({ message: 'Profiel niet gevonden' });
      }

      // Parse JSON velden
      const formattedProfile = {
        ...profile,
        skills: JSON.parse(profile.skills || '[]'),
        languages: JSON.parse(profile.languages || '[]'),
        workExperience: JSON.parse(profile.workExperience || '[]'),
        education: JSON.parse(profile.education || '[]')
      };

      res.json(formattedProfile);
    } catch (error) {
      console.error('Error fetching consultant profile:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van het profiel' });
    }
  }

  async createConsultantProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { firstName, lastName, email, phoneNumber, skills, languages, workExperience, education } = req.body;

      // Controleer of er al een profiel bestaat voor deze gebruiker
      const [existingProfiles] = await pool.query(
        'SELECT id FROM consultant_profiles WHERE userId = ?',
        [userId]
      );

      if ((existingProfiles as any[]).length > 0) {
        return res.status(400).json({ message: 'Er bestaat al een profiel voor deze gebruiker' });
      }

      const now = new Date();
      const [result] = await pool.query(
        `INSERT INTO consultant_profiles 
         (userId, firstName, lastName, email, phoneNumber, skills, languages, workExperience, education, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          JSON.stringify(skills || []),
          JSON.stringify(languages || []),
          JSON.stringify(workExperience || []),
          JSON.stringify(education || []),
          now,
          now
        ]
      );

      const profileId = (result as any).insertId;

      // Haal het nieuwe profiel op
      const [profiles] = await pool.query(
        `SELECT cp.*, u.email 
         FROM consultant_profiles cp 
         JOIN users u ON cp.userId = u.id 
         WHERE cp.id = ?`,
        [profileId]
      );

      const profile = (profiles as any[])[0];

      // Parse JSON velden
      const formattedProfile = {
        ...profile,
        skills: JSON.parse(profile.skills || '[]'),
        languages: JSON.parse(profile.languages || '[]'),
        workExperience: JSON.parse(profile.workExperience || '[]'),
        education: JSON.parse(profile.education || '[]')
      };

      res.status(201).json(formattedProfile);
    } catch (error) {
      console.error('Error creating consultant profile:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het aanmaken van het profiel' });
    }
  }

  async updateConsultantProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { email } = req.params;
      const { firstName, lastName, phoneNumber, skills, languages, workExperience, education } = req.body;

      // Controleer of het profiel bestaat en van de juiste gebruiker is
      const [profiles] = await pool.query(
        `SELECT cp.id 
         FROM consultant_profiles cp 
         JOIN users u ON cp.userId = u.id 
         WHERE u.email = ? AND cp.userId = ?`,
        [email, userId]
      );

      if ((profiles as any[]).length === 0) {
        return res.status(404).json({ message: 'Profiel niet gevonden' });
      }

      const now = new Date();
      await pool.query(
        `UPDATE consultant_profiles 
         SET firstName = ?, 
             lastName = ?, 
             phoneNumber = ?, 
             skills = ?,
             languages = ?,
             workExperience = ?,
             education = ?,
             updatedAt = ?
         WHERE id = ?`,
        [
          firstName,
          lastName,
          phoneNumber,
          JSON.stringify(skills || []),
          JSON.stringify(languages || []),
          JSON.stringify(workExperience || []),
          JSON.stringify(education || []),
          now,
          (profiles as any[])[0].id
        ]
      );

      // Haal het bijgewerkte profiel op
      const [updatedProfiles] = await pool.query(
        `SELECT cp.*, u.email 
         FROM consultant_profiles cp 
         JOIN users u ON cp.userId = u.id 
         WHERE cp.id = ?`,
        [(profiles as any[])[0].id]
      );

      const profile = (updatedProfiles as any[])[0];

      // Parse JSON velden
      const formattedProfile = {
        ...profile,
        skills: JSON.parse(profile.skills || '[]'),
        languages: JSON.parse(profile.languages || '[]'),
        workExperience: JSON.parse(profile.workExperience || '[]'),
        education: JSON.parse(profile.education || '[]')
      };

      res.json(formattedProfile);
    } catch (error) {
      console.error('Error updating consultant profile:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het profiel' });
    }
  }

  async deleteConsultantProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Niet geautoriseerd' });
      }

      const { email } = req.params;

      // Controleer of het profiel bestaat en van de juiste gebruiker is
      const [profiles] = await pool.query(
        `SELECT cp.id 
         FROM consultant_profiles cp 
         JOIN users u ON cp.userId = u.id 
         WHERE u.email = ? AND cp.userId = ?`,
        [email, userId]
      );

      if ((profiles as any[]).length === 0) {
        return res.status(404).json({ message: 'Profiel niet gevonden' });
      }

      await pool.query(
        'DELETE FROM consultant_profiles WHERE id = ?',
        [(profiles as any[])[0].id]
      );

      res.json({ message: 'Profiel succesvol verwijderd' });
    } catch (error) {
      console.error('Error deleting consultant profile:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het verwijderen van het profiel' });
    }
  }
} 