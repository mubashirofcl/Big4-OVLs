import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "@/components/features/products/StockBadge";
import { RelatedProducts } from "@/components/features/products/RelatedProducts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const response = await getProductBySlug(params.slug);
  if (!response) return { title: "Product Not Found" };

  const product = response.data;
  return {
    title: `${product.name} | Big4 Tiles & Sanitary`,
    description: product.description || `Buy ${product.name} at Big4 Tiles & Sanitary.`,
    openGraph: {
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const response = await getProductBySlug(params.slug);
  
  if (!response) {
    notFound();
  }

  const product = response.data;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16">
          <FadeIn>
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/products?category=${product.category.slug}`}>
                    {product.category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Image */}
            <FadeIn delay={0.1}>
              <div className="relative aspect-[4/3] w-full bg-muted/30 rounded-[var(--radius-xl)] overflow-hidden border border-border/50">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Right: Info */}
            <FadeIn delay={0.2} className="flex flex-col">
              <div className="mb-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {product.category.name} {product.brand && `• ${product.brand}`}
                </p>
                <h1 className="text-4xl sm:text-5xl font-heading font-semibold leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <StockBadge stock={product.stock} />
                </div>
                
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>

              <div className="prose prose-invert max-w-none mb-10 text-muted-foreground">
                {product.description ? (
                  <p className="whitespace-pre-wrap">{product.description}</p>
                ) : (
                  <p className="italic">No description available for this product.</p>
                )}
              </div>

              <div className="mt-auto space-y-4 pt-8 border-t border-border">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-none" asChild>
                  <a href="/contact">Enquire Now</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-none ml-0 sm:ml-4" asChild>
                  <a href="/products">Back to Products</a>
                </Button>
              </div>

              {/* Product Info Table */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <dl className="divide-y divide-border/50">
                    <div className="flex justify-between p-4 bg-muted/10">
                      <dt className="font-medium text-muted-foreground">Category</dt>
                      <dd>{product.category.name}</dd>
                    </div>
                    {product.brand && (
                      <div className="flex justify-between p-4">
                        <dt className="font-medium text-muted-foreground">Brand</dt>
                        <dd>{product.brand}</dd>
                      </div>
                    )}
                    <div className="flex justify-between p-4 bg-muted/10">
                      <dt className="font-medium text-muted-foreground">SKU</dt>
                      <dd>{product.sku}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </FadeIn>
          </div>

          <RelatedProducts categorySlug={product.category.slug} currentProductId={product.id} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
