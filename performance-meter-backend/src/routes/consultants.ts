import express from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/consultants/:id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const consultantId = req.params.id;
        
        const query = `
            SELECT 
                c.*,
                u.name as user_name,
                u.email as user_email
            FROM consultants c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;

        const [rows] = await pool.query(query, [consultantId]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ message: 'Consultant niet gevonden' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching consultant:', error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van de consultant' });
    }
});

export default router; 