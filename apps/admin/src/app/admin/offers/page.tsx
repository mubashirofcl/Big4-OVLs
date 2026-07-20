import type { Metadata } from "next";
import { offerService } from "@/services/offer.service";
import { OfferListClient } from "@/components/offers/OfferListClient";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Offers — Big4 Admin",
    description: "Manage storefront offers and banners",
};

export default async function OffersPage() {
    const offers = await offerService.list();

    return (
        <div>
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        Offers
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                        Manage promotional banners displayed on the home page carousel.
                    </p>
                </div>
                <Link
                    href="/admin/offers/new"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 20px",
                        background: "var(--hero-bg)",
                        color: "var(--hero-text)",
                        borderRadius: "var(--radius-pill)",
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "background 150ms ease",
                    }}
                >
                    + Add Offer
                </Link>
            </div>

            <OfferListClient initialOffers={offers} />
        </div>
    );
}
