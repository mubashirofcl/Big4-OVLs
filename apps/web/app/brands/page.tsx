import type { Metadata } from "next";
import BrandsClient from "./BrandsClient";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Authorized Brands | Kajaria, Simpolo & Grohe Dealer in Sullia",
  description:
    "Browse top tile & sanitaryware brands available at Big4 Tiles & Sanitary in Sullia. Authorized collection of Kajaria, Simpolo, Hindware, Grohe, Jaquar & Somany.",
  alternates: {
    canonical: `${siteConfig.website}/brands`,
  },
  openGraph: {
    title: "Authorized Brands | Kajaria, Simpolo & Grohe Dealer in Sullia",
    description:
      "Browse top tile & sanitaryware brands available at Big4 Tiles & Sanitary in Sullia. Authorized collection of Kajaria, Simpolo, Hindware, Grohe, Jaquar & Somany.",
    url: `${siteConfig.website}/brands`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function BrandsPage() {
  return <BrandsClient />;
}