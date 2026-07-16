import { getProducts } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
}

export async function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  try {
    const response = await getProducts({ category: categorySlug, limit: 5 });
    
    // Filter out the current product and take only 4
    const relatedProducts = response.data
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4);

    if (relatedProducts.length === 0) return null;

    return (
      <section className="mt-24 pt-12 border-t border-border">
        <h2 className="text-3xl font-heading font-semibold mb-8">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    );
  } catch (error) {
    // Graceful degradation
    return null;
  }
}
