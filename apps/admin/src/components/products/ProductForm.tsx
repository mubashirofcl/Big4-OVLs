"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ImageUploader, type UploadedImage } from "@/components/ui/ImageUploader";
import { useToast } from "@/components/ui/ToastProvider";
import { createProductAction, updateProductAction } from "@/actions/product.actions";
import { createProductSchema, updateProductSchema } from "@/validations/product.validation";

interface CategoryOption {
    id: string;
    name: string;
}

interface BrandOption {
    id: string;
    name: string;
}

interface ProductImageData {
    id: string;
    url: string;
    publicId: string;
    displayOrder: number;
}

interface ProductData {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    brandId: string | null;
    price: number;
    costPrice: number;
    stock: number;
    imageUrl: string | null;
    images: ProductImageData[];
    categoryId: string;
    isActive: boolean;
}

interface ProductFormProps {
    categories: CategoryOption[];
    brands: BrandOption[];
    product?: ProductData;
}

export function ProductForm({ categories, brands, product }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const isEdit = !!product;

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<UploadedImage[]>(
        product?.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            displayOrder: img.displayOrder,
        })) ?? []
    );

    // Form fields
    const [name, setName] = useState(product?.name ?? "");
    const [sku, setSku] = useState(product?.sku ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [brandId, setBrandId] = useState(product?.brandId ?? "");
    const [price, setPrice] = useState(product?.price?.toString() ?? "");
    const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() ?? "");
    const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
    const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        const rawData = {
            name: name.trim(),
            sku: sku.trim(),
            description: description.trim() || undefined,
            brandId: brandId || undefined,
            price: price ? parseFloat(price) : -1,
            costPrice: costPrice ? parseFloat(costPrice) : -1,
            stock: stock ? parseInt(stock, 10) : 0,
            imageUrl: images.length > 0 ? images[0].url : undefined,
            images,
            categoryId,
        };

        const schema = isEdit ? updateProductSchema : createProductSchema;
        const parsed = schema.safeParse(rawData);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            setErrors(fieldErrors as Record<string, string[]>);
            
            // Focus first error field
            const firstErrorField = Object.keys(fieldErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.focus();
            }
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.set("name", rawData.name!);
        formData.set("sku", rawData.sku!);
        if (rawData.description) formData.set("description", rawData.description);
        if (rawData.brandId) formData.set("brandId", rawData.brandId);
        formData.set("price", rawData.price.toString());
        formData.set("costPrice", rawData.costPrice.toString());
        formData.set("stock", rawData.stock.toString());
        formData.set("categoryId", rawData.categoryId!);

        const imageUrl = images.length > 0 ? images[0].url : "";
        formData.set("imageUrl", imageUrl);
        formData.set("images", JSON.stringify(images));

        const result = isEdit
            ? await updateProductAction(product.id, formData)
            : await createProductAction(formData);

        setLoading(false);

        if (result.success) {
            toast(result.message, "success");
            router.push("/admin/products");
            router.refresh();
        } else {
            if (result.errors) {
                setErrors(result.errors);
                const firstErrorField = Object.keys(result.errors)[0];
                const element = document.getElementById(firstErrorField);
                if (element) element.focus();
            } else {
                toast(result.message, "error");
            }
        }
    };

    const getInputStyle = (hasError: boolean): React.CSSProperties => ({
        width: "100%",
        padding: "10px 14px",
        border: `1px solid ${hasError ? "var(--danger)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        fontSize: 16,
        outline: "none",
        background: "var(--bg-canvas)",
        color: "var(--text-primary)",
        transition: "border-color 150ms ease",
    });

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-primary)",
        marginBottom: 8,
        marginLeft: 4,
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: "relative" }}>
            <div className="product-form-grid">
                {/* Left Column — Main Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Basic Details Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Basic Details</h3>
                        
                        <div>
                            <label htmlFor="name" style={labelStyle}>Product Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Premium Floor Tile 600x600"
                                style={getInputStyle(!!errors.name)}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "name-error" : undefined}
                                required
                            />
                            {errors.name && <span id="name-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.name[0]}</span>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                            <div>
                                <label htmlFor="sku" style={labelStyle}>SKU *</label>
                                <input
                                    id="sku"
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="e.g. TILE-FL-001"
                                    style={getInputStyle(!!errors.sku)}
                                    aria-invalid={!!errors.sku}
                                    aria-describedby={errors.sku ? "sku-error" : undefined}
                                    required
                                />
                                {errors.sku && <span id="sku-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.sku[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="categoryId" style={labelStyle}>Category *</label>
                                <select
                                    id="categoryId"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    style={{ ...getInputStyle(!!errors.categoryId), paddingRight: 32, appearance: "none" }}
                                    aria-invalid={!!errors.categoryId}
                                    aria-describedby={errors.categoryId ? "categoryId-error" : undefined}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <span id="categoryId-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.categoryId[0]}</span>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="brandId" style={labelStyle}>Brand *</label>
                            <select
                                id="brandId"
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                                style={{ ...getInputStyle(!!errors.brandId), paddingRight: 32, appearance: "none" }}
                                aria-invalid={!!errors.brandId}
                                aria-describedby={errors.brandId ? "brandId-error" : undefined}
                                required
                            >
                                <option value="">Select brand</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                            {errors.brandId && <span id="brandId-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.brandId[0]}</span>}
                        </div>

                        <div>
                            <label htmlFor="description" style={labelStyle}>Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Product details, specifications, features..."
                                rows={4}
                                style={{ ...getInputStyle(!!errors.description), resize: "vertical" }}
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && <span id="description-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.description[0]}</span>}
                        </div>
                    </div>

                    {/* Pricing & Inventory Card */}
                    <div className="saas-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingBottom: 16, borderBottom: "1px solid var(--border-default)", color: "var(--text-primary)" }}>Pricing & Inventory</h3>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
                            <div>
                                <label htmlFor="price" style={labelStyle}>Selling Price (₹) *</label>
                                <input
                                    id="price"
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    style={getInputStyle(!!errors.price)}
                                    aria-invalid={!!errors.price}
                                    aria-describedby={errors.price ? "price-error" : undefined}
                                    required
                                />
                                {errors.price && <span id="price-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.price[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="costPrice" style={labelStyle}>Cost Price (₹) *</label>
                                <input
                                    id="costPrice"
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    placeholder="0.00"
                                    style={getInputStyle(!!errors.costPrice)}
                                    aria-invalid={!!errors.costPrice}
                                    aria-describedby={errors.costPrice ? "costPrice-error" : undefined}
                                    required
                                />
                                {errors.costPrice && <span id="costPrice-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.costPrice[0]}</span>}
                            </div>
                            <div>
                                <label htmlFor="stock" style={labelStyle}>Stock</label>
                                <input
                                    id="stock"
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    style={getInputStyle(!!errors.stock)}
                                    aria-invalid={!!errors.stock}
                                    aria-describedby={errors.stock ? "stock-error" : undefined}
                                />
                                {errors.stock && <span id="stock-error" style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--danger)" }}>{errors.stock[0]}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column — Image + Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Image Upload */}
                    <div className="saas-card">
                        <ImageUploader
                            currentImages={images}
                            onImagesChange={(imgs) => {
                                setImages(imgs);
                                if (errors.images) {
                                    setErrors(prev => ({ ...prev, images: [] }));
                                }
                            }}
                            onUploadStart={() => setUploading(true)}
                            onUploadEnd={() => setUploading(false)}
                            maxImages={5}
                        />
                        {errors.images && errors.images.length > 0 && <span id="images-error" style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--danger)" }}>{errors.images[0]}</span>}
                    </div>

                    {/* Actions (Desktop) */}
                    <div className="saas-card hide-on-mobile" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            disabled={uploading}
                            style={{ width: "100%", borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                        >
                            {isEdit ? "Update Product" : "Create Product"}
                        </LoadingButton>

                        <LoadingButton
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                            style={{ width: "100%", borderRadius: "var(--radius-pill)" }}
                        >
                            Cancel
                        </LoadingButton>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div
                className="mobile-only"
                style={{
                    position: "fixed",
                    bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
                    left: 0,
                    right: 0,
                    background: "var(--bg-card)",
                    padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
                    borderTop: "1px solid var(--border-default)",
                    zIndex: 40,
                    boxShadow: "var(--shadow-drawer)",
                }}
            >
                <div style={{ display: "flex", gap: 12 }}>
                    <LoadingButton
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                        style={{ flex: 1, borderRadius: "var(--radius-pill)" }}
                    >
                        Cancel
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        disabled={uploading}
                        style={{ flex: 1, borderRadius: "var(--radius-pill)", background: "var(--hero-bg)" }}
                    >
                        {isEdit ? "Save" : "Create"}
                    </LoadingButton>
                </div>
            </div>
        </form>
    );
}
