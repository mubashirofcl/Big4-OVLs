import { getCategories, getProducts } from "@/lib/api";
import { ProductFilters } from "@/components/features/products/ProductFilters";
import { ProductGrid } from "@/components/features/products/ProductGrid";
import { ProductSearch } from "@/components/features/products/ProductSearch";
import { SortSelect } from "@/components/features/products/SortSelect";
import { ActiveFilterChips } from "@/components/features/products/ActiveFilterChips";
import { ProductPagination } from "@/components/features/products/ProductPagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";
import FadeIn from "@/components/animations/FadeIn";

export const metadata = {
  title: "Products | Big4 Tiles & Sanitary",
  description: "Browse our extensive catalog of premium tiles and sanitaryware.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const brand = typeof searchParams.brand === "string" ? searchParams.brand : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const inStock = searchParams.inStock === "true";

  // Fetch categories and products in parallel
  const [categoriesRes, productsRes] = await Promise.all([
    getCategories().catch(() => ({ data: [] })),
    getProducts({
      page,
      limit,
      search,
      category,
      brand,
      sort,
      inStock,
    }).catch(() => null), // Return null if API is down
  ]);

  const categories = categoriesRes.data || [];
  
  // Extract unique brands from the current products response (since API doesn't have a brands endpoint)
  // Ideally this would come from a dedicated `/brands` API endpoint.
  // For now, we mock it or extract from known.
  const brands = Array.from(new Set(productsRes?.data.map((p) => p.brand).filter(Boolean) as string[]));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <FadeIn>
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl font-semibold mb-3 uppercase">
                  Our Products
                </h1>
                <p className="text-muted-foreground text-lg">
                  {productsRes?.pagination.total 
                    ? `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, productsRes.pagination.total)} of ${productsRes.pagination.total} products`
                    : "Browse our collection"}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ProductSearch />
                <SortSelect />
              </div>
            </div>
            
            <ActiveFilterChips />
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters categories={categories} brands={brands} />
            
            <div className="flex-1">
              {productsRes ? (
                <>
                  <ProductGrid products={productsRes.data} />
                  <ProductPagination 
                    currentPage={productsRes.pagination.page} 
                    totalPages={productsRes.pagination.totalPages} 
                  />
                </>
              ) : (
                <div className="py-20 text-center text-red-500">
                  <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                  <p>Please check if the backend API is running and accessible.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
