import { Router } from 'express';
import { OfferController } from '../controllers/offer.controller';

const router = Router();

// Public routes
router.get('/', OfferController.getActiveOffers);

export default router;
