"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Offer } from "@prisma/client";
import { deleteOfferAction, reorderOffersAction } from "@/actions/offer.actions";
import { useToast } from "@/components/ui/ToastProvider";
import { ArrowUp, ArrowDown } from "lucide-react";

export function OfferListClient({ initialOffers }: { initialOffers: Offer[] }) {
    const [offers, setOffers] = useState(initialOffers);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    // Sync from server if updated elsewhere (e.g. after revalidatePath)
    useEffect(() => {
        setOffers(initialOffers);
    }, [initialOffers]);

    const handleDelete = async (offer: Offer) => {
        if (!confirm(`Are you sure you want to delete "${offer.title}"?`)) return;

        const res = await deleteOfferAction(offer.id);
        if (res.success) {
            toast(res.message, "success");
            setOffers(offers.filter(o => o.id !== offer.id));
        } else {
            toast(res.message, "error");
        }
    };

    const moveOffer = async (index: number, direction: -1 | 1) => {
        if (isPending) return;
        if (index + direction < 0 || index + direction >= offers.length) return;

        setIsPending(true);

        const newOffers = [...offers];
        const temp = newOffers[index];
        newOffers[index] = newOffers[index + direction];
        newOffers[index + direction] = temp;
        
        // Update displayOrders
        newOffers.forEach((o, i) => { o.displayOrder = i; });
        setOffers(newOffers);

        const updates = newOffers.map((o) => ({ id: o.id, displayOrder: o.displayOrder }));
        const res = await reorderOffersAction(updates);
        setIsPending(false);
        if (!res.success) {
            toast("Failed to save new order", "error");
            // Revert state on failure
            setOffers(offers);
        }
    };

    if (offers.length === 0) {
        return (
            <div className="saas-card" style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>No offers found</div>
                <div style={{ marginTop: 4, color: "var(--text-secondary)", fontSize: 14 }}>Add your first offer banner for the home page.</div>
            </div>
        );
    }

    return (
        <div className="saas-card saas-table-container" style={{ padding: 0, overflow: "hidden" }}>
            <div className="hide-on-mobile" style={{ overflowX: "auto" }}>
                <table className="saas-table">
                    <thead>
                        <tr>
                            <th style={{ width: 80, textAlign: "center" }}>Order</th>
                            <th>Banner</th>
                            <th>Title & Links</th>
                            <th style={{ textAlign: "center" }}>Status</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer, index) => (
                            <tr key={offer.id}>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                        <button 
                                            disabled={index === 0 || isPending} 
                                            onClick={() => moveOffer(index, -1)}
                                            style={{ background: "none", border: "none", cursor: (index === 0 || isPending) ? "default" : "pointer", opacity: (index === 0 || isPending) ? 0.3 : 1 }}
                                        ><ArrowUp size={16} /></button>
                                        <button 
                                            disabled={index === offers.length - 1 || isPending} 
                                            onClick={() => moveOffer(index, 1)}
                                            style={{ background: "none", border: "none", cursor: (index === offers.length - 1 || isPending) ? "default" : "pointer", opacity: (index === offers.length - 1 || isPending) ? 0.3 : 1 }}
                                        ><ArrowDown size={16} /></button>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ width: 150, height: 50, borderRadius: "var(--radius-sm)", background: "var(--skeleton-base)", overflow: "hidden" }}>
                                        <img src={offer.bannerImage} alt={offer.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{offer.title}</div>
                                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                        {offer.linkType !== "NONE" ? `Link: ${offer.linkType}` : "No Link"}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                        <span className={`badge ${offer.isActive ? "badge-active" : "badge-archived"}`}>
                                            {offer.isActive ? "Active" : "Inactive"}
                                        </span>
                                        {!offer.bannerImageMobile && (
                                            <span style={{ fontSize: 10, background: "var(--danger-soft)", color: "var(--danger)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                                                No Mobile Crop
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <Link href={`/admin/offers/${offer.id}`} style={{ padding: "6px 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-default)", background: "var(--bg-card)", color: "var(--text-primary)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Edit</Link>
                                        <button onClick={() => handleDelete(offer)} style={{ padding: "6px 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--danger-soft)", background: "var(--danger-soft)", color: "var(--danger)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="mobile-only">
                {offers.map((offer, index) => (
                    <div
                        key={offer.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                            padding: 16,
                            borderTop: index > 0 ? "1px solid var(--border-default)" : "none",
                            background: "var(--bg-card)",
                        }}
                    >
                        {/* Banner Image */}
                        <div
                            style={{
                                width: "100%",
                                aspectRatio: "3 / 1",
                                borderRadius: "var(--radius-md)",
                                background: "var(--skeleton-base)",
                                overflow: "hidden",
                                border: "1px solid var(--border-default)",
                            }}
                        >
                            <img
                                src={offer.bannerImage}
                                alt={offer.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>

                        {/* Title, Badges & Reorder Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 15 }}>
                                    {offer.title}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                                    {offer.linkType !== "NONE" ? `Link: ${offer.linkType}` : "No Link"}
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                                    <span className={`badge ${offer.isActive ? "badge-active" : "badge-archived"}`}>
                                        {offer.isActive ? "Active" : "Inactive"}
                                    </span>
                                    {!offer.bannerImageMobile && (
                                        <span style={{ fontSize: 10, background: "var(--danger-soft)", color: "var(--danger)", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                                            No Mobile Crop
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Reorder Controls */}
                            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg-canvas)", padding: "4px 8px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-default)" }}>
                                <button
                                    disabled={index === 0 || isPending}
                                    onClick={() => moveOffer(index, -1)}
                                    aria-label="Move Up"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: index === 0 || isPending ? "default" : "pointer",
                                        opacity: index === 0 || isPending ? 0.3 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 4,
                                    }}
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", padding: "0 2px" }}>
                                    {index + 1}
                                </span>
                                <button
                                    disabled={index === offers.length - 1 || isPending}
                                    onClick={() => moveOffer(index, 1)}
                                    aria-label="Move Down"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: index === offers.length - 1 || isPending ? "default" : "pointer",
                                        opacity: index === offers.length - 1 || isPending ? 0.3 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 4,
                                    }}
                                >
                                    <ArrowDown size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                            <Link
                                href={`/admin/offers/${offer.id}`}
                                prefetch={true}
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "9px 16px",
                                    borderRadius: "var(--radius-pill)",
                                    border: "1px solid var(--border-default)",
                                    background: "var(--bg-canvas)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    color: "var(--text-primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(offer)}
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "9px 16px",
                                    borderRadius: "var(--radius-pill)",
                                    border: "1px solid var(--danger-soft)",
                                    color: "var(--danger)",
                                    background: "var(--danger-soft)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
