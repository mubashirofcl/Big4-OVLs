import type { Metadata } from "next";
import { brandService } from "@/services/brand.service";
import { BrandListClient } from "@/components/brands/BrandListClient";
import { Pagination } from "@/components/ui/Pagination";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Brands — Big4 Admin",
    description: "Manage product brands",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

/**
 * /admin/brands — Brand management page.
 */
export default async function BrandsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page, 10) : 1;
    const result = await brandService.list({ page });

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Brands
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Manage your product brands
                </p>
            </div>

            <BrandListClient brands={result.items} />

            <div style={{ marginTop: 24 }}>
                <Suspense>
                    <Pagination
                        currentPage={result.page}
                        totalPages={result.totalPages}
                        total={result.total}
                    />
                </Suspense>
            </div>
        </div>
    );
}
