import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class ConsultantController {
  constructor() {
    // Bind de methoden aan de class instance
    this.getAllConsultants = this.getAllConsultants.bind(this);
    this.updateYearTarget = this.updateYearTarget.bind(this);
    this.test = this.test.bind(this);
  }

  // Test route - voor debugging doeleinden
  public async test(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.json({ message: 'Hello World' });
    } catch (error) {
      console.error('Error in test route:', error);
      res.status(500).json({ message: 'Error in test route' });
    }
  }

  // Haal alle consultants op
  public async getAllConsultants(req: AuthRequest, res: Response): Promise<void> {
    try {
      const [consultants] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users WHERE role = ?',
        ['user']
      );
      res.json(consultants);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      res.status(500).json({ message: 'Error fetching consultants' });
    }
  }

  // Update jaartarget van een consultant
  public async updateYearTarget(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { yearTarget } = req.body;

    try {
      const [consultants] = await pool.query(
        'SELECT id, email, yearlyTarget FROM users WHERE id = ? AND role = ?',
        [id, 'user']
      );

      if (!(consultants as any[]).length) {
        res.status(404).json({ message: 'Consultant not found' });
        return;
      }

      const consultant = (consultants as any[])[0];

      await pool.query(
        'UPDATE users SET yearlyTarget = ? WHERE id = ?',
        [yearTarget, id]
      );
      
      res.json({
        id: consultant.id,
        email: consultant.email,
        yearlyTarget: yearTarget
      });
    } catch (error) {
      console.error('Error updating year target:', error);
      res.status(500).json({ message: 'Error updating year target' });
    }
  }
} 