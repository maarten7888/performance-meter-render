import { Request, Response } from 'express';
import { pool } from '../config/database';

export class ConsultantController {
    async getConsultants(req: Request, res: Response) {
        try {
            console.log('[Consultants] Fetching all consultants');
            
            const query = `
                SELECT 
                    c.*,
                    u.name as user_name,
                    u.email as user_email
                FROM consultants c
                JOIN users u ON c.user_id = u.id
            `;

            console.log('[Consultants] Executing query:', query);

            const [rows] = await pool.query(query);
            console.log('[Consultants] Query result:', rows);

            res.json(rows);
        } catch (error) {
            console.error('[Consultants] Error fetching consultants:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de consultants' });
        }
    }

    async getConsultant(req: Request, res: Response) {
        try {
            const consultantId = req.params.id;
            console.log('[Consultants] Fetching consultant with ID:', consultantId);
            
            const query = `
                SELECT 
                    c.*,
                    u.name as user_name,
                    u.email as user_email
                FROM consultants c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = ?
            `;

            console.log('[Consultants] Executing query:', query);
            console.log('[Consultants] With parameters:', [consultantId]);

            const [rows] = await pool.query(query, [consultantId]);
            console.log('[Consultants] Query result:', rows);

            if (!Array.isArray(rows) || rows.length === 0) {
                console.log('[Consultants] No consultant found');
                return res.status(404).json({ message: 'Consultant niet gevonden' });
            }

            console.log('[Consultants] Found consultant:', rows[0]);
            res.json(rows[0]);
        } catch (error) {
            console.error('[Consultants] Error fetching consultant:', error);
            res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de consultant' });
        }
    }
} 