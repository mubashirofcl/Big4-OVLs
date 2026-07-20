import { OfferRepository } from '../repositories/offer.repository';

export class OfferService {
  private repository = new OfferRepository();

  async getActiveOffers() {
    const offers = await this.repository.getActiveOffers();
    return { data: offers };
  }
}
