import { Response } from 'express';
import { pool } from '../config/database';
import { Consultant, ConsultantInput } from '../types/consultant';
import { AuthRequest } from '../types/express';

export class ConsultantController {
    async getConsultant(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const [consultants] = await pool.query<Consultant[]>(
                'SELECT * FROM consultants WHERE id = ?',
                [id]
            );

            if (!consultants.length) {
                return res.status(404).json({ message: 'Consultant niet gevonden' });
            }

            res.json(consultants[0]);
        } catch (error) {
            console.error('Error fetching consultant:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de consultant' });
        }
    }

    async createConsultant(req: AuthRequest, res: Response) {
        try {
            const consultantData: ConsultantInput = req.body;

            const [result] = await pool.query(
                `INSERT INTO consultants (
                    user_id, profile_image, role, start_date, bio,
                    skill_moves, weak_foot, stat_punctuality, stat_teamwork,
                    stat_focus, stat_skills, stat_hours, stat_communication
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    consultantData.user_id,
                    consultantData.profile_image,
                    consultantData.role,
                    consultantData.start_date,
                    consultantData.bio,
                    consultantData.skill_moves,
                    consultantData.weak_foot,
                    consultantData.stat_punctuality,
                    consultantData.stat_teamwork,
                    consultantData.stat_focus,
                    consultantData.stat_skills,
                    consultantData.stat_hours,
                    consultantData.stat_communication
                ]
            );

            const [newConsultant] = await pool.query<Consultant[]>(
                'SELECT * FROM consultants WHERE id = ?',
                [(result as any).insertId]
            );

            res.status(201).json(newConsultant[0]);
        } catch (error) {
            console.error('Error creating consultant:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het aanmaken van de consultant' });
        }
    }

    async updateConsultant(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const consultantData: ConsultantInput = req.body;

            const [result] = await pool.query(
                `UPDATE consultants SET 
                    profile_image = ?,
                    role = ?,
                    start_date = ?,
                    bio = ?,
                    skill_moves = ?,
                    weak_foot = ?,
                    stat_punctuality = ?,
                    stat_teamwork = ?,
                    stat_focus = ?,
                    stat_skills = ?,
                    stat_hours = ?,
                    stat_communication = ?
                WHERE id = ?`,
                [
                    consultantData.profile_image,
                    consultantData.role,
                    consultantData.start_date,
                    consultantData.bio,
                    consultantData.skill_moves,
                    consultantData.weak_foot,
                    consultantData.stat_punctuality,
                    consultantData.stat_teamwork,
                    consultantData.stat_focus,
                    consultantData.stat_skills,
                    consultantData.stat_hours,
                    consultantData.stat_communication,
                    id
                ]
            );

            if ((result as any).affectedRows === 0) {
                return res.status(404).json({ message: 'Consultant niet gevonden' });
            }

            const [updatedConsultant] = await pool.query<Consultant[]>(
                'SELECT * FROM consultants WHERE id = ?',
                [id]
            );

            res.json(updatedConsultant[0]);
        } catch (error) {
            console.error('Error updating consultant:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van de consultant' });
        }
    }

    async deleteConsultant(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const [result] = await pool.query(
                'DELETE FROM consultants WHERE id = ?',
                [id]
            );

            if ((result as any).affectedRows === 0) {
                return res.status(404).json({ message: 'Consultant niet gevonden' });
            }

            res.json({ message: 'Consultant succesvol verwijderd' });
        } catch (error) {
            console.error('Error deleting consultant:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het verwijderen van de consultant' });
        }
    }
} 