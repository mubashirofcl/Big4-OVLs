import { z } from "zod";
import { OfferLinkType } from "@prisma/client";

export const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  discountText: z.string().optional().nullable(),
  bannerImage: z.string().min(1, "Banner image is required"),
  bannerImageMobile: z.string().optional().nullable(),
  linkType: z.nativeEnum(OfferLinkType),
  linkValue: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  startDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  endDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
});

export type OfferFormValues = z.infer<typeof offerSchema>;
