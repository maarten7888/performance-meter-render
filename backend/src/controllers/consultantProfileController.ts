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
        // Convert string arrays back to arrays
        profile.strengths = profile.strengths ? JSON.parse(profile.strengths) : [];
        profile.hobbies = profile.hobbies ? JSON.parse(profile.hobbies) : [];
        profile.experience = profile.experience ? JSON.parse(profile.experience) : [];
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
        
        // Convert arrays to JSON strings
        const profileData = {
            ...profile,
            strengths: JSON.stringify(profile.strengths || []),
            hobbies: JSON.stringify(profile.hobbies || []),
            experience: JSON.stringify(profile.experience || []),
            education: JSON.stringify(profile.education || []),
            certifications: JSON.stringify(profile.certifications || [])
        };

        await pool.query(
            `INSERT INTO consultant_profiles 
            (email, full_name, title, bio, strengths, hobbies, experience, education, certifications, profile_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                profileData.email,
                profileData.fullName,
                profileData.title,
                profileData.bio,
                profileData.strengths,
                profileData.hobbies,
                profileData.experience,
                profileData.education,
                profileData.certifications,
                profileData.profileImage
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

        // Convert arrays to JSON strings
        const profileData = {
            ...profile,
            strengths: JSON.stringify(profile.strengths || []),
            hobbies: JSON.stringify(profile.hobbies || []),
            experience: JSON.stringify(profile.experience || []),
            education: JSON.stringify(profile.education || []),
            certifications: JSON.stringify(profile.certifications || [])
        };

        await pool.query(
            `UPDATE consultant_profiles 
            SET full_name = ?, title = ?, bio = ?, strengths = ?, 
                hobbies = ?, experience = ?, education = ?, 
                certifications = ?, profile_image = ?
            WHERE email = ?`,
            [
                profileData.fullName,
                profileData.title,
                profileData.bio,
                profileData.strengths,
                profileData.hobbies,
                profileData.experience,
                profileData.education,
                profileData.certifications,
                profileData.profileImage,
                email
            ]
        );

        res.json({ message: 'Profiel succesvol bijgewerkt' });
    } catch (error) {
        console.error('Error updating consultant profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 