import { z } from "zod/v4";

/**
 * Product-related validation schemas.
 */

/** Reusable price validator */
const priceSchema = z.number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: "Price can only have up to 2 decimal places"
    });

/** Image entry schema */
const productImageSchema = z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
    displayOrder: z.number().int().min(0).optional(),
});

/** Create product schema */
export const createProductSchema = z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120, "Product name cannot exceed 120 characters"),
    sku: z.string().trim().min(1, "SKU is required").max(50),
    description: z.string().max(2000).optional(),
    brandId: z.string().min(1, "Please select a brand"),
    price: priceSchema,
    costPrice: priceSchema,
    stock: z.number({ invalid_type_error: "Stock must be a number" }).int("Stock must be a whole number").min(0, "Stock must be 0 or greater"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).min(1, "At least one image is required").max(8, "Cannot exceed 8 images"),
    categoryId: z.string().min(1, "Please select a category"),
});

/** Update product schema (all fields optional except id) */
export const updateProductSchema = z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120, "Product name cannot exceed 120 characters").optional(),
    sku: z.string().trim().min(1, "SKU is required").max(50).optional(),
    description: z.string().max(2000).optional(),
    brandId: z.string().min(1, "Please select a brand").optional(),
    price: priceSchema.optional(),
    costPrice: priceSchema.optional(),
    stock: z.number({ invalid_type_error: "Stock must be a number" }).int("Stock must be a whole number").min(0, "Stock must be 0 or greater").optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(productImageSchema).max(8).optional(),
    categoryId: z.string().min(1, "Please select a category").optional(),
});

/** Inferred types */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
