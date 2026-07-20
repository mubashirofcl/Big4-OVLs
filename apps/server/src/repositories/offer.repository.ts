import { prisma } from '../config/prisma';

export class OfferRepository {
  async getActiveOffers() {
    const now = new Date();
    
    return prisma.offer.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { displayOrder: 'asc' },
    });
  }
}
