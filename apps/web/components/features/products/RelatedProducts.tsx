import { getProducts } from "@/lib/api";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
  material?: string | null;
}

export async function RelatedProducts({ categorySlug, currentProductId, material }: RelatedProductsProps) {
  try {
    let relatedProducts: any[] = [];
    
    if (material) {
      const matRes = await getProducts({ category: categorySlug, material, limit: 10 });
      relatedProducts = matRes.data.filter((p) => p.id !== currentProductId);
    }
    
    if (relatedProducts.length < 5) {
      const catRes = await getProducts({ category: categorySlug, limit: 10 });
      const newItems = catRes.data.filter(p => p.id !== currentProductId && !relatedProducts.some(rp => rp.id === p.id));
      relatedProducts = [...relatedProducts, ...newItems];
    }
    
    relatedProducts = relatedProducts.slice(0, 5);

    if (relatedProducts.length === 0) return null;

    return (
      <section className="mt-24 pt-12 border-t border-border">
        <h2 className="text-3xl font-heading font-semibold mb-8">You May Also Like</h2>
        
        {/* Horizontal Scroll for Desktop and Mobile with arrows via CSS or just scrollbar hidden */}
        <div className="relative group">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide">
            {relatedProducts.map((product) => (
              <div key={product.id} className="w-[85vw] sm:w-[300px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    return null;
  }
}
