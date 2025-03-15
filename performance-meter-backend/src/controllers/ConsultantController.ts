import { Request, Response } from 'express';
import { User } from '../models/User';

export class ConsultantController {
  // Haal alle consultants op
  public async getAllConsultants(req: Request, res: Response): Promise<void> {
    try {
      const consultants = await User.findAll({
        attributes: ['id', 'email', 'yearlyTarget'],
        where: {
          role: 'user'
        }
      });

      res.json(consultants);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van consultants' });
    }
  }

  // Update jaartarget van een consultant
  public async updateYearTarget(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { yearTarget } = req.body;

    try {
      const consultant = await User.findOne({
        where: {
          id,
          role: 'user'
        }
      });

      if (!consultant) {
        res.status(404).json({ message: 'Consultant niet gevonden' });
        return;
      }

      await consultant.update({ yearlyTarget: yearTarget });
      
      res.json({
        id: consultant.id,
        email: consultant.email,
        yearlyTarget: consultant.yearlyTarget
      });
    } catch (error) {
      console.error('Error updating year target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }
} 