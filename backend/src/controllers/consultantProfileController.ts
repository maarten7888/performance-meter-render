import { Request, Response } from 'express';
import { ConsultantProfile, ConsultantProfileInput } from '../types/consultantProfile';
import { pool } from '../db/db';

export const getConsultantProfile = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const [rows] = await pool.query(
            'SELECT * FROM consultant_profiles WHERE email = ?',
            [email]
        );
        
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ message: 'Profiel niet gevonden' });
        }

        const profile = rows[0];
        // Convert text fields back to arrays/objects
        profile.skills = profile.skills ? JSON.parse(profile.skills) : [];
        profile.languages = profile.languages ? JSON.parse(profile.languages) : [];
        profile.hobbies = profile.hobbies ? JSON.parse(profile.hobbies) : [];
        profile.work_experience = profile.work_experience ? JSON.parse(profile.work_experience) : [];
        profile.education = profile.education ? JSON.parse(profile.education) : [];
        profile.certifications = profile.certifications ? JSON.parse(profile.certifications) : [];

        res.json(profile);
    } catch (error) {
        console.error('Error fetching consultant profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createConsultantProfile = async (req: Request, res: Response) => {
    try {
        const profile: ConsultantProfileInput = req.body;
        
        // Convert arrays/objects to JSON strings
        const profileData = {
            ...profile,
            skills: JSON.stringify(profile.skills || []),
            languages: JSON.stringify(profile.languages || []),
            hobbies: JSON.stringify(profile.hobbies || []),
            work_experience: JSON.stringify(profile.work_experience || []),
            education: JSON.stringify(profile.education || []),
            certifications: JSON.stringify(profile.certifications || [])
        };

        await pool.query(
            `INSERT INTO consultant_profiles 
            (email, full_name, phone_number, location, bio, 
            skills, languages, hobbies, work_experience, education, certifications)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                profileData.email,
                profileData.full_name,
                profileData.phone_number,
                profileData.location,
                profileData.bio,
                profileData.skills,
                profileData.languages,
                profileData.hobbies,
                profileData.work_experience,
                profileData.education,
                profileData.certifications
            ]
        );

        res.status(201).json({ message: 'Profiel succesvol aangemaakt' });
    } catch (error) {
        console.error('Error creating consultant profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateConsultantProfile = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const profile: ConsultantProfileInput = req.body;

        // Convert arrays/objects to JSON strings
        const profileData = {
            ...profile,
            skills: JSON.stringify(profile.skills || []),
            languages: JSON.stringify(profile.languages || []),
            hobbies: JSON.stringify(profile.hobbies || []),
            work_experience: JSON.stringify(profile.work_experience || []),
            education: JSON.stringify(profile.education || []),
            certifications: JSON.stringify(profile.certifications || [])
        };

        await pool.query(
            `UPDATE consultant_profiles 
            SET full_name = ?, phone_number = ?, location = ?, bio = ?, 
                skills = ?, languages = ?, hobbies = ?, work_experience = ?, 
                education = ?, certifications = ?
            WHERE email = ?`,
            [
                profileData.full_name,
                profileData.phone_number,
                profileData.location,
                profileData.bio,
                profileData.skills,
                profileData.languages,
                profileData.hobbies,
                profileData.work_experience,
                profileData.education,
                profileData.certifications,
                email
            ]
        );

        res.json({ message: 'Profiel succesvol bijgewerkt' });
    } catch (error) {
        console.error('Error updating consultant profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 