"use client";

import { useState, useRef, useEffect } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/ToastProvider";
import { updateStockAction } from "@/actions/stock.actions";
import { updateStockSchema } from "@/validations/stock.validation";
import type { ProductListItem } from "@/types/admin.types";

interface StockModalProps {
    product: ProductListItem | null;
    onClose: () => void;
}

/**
 * Quick stock update modal — opens when clicking stock cell in product table.
 * Designed for speed: numeric input, auto-focused, Enter to submit.
 */
export function StockModal({ product, onClose }: StockModalProps) {
    const { toast } = useToast();
    const [stock, setStock] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Set initial value and focus when product changes
    useEffect(() => {
        if (product) {
            setStock(String(product.stock));
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [product]);

    if (!product) return null;

    const handleSubmit = async () => {
        setErrors({});
        
        const newStock = stock === "" ? -1 : parseInt(stock, 10);
        
        const parsed = updateStockSchema.safeParse({ productId: product.id, stock: newStock });
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
            inputRef.current?.focus();
            return;
        }

        if (newStock === product.stock) {
            onClose();
            return;
        }

        setLoading(true);
        const result = await updateStockAction(product.id, newStock);
        setLoading(false);

        if (result.success) {
            toast(`Stock updated: ${product.name} → ${newStock}`, "success");
            onClose();
        } else {
            if (result.errors) {
                setErrors(result.errors);
                inputRef.current?.focus();
            } else {
                toast(result.message, "error");
            }
        }
    };

    const handleIncrement = () => {
        setStock(prev => String(Math.max(0, parseInt(prev || "0", 10) + 1)));
    };

    const handleDecrement = () => {
        setStock(prev => String(Math.max(0, parseInt(prev || "0", 10) - 1)));
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "var(--overlay)",
                    zIndex: 50,
                    animation: "fade-in 200ms ease",
                }}
            />

            {/* Modal / Bottom Sheet */}
            <div
                className="responsive-modal"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-xl)",
                    padding: 24,
                    width: "100%",
                    maxWidth: 380,
                    boxShadow: "var(--shadow-drawer)",
                    zIndex: 51,
                    animation: "slide-up 250ms ease",
                }}
            >
                {/* Drag handle for mobile */}
                <div className="mobile-only" style={{ width: 40, height: 4, background: "var(--border-default)", borderRadius: 2, margin: "0 auto 20px" }} />

                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                    Update Stock
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>
                    {product.name}
                </p>

                {/* Current stock */}
                <div
                    style={{
                        margin: "20px 0",
                        padding: "12px 16px",
                        background: "var(--bg-canvas)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Current Stock</span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: product.stock <= 5 ? "var(--danger)" : "var(--text-primary)",
                        }}
                    >
                        {product.stock}
                    </span>
                </div>

                {/* Stepper Input */}
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
                    New Stock
                </label>
                
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button
                        type="button"
                        onClick={handleDecrement}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "var(--radius-pill)",
                            border: "1px solid var(--border-default)",
                            background: "var(--bg-card)",
                            fontSize: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--text-primary)",
                        }}
                        aria-label="Decrease stock"
                    >
                        -
                    </button>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <input
                            id="stock"
                            ref={inputRef}
                            type="number"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit();
                                if (e.key === "Escape") onClose();
                            }}
                            style={{
                                width: "100%",
                                height: 48,
                                fontSize: 18,
                                fontWeight: 700,
                                border: `1px solid ${errors.stock ? "var(--danger)" : "var(--border-default)"}`,
                                borderRadius: "var(--radius-pill)",
                                outline: "none",
                                textAlign: "center",
                                color: "var(--text-primary)",
                                background: "var(--bg-card)",
                                transition: "border-color 150ms ease",
                            }}
                            aria-invalid={!!errors.stock}
                            aria-describedby={errors.stock ? "stock-error" : undefined}
                        />
                        {errors.stock && <span id="stock-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)", textAlign: "center" }}>{errors.stock[0]}</span>}
                    </div>
                    <button
                        type="button"
                        onClick={handleIncrement}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "var(--radius-pill)",
                            border: "1px solid var(--border-default)",
                            background: "var(--bg-card)",
                            fontSize: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--text-primary)",
                        }}
                        aria-label="Increase stock"
                    >
                        +
                    </button>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                    <LoadingButton variant="secondary" onClick={onClose} style={{ flex: 1, borderRadius: "var(--radius-pill)" }}>
                        Cancel
                    </LoadingButton>
                    <LoadingButton variant="primary" loading={loading} onClick={handleSubmit} style={{ flex: 1, borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}>
                        Save
                    </LoadingButton>
                </div>
            </div>
        </>
    );
}
