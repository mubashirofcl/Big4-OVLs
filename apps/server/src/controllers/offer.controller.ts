import { Request, Response } from 'express';
import { OfferService } from '../services/offer.service';

const offerService = new OfferService();

export class OfferController {
  static async getActiveOffers(req: Request, res: Response) {
    try {
      const result = await offerService.getActiveOffers();
      res.json(result);
    } catch (error) {
      console.error('Error fetching active offers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
