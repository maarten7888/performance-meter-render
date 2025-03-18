import { Request, Response } from 'express';
import { pool } from '../config/database';

export class ConsultantController {
  constructor() {
    // Bind de methoden aan de class instance
    this.getAllConsultants = this.getAllConsultants.bind(this);
    this.updateYearTarget = this.updateYearTarget.bind(this);
  }

  // Haal alle consultants op
  public async getAllConsultants(req: Request, res: Response): Promise<void> {
    console.log('[ConsultantController] getAllConsultants aangeroepen');
    console.log('[ConsultantController] Request headers:', req.headers);
    console.log('[ConsultantController] Request user:', (req as any).user);
    
    try {
      console.log('[ConsultantController] Start ophalen consultants');
      const [consultants] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users WHERE role = ?',
        ['user']
      );
      console.log('[ConsultantController] Aantal consultants gevonden:', (consultants as any[]).length);
      console.log('[ConsultantController] Consultants:', JSON.stringify(consultants, null, 2));
      res.json(consultants);
    } catch (error) {
      console.error('[ConsultantController] Error fetching consultants:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van consultants' });
    }
  }

  // Update jaartarget van een consultant
  public async updateYearTarget(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { yearTarget } = req.body;

    console.log('[ConsultantController] updateYearTarget aangeroepen');
    console.log('[ConsultantController] ID:', id);
    console.log('[ConsultantController] YearTarget:', yearTarget);
    console.log('[ConsultantController] Request headers:', req.headers);
    console.log('[ConsultantController] Request user:', (req as any).user);

    try {
      console.log(`[ConsultantController] Zoeken naar consultant met ID ${id}`);
      const [consultants] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users WHERE id = ? AND role = ?',
        [id, 'user']
      );

      if (!(consultants as any[]).length) {
        console.log(`[ConsultantController] Consultant niet gevonden met ID ${id}`);
        res.status(404).json({ message: 'Consultant niet gevonden' });
        return;
      }

      const consultant = (consultants as any[])[0];
      console.log(`[ConsultantController] Consultant gevonden:`, JSON.stringify(consultant, null, 2));

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearTarget, id]
      );

      console.log(`[ConsultantController] Jaartarget succesvol bijgewerkt voor consultant ${id}`);
      
      res.json({
        id: consultant.id,
        email: consultant.email,
        yearlyTarget: yearTarget
      });
    } catch (error) {
      console.error('[ConsultantController] Error updating year target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }
} 