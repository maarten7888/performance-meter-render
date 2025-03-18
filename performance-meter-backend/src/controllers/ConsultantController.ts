import { Request, Response } from 'express';
import { User } from '../models/User';

export class ConsultantController {
  // Haal alle consultants op
  public async getAllConsultants(req: Request, res: Response): Promise<void> {
    console.log('[ConsultantController] getAllConsultants aangeroepen');
    console.log('[ConsultantController] Request headers:', req.headers);
    console.log('[ConsultantController] Request user:', (req as any).user);
    
    try {
      console.log('[ConsultantController] Start ophalen consultants');
      const consultants = await User.findAll({
        attributes: ['id', 'email', 'yearlyTarget'],
        where: {
          role: 'user'
        }
      });
      console.log('[ConsultantController] Aantal consultants gevonden:', consultants.length);
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
      const consultant = await User.findOne({
        where: {
          id,
          role: 'user'
        }
      });

      if (!consultant) {
        console.log(`[ConsultantController] Consultant niet gevonden met ID ${id}`);
        res.status(404).json({ message: 'Consultant niet gevonden' });
        return;
      }

      console.log(`[ConsultantController] Consultant gevonden:`, JSON.stringify(consultant.toJSON(), null, 2));
      await consultant.update({ yearlyTarget: yearTarget });
      console.log(`[ConsultantController] Jaartarget succesvol bijgewerkt voor consultant ${id}`);
      
      res.json({
        id: consultant.id,
        email: consultant.email,
        yearlyTarget: consultant.yearlyTarget
      });
    } catch (error) {
      console.error('[ConsultantController] Error updating year target:', error);
      res.status(500).json({ message: 'Er is een fout opgetreden bij het bijwerken van het jaartarget' });
    }
  }
} 