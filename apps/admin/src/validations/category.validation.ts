import { z } from "zod/v4";

/**
 * Category validation schemas.
 */
export const createCategorySchema = z.object({
    name: z.string().trim().min(2, "Category name must be at least 2 characters").max(60, "Category name cannot exceed 60 characters"),
});

export const updateCategorySchema = z.object({
    name: z.string().trim().min(2, "Category name must be at least 2 characters").max(60, "Category name cannot exceed 60 characters"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
