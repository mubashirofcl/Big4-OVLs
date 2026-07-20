"use server";

import { requireAuth } from "@/lib/auth-guard";
import { offerService } from "@/services/offer.service";
import { offerSchema } from "@/validations/offer.validation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/admin.types";
import { triggerStorefrontRevalidation } from "@/lib/revalidate";

export async function createOfferAction(formData: FormData): Promise<ActionResult> {
    try {
        await requireAuth();

        const raw = {
            title: formData.get("title") as string,
            description: formData.get("description") as string || undefined,
            discountText: formData.get("discountText") as string || undefined,
            bannerImage: formData.get("bannerImage") as string,
            bannerImageMobile: formData.get("bannerImageMobile") as string || undefined,
            linkType: formData.get("linkType") as string,
            linkValue: formData.get("linkValue") as string || undefined,
            isActive: formData.get("isActive") === "true",
            displayOrder: parseInt(formData.get("displayOrder") as string || "0", 10),
            startDate: formData.get("startDate") as string || undefined,
            endDate: formData.get("endDate") as string || undefined,
        };

        const parsed = offerSchema.safeParse(raw);
        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid input";
            return { success: false, message: msg, data: null };
        }

        const result = await offerService.create(parsed.data as any);

        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/offers");
        await triggerStorefrontRevalidation(["offers"]);

        return { success: true, message: "Offer created successfully", data: null };
    } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT") throw error;
        console.error("createOfferAction error:", error);
        return { success: false, message: "Something went wrong", data: null };
    }
}

export async function updateOfferAction(
    offerId: string,
    formData: FormData
): Promise<ActionResult> {
    try {
        await requireAuth();

        const raw = {
            title: formData.get("title") as string,
            description: formData.get("description") as string || undefined,
            discountText: formData.get("discountText") as string || undefined,
            bannerImage: formData.get("bannerImage") as string,
            bannerImageMobile: formData.get("bannerImageMobile") as string || undefined,
            linkType: formData.get("linkType") as string,
            linkValue: formData.get("linkValue") as string || undefined,
            isActive: formData.get("isActive") === "true",
            displayOrder: parseInt(formData.get("displayOrder") as string || "0", 10),
            startDate: formData.get("startDate") as string || undefined,
            endDate: formData.get("endDate") as string || undefined,
        };

        const parsed = offerSchema.safeParse(raw);
        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Invalid input";
            return { success: false, message: msg, data: null };
        }

        const result = await offerService.update(offerId, parsed.data as any);

        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/offers");
        revalidatePath(`/admin/offers/${offerId}`);
        await triggerStorefrontRevalidation(["offers"]);

        return { success: true, message: "Offer updated successfully", data: null };
    } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT") throw error;
        console.error("updateOfferAction error:", error);
        return { success: false, message: "Something went wrong", data: null };
    }
}

export async function deleteOfferAction(offerId: string): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await offerService.delete(offerId);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/offers");
        await triggerStorefrontRevalidation(["offers"]);

        return { success: true, message: "Offer deleted", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}

export async function reorderOffersAction(updates: { id: string; displayOrder: number }[]): Promise<ActionResult> {
    try {
        await requireAuth();

        const result = await offerService.reorder(updates);
        if (!result.success) {
            return { success: false, message: result.message, data: null };
        }

        revalidatePath("/admin/offers");
        await triggerStorefrontRevalidation(["offers"]);

        return { success: true, message: "Offers reordered", data: null };
    } catch {
        return { success: false, message: "Something went wrong", data: null };
    }
}
