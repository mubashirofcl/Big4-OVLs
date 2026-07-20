import { createProductSchema } from "./src/validations/product.validation";
import { z } from "zod/v4"; // Wait, in the code it's `zod/v4`? Wait, I saw `zod/v4`? Wait, `zod` usually.

const formData = new Map<string, any>();
formData.set("name", "Tile");
formData.set("sku", "TILE-01");
formData.set("price", "100");
formData.set("costPrice", "80");
formData.set("stock", "10");
formData.set("brandId", "brand-1");
formData.set("categoryId", "cat-1");
formData.set("images", JSON.stringify([{ url: "http://example.com/img.jpg", publicId: "img1" }]));
formData.set("priceUnit", "PER_SQM");

const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: (formData.get("description") as string) || undefined,
    brandId: (formData.get("brandId") as string) || undefined,
    price: parseFloat(formData.get("price") as string),
    costPrice: parseFloat(formData.get("costPrice") as string),
    stock: parseInt(formData.get("stock") as string, 10),
    imageUrl: (formData.get("imageUrl") as string) || undefined,
    images: JSON.parse(formData.get("images") as string),
    categoryId: formData.get("categoryId") as string,
    priceUnit: (formData.get("priceUnit") as string) || undefined,
    salePrice: formData.has("salePrice") && formData.get("salePrice") ? parseFloat(formData.get("salePrice") as string) : undefined,
    color: (formData.get("color") as string) || undefined,
    material: (formData.get("material") as string) || undefined,
    finish: (formData.get("finish") as string) || undefined,
    size: (formData.get("size") as string) || undefined,
    coveragePerBox: formData.has("coveragePerBox") && formData.get("coveragePerBox") ? parseFloat(formData.get("coveragePerBox") as string) : undefined,
    highlights: formData.has("highlights") ? JSON.parse(formData.get("highlights") as string) : undefined,
};

try {
    const parsed = createProductSchema.safeParse(raw);
    console.log("Parsed:", JSON.stringify(parsed, null, 2));
} catch (e) {
    console.error("Crash:", e);
}
