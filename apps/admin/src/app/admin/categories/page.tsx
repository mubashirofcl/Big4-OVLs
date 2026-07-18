import type { Metadata } from "next";
import { categoryService } from "@/services/category.service";
import { CategoryListClient } from "@/components/categories/CategoryListClient";
import { Pagination } from "@/components/ui/Pagination";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Categories — Big4 Admin",
    description: "Manage product categories",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

/**
 * /admin/categories — Category management page.
 */
export default async function CategoriesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page, 10) : 1;
    const result = await categoryService.list({ page });

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Categories
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Manage your product categories
                </p>
            </div>

            <CategoryListClient categories={result.items} />

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
