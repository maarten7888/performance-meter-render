import { Request, Response } from 'express';
import { db } from '../database/db';
import { RowDataPacket } from 'mysql2';

interface ConsultantProfileRow extends RowDataPacket {
    email: string;
    full_name: string;
    phone_number: string;
    location: string;
    bio: string;
    skills: string;
    hobbies: string;
    work_experience: string;
    education: string;
    certifications: string;
    languages: string;
    created_at: Date;
    updated_at: Date;
}

export class ConsultantProfileController {
    // Ophalen van een profiel
    async getProfile(req: Request, res: Response) {
        try {
            const email = req.params.email;
            const [profile] = await db.query<ConsultantProfileRow[]>(
                'SELECT * FROM consultant_profiles WHERE email = ?',
                [email]
            );

            if (profile.length === 0) {
                return res.status(404).json({ error: 'Profiel niet gevonden' });
            }

            res.json(profile[0]);
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van het profiel' });
        }
    }

    // Aanmaken van een profiel
    async createProfile(req: Request, res: Response) {
        try {
            const {
                email,
                fullName,
                phoneNumber,
                location,
                bio,
                skills,
                hobbies,
                workExperience,
                education,
                certifications,
                languages
            } = req.body;

            const [result] = await db.query(
                `INSERT INTO consultant_profiles 
                (email, full_name, phone_number, location, bio, skills, hobbies, 
                work_experience, education, certifications, languages) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    email,
                    fullName,
                    phoneNumber,
                    location,
                    bio,
                    JSON.stringify(skills),
                    JSON.stringify(hobbies),
                    JSON.stringify(workExperience),
                    JSON.stringify(education),
                    JSON.stringify(certifications),
                    JSON.stringify(languages)
                ]
            );

            const [newProfile] = await db.query<ConsultantProfileRow[]>(
                'SELECT * FROM consultant_profiles WHERE email = ?',
                [email]
            );

            res.status(201).json(newProfile[0]);
        } catch (error) {
            console.error('Error creating profile:', error);
            res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van het profiel' });
        }
    }

    // Bijwerken van een profiel
    async updateProfile(req: Request, res: Response) {
        try {
            const email = req.params.email;
            const {
                fullName,
                phoneNumber,
                location,
                bio,
                skills,
                hobbies,
                workExperience,
                education,
                certifications,
                languages
            } = req.body;

            await db.query(
                `UPDATE consultant_profiles 
                SET full_name = ?, phone_number = ?, location = ?, bio = ?, 
                skills = ?, hobbies = ?, work_experience = ?, education = ?, 
                certifications = ?, languages = ?
                WHERE email = ?`,
                [
                    fullName,
                    phoneNumber,
                    location,
                    bio,
                    JSON.stringify(skills),
                    JSON.stringify(hobbies),
                    JSON.stringify(workExperience),
                    JSON.stringify(education),
                    JSON.stringify(certifications),
                    JSON.stringify(languages),
                    email
                ]
            );

            const [updatedProfile] = await db.query<ConsultantProfileRow[]>(
                'SELECT * FROM consultant_profiles WHERE email = ?',
                [email]
            );

            if (updatedProfile.length === 0) {
                return res.status(404).json({ error: 'Profiel niet gevonden' });
            }

            res.json(updatedProfile[0]);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van het profiel' });
        }
    }

    // Verwijderen van een profiel
    async deleteProfile(req: Request, res: Response) {
        try {
            const email = req.params.email;
            await db.query('DELETE FROM consultant_profiles WHERE email = ?', [email]);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting profile:', error);
            res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van het profiel' });
        }
    }
} 