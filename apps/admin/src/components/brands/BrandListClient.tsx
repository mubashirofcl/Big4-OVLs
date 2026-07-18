"use client";

import { useState, useEffect } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import {
    createBrandAction,
    updateBrandAction,
    deleteBrandAction,
} from "@/actions/brand.actions";
import { createBrandSchema, updateBrandSchema } from "@/validations/brand.validation";

interface BrandItem {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
}

interface BrandListClientProps {
    brands: BrandItem[];
}

export function BrandListClient({ brands: initialBrands }: BrandListClientProps) {
    const { toast } = useToast();
    const [brands, setBrands] = useState(initialBrands);

    // Sync state when props change (e.g. pagination)
    useEffect(() => {
        setBrands(initialBrands);
    }, [initialBrands]);

    // Create
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    // Edit
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleCreate = async () => {
        setCreateError("");
        
        const parsed = createBrandSchema.safeParse({ name: newName });
        if (!parsed.success) {
            setCreateError(parsed.error.flatten().fieldErrors.name?.[0] || "Invalid name");
            document.getElementById("create-brand-input")?.focus();
            return;
        }
        
        setCreating(true);
        const result = await createBrandAction(parsed.data.name);
        setCreating(false);

        if (result.success) {
            toast("Brand created", "success");
            setNewName("");
            window.location.reload();
        } else {
            if (result.errors?.name) {
                setCreateError(result.errors.name[0]);
                document.getElementById("create-brand-input")?.focus();
            } else {
                toast(result.message, "error");
            }
        }
    };

    const handleUpdate = async (id: string, originalName: string) => {
        setEditError("");
        
        const parsed = updateBrandSchema.safeParse({ name: editName });
        if (!parsed.success) {
            setEditError(parsed.error.flatten().fieldErrors.name?.[0] || "Invalid name");
            document.getElementById(`edit-brand-${id}`)?.focus();
            return;
        }

        if (parsed.data.name === originalName) {
            setEditId(null);
            return;
        }

        setSaving(true);
        const result = await updateBrandAction(id, parsed.data.name);
        setSaving(false);

        if (result.success) {
            toast("Brand updated", "success");
            setEditId(null);
            setBrands((prev) =>
                prev.map((b) => (b.id === id ? { ...b, name: parsed.data.name } : b))
            );
        } else {
            if (result.errors?.name) {
                setEditError(result.errors.name[0]);
                document.getElementById(`edit-brand-${id}`)?.focus();
            } else {
                toast(result.message, "error");
            }
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const result = await deleteBrandAction(deleteTarget.id);
        setDeleting(false);

        if (result.success) {
            toast("Brand deleted", "success");
            setDeleteTarget(null);
            setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        } else {
            toast(result.message, "error");
            setDeleteTarget(null);
        }
    };

    return (
        <>
            {/* Create new brand */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 12 }}>
                    <input
                        id="create-brand-input"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        placeholder="New brand name…"
                        style={{
                            flex: 1,
                            maxWidth: 400,
                            padding: "12px 16px",
                            border: `1px solid ${createError ? "var(--danger)" : "var(--border-default)"}`,
                            borderRadius: "var(--radius-pill)",
                            fontSize: 14,
                            outline: "none",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            boxShadow: "var(--shadow-sm)",
                        }}
                        aria-invalid={!!createError}
                        aria-describedby={createError ? "create-error" : undefined}
                    />
                    <LoadingButton loading={creating} onClick={handleCreate} style={{ borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}>
                        + Add Brand
                    </LoadingButton>
                </div>
                {createError && <span id="create-error" style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--danger)" }}>{createError}</span>}
            </div>

            {/* Brand list */}
            <div className="saas-card saas-table-container" style={{ padding: 0, overflow: "hidden" }}>
                {brands.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>No brands yet</div>
                        <div style={{ marginTop: 4, color: "var(--text-secondary)", fontSize: 14 }}>Create your first brand above</div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hide-on-mobile" style={{ overflowX: "auto" }}>
                            <table className="saas-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th style={{ textAlign: "center" }}>Products</th>
                                        <th style={{ textAlign: "center", width: 180 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.map((brand) => (
                                        <tr key={brand.id}>
                                            <td>
                                                {editId === brand.id ? (
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <input
                                                            id={`edit-brand-${brand.id}`}
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") handleUpdate(brand.id, brand.name);
                                                                if (e.key === "Escape") setEditId(null);
                                                            }}
                                                            autoFocus
                                                            style={{
                                                                padding: "8px 12px",
                                                                border: `2px solid ${editError ? "var(--danger)" : "var(--text-primary)"}`,
                                                                borderRadius: "var(--radius-md)",
                                                                fontSize: 14,
                                                                outline: "none",
                                                                width: "100%",
                                                                maxWidth: 300,
                                                                background: "var(--bg-canvas)",
                                                                color: "var(--text-primary)",
                                                            }}
                                                            aria-invalid={!!editError}
                                                            aria-describedby={editError ? `edit-error-${brand.id}` : undefined}
                                                        />
                                                        {editError && <span id={`edit-error-${brand.id}`} style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{editError}</span>}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>
                                                        {brand.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className={`badge ${brand._count.products > 0 ? "badge-active" : "badge-archived"}`}>
                                                    {brand._count.products} Products
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                    {editId === brand.id ? (
                                                        <>
                                                            <LoadingButton
                                                                variant="primary"
                                                                loading={saving}
                                                                disabled={editName.trim() === brand.name}
                                                                onClick={() => handleUpdate(brand.id, brand.name)}
                                                                style={{ padding: "6px 16px", borderRadius: "var(--radius-pill)", fontSize: 13, background: "var(--hero-bg)" }}
                                                            >
                                                                Save
                                                            </LoadingButton>
                                                            <button
                                                                onClick={() => setEditId(null)}
                                                                style={{
                                                                    padding: "6px 16px",
                                                                    borderRadius: "var(--radius-pill)",
                                                                    border: "1px solid var(--border-default)",
                                                                    background: "var(--bg-card)",
                                                                    color: "var(--text-primary)",
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setEditId(brand.id);
                                                                    setEditName(brand.name);
                                                                }}
                                                                style={{
                                                                    padding: "6px 16px",
                                                                    borderRadius: "var(--radius-pill)",
                                                                    border: "1px solid var(--border-default)",
                                                                    background: "var(--bg-card)",
                                                                    color: "var(--text-primary)",
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Rename
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteTarget(brand)}
                                                                style={{
                                                                    padding: "6px 16px",
                                                                    borderRadius: "var(--radius-pill)",
                                                                    border: "1px solid var(--danger-soft)",
                                                                    background: "var(--danger-soft)",
                                                                    color: "var(--danger)",
                                                                    fontSize: 13,
                                                                    fontWeight: 600,
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Mobile Cards */}
                        <div className="mobile-only">
                            {brands.map((brand, i) => (
                                <div key={brand.id} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderTop: i > 0 ? "1px solid var(--border-default)" : "none" }}>
                                    {editId === brand.id ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            <div>
                                                <input
                                                    id={`edit-brand-mobile-${brand.id}`}
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleUpdate(brand.id, brand.name);
                                                        if (e.key === "Escape") setEditId(null);
                                                    }}
                                                    autoFocus
                                                    style={{
                                                        padding: "12px 16px",
                                                        border: `2px solid ${editError ? "var(--danger)" : "var(--text-primary)"}`,
                                                        borderRadius: "var(--radius-md)",
                                                        fontSize: 16,
                                                        outline: "none",
                                                        width: "100%",
                                                        background: "var(--bg-canvas)",
                                                        color: "var(--text-primary)",
                                                    }}
                                                    aria-invalid={!!editError}
                                                    aria-describedby={editError ? `edit-error-mobile-${brand.id}` : undefined}
                                                />
                                                {editError && <span id={`edit-error-mobile-${brand.id}`} style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>{editError}</span>}
                                            </div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <LoadingButton
                                                    variant="primary"
                                                    loading={saving}
                                                    disabled={editName.trim() === brand.name}
                                                    onClick={() => handleUpdate(brand.id, brand.name)}
                                                    style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-pill)", fontSize: 14, background: "var(--hero-bg)" }}
                                                >
                                                    Save
                                                </LoadingButton>
                                                <button
                                                    onClick={() => setEditId(null)}
                                                    style={{
                                                        flex: 1,
                                                        padding: "10px",
                                                        borderRadius: "var(--radius-pill)",
                                                        border: "1px solid var(--border-default)",
                                                        background: "var(--bg-card)",
                                                        color: "var(--text-primary)",
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 16 }}>
                                                    {brand.name}
                                                </span>
                                                <span className={`badge ${brand._count.products > 0 ? "badge-active" : "badge-archived"}`}>
                                                    {brand._count.products} Products
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                                <button
                                                    onClick={() => {
                                                        setEditId(brand.id);
                                                        setEditName(brand.name);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px",
                                                        borderRadius: "var(--radius-pill)",
                                                        border: "1px solid var(--border-default)",
                                                        background: "var(--bg-card)",
                                                        color: "var(--text-primary)",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(brand)}
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px",
                                                        borderRadius: "var(--radius-pill)",
                                                        border: "1px solid var(--danger-soft)",
                                                        background: "var(--danger-soft)",
                                                        color: "var(--danger)",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Brand"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name}"? ${deleteTarget._count.products > 0
                            ? `This brand has ${deleteTarget._count.products} product(s) — you must reassign them first.`
                            : "This action cannot be undone."
                        }`
                        : ""
                }
                confirmLabel="Delete"
                variant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}
