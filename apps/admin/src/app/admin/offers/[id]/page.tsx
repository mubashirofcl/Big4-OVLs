import { offerService } from "@/services/offer.service";
import { OfferForm } from "@/components/offers/OfferForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OfferDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const isNew = id === "new";

    let offer = null;
    if (!isNew) {
        offer = await offerService.getById(id);
        if (!offer) {
            notFound();
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
                <Link
                    href="/admin/offers"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: 14,
                        marginBottom: 16,
                    }}
                >
                    <ArrowLeftIcon size={16} /> Back to Offers
                </Link>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    {isNew ? "Create Offer" : "Edit Offer"}
                </h1>
            </div>

            <OfferForm initialData={offer} />
        </div>
    );
}
