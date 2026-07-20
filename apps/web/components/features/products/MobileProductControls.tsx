"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/types/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MobileProductControlsProps {
  categories: Category[];
  brands: string[];
  materials?: string[];
  finishes?: string[];
  colors?: string[];
  sizes?: string[];
}

export function MobileProductControls({ 
  categories, 
  brands,
  materials = [],
  finishes = [],
  colors = [],
  sizes = []
}: MobileProductControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const currentMaterial = searchParams.get("material") || "all";
  const currentFinish = searchParams.get("finish") || "all";
  const currentSize = searchParams.get("size") || "all";
  const inStock = searchParams.get("inStock") === "true";
  
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const currentSort = searchParams.get("sort") || "newest";

  const activeFilterCount = Array.from(searchParams.keys()).filter((k) => k !== "page" && k !== "sort" && k !== "search").length;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`/products?${createQueryString(name, value)}`, { scroll: false });
  };

  const onSortChange = (value: string) => {
    updateFilter("sort", value === "newest" ? "" : value);
    setIsSortOpen(false); // Close after sort
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("sort")) params.set("sort", searchParams.get("sort")!);
    if (searchParams.get("search")) params.set("search", searchParams.get("search")!);
    router.push(`/products?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  return (
    <div className="lg:hidden flex gap-4 mb-6">
      {/* Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button suppressHydrationWarning variant="ghost" className="flex-1 h-10 flex items-center justify-center gap-2 rounded-full bg-secondary/40 hover:bg-secondary/60 text-sm font-medium active:scale-95 transition-transform">
            <FilterIcon className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto px-6">
          <SheetHeader className="mb-6 flex flex-row items-center justify-between text-left">
            <SheetTitle className="text-2xl font-semibold">Filters</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-8 pb-32">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Categories</h3>
              <RadioGroup value={currentCategory} onValueChange={(val) => updateFilter("category", val)}>
                <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                  <RadioGroupItem value="all" id="m-cat-all" className="w-5 h-5" />
                  <Label htmlFor="m-cat-all" className="text-base flex-1">All Categories</Label>
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={cat.slug} id={`m-cat-${cat.slug}`} className="w-5 h-5" />
                      <Label htmlFor={`m-cat-${cat.slug}`} className="text-base">{cat.name}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Materials */}
            {materials.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Material</h3>
                <RadioGroup value={currentMaterial} onValueChange={(val) => updateFilter("material", val)}>
                  <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                    <RadioGroupItem value="all" id="m-mat-all" className="w-5 h-5" />
                    <Label htmlFor="m-mat-all" className="text-base flex-1">All Materials</Label>
                  </div>
                  {materials.map((m) => (
                    <div key={m} className="flex items-center space-x-3 py-2 border-b border-border/50">
                      <RadioGroupItem value={m} id={`m-mat-${m}`} className="w-5 h-5" />
                      <Label htmlFor={`m-mat-${m}`} className="text-base">{m}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Finishes */}
            {finishes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Finish</h3>
                <RadioGroup value={currentFinish} onValueChange={(val) => updateFilter("finish", val)}>
                  <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                    <RadioGroupItem value="all" id="m-fin-all" className="w-5 h-5" />
                    <Label htmlFor="m-fin-all" className="text-base flex-1">All Finishes</Label>
                  </div>
                  {finishes.map((f) => (
                    <div key={f} className="flex items-center space-x-3 py-2 border-b border-border/50">
                      <RadioGroupItem value={f} id={`m-fin-${f}`} className="w-5 h-5" />
                      <Label htmlFor={`m-fin-${f}`} className="text-base">{f}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Colour</h3>
                <div className="flex flex-wrap gap-3 py-2">
                  {colors.map((c) => {
                    const isActive = searchParams.get("color") === c;
                    return (
                      <button
                        key={c}
                        onClick={() => updateFilter("color", isActive ? "all" : c)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${isActive ? 'border-primary scale-110' : 'border-border'}`}
                        style={{ backgroundColor: c.toLowerCase().replace(' ', '') }}
                        title={c}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Size</h3>
                <RadioGroup value={currentSize} onValueChange={(val) => updateFilter("size", val)}>
                  <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                    <RadioGroupItem value="all" id="m-sz-all" className="w-5 h-5" />
                    <Label htmlFor="m-sz-all" className="text-base flex-1">All Sizes</Label>
                  </div>
                  {sizes.map((s) => (
                    <div key={s} className="flex items-center space-x-3 py-2 border-b border-border/50">
                      <RadioGroupItem value={s} id={`m-sz-${s}`} className="w-5 h-5" />
                      <Label htmlFor={`m-sz-${s}`} className="text-base">{s}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Price Range</h3>
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    placeholder="Min Price" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                    className="h-12 text-base"
                  />
                  <span>-</span>
                  <Input 
                    type="number" 
                    placeholder="Max Price" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                    className="h-12 text-base"
                  />
                </div>
                <Button onClick={handlePriceApply} variant="secondary" className="w-full h-12">
                  Apply Price
                </Button>
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Brands</h3>
                <RadioGroup value={currentBrand} onValueChange={(val) => updateFilter("brand", val)}>
                  <div className="flex items-center space-x-3 py-2 border-b border-border/50">
                    <RadioGroupItem value="all" id="m-brand-all" className="w-5 h-5" />
                    <Label htmlFor="m-brand-all" className="text-base flex-1">All Brands</Label>
                  </div>
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-3 py-2 border-b border-border/50">
                      <RadioGroupItem value={brand} id={`m-brand-${brand}`} className="w-5 h-5" />
                      <Label htmlFor={`m-brand-${brand}`} className="text-base">{brand}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Availability</h3>
              <div className="flex items-center space-x-3 py-2">
                <Checkbox
                  id="m-inStock"
                  checked={inStock}
                  className="w-5 h-5"
                  onCheckedChange={(checked) => updateFilter("inStock", checked ? "true" : "")}
                />
                <Label htmlFor="m-inStock" className="text-base">In stock only</Label>
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-4">
              <Button suppressHydrationWarning variant="outline" className="flex-1 h-12" onClick={clearAllFilters}>Clear all</Button>
              <Button suppressHydrationWarning className="flex-1 h-12" onClick={() => setIsFilterOpen(false)}>Show Results</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
        <SheetTrigger asChild>
          <Button suppressHydrationWarning variant="ghost" className="flex-1 h-10 flex items-center justify-center gap-2 rounded-full bg-secondary/40 hover:bg-secondary/60 text-sm font-medium active:scale-95 transition-transform">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl px-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-semibold text-left">Sort by</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-8">
            <RadioGroup value={currentSort} onValueChange={onSortChange}>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="newest" id="sort-newest" className="w-5 h-5" />
                <Label htmlFor="sort-newest" className="text-base flex-1">Newest</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="price_asc" id="sort-price-asc" className="w-5 h-5" />
                <Label htmlFor="sort-price-asc" className="text-base flex-1">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="price_desc" id="sort-price-desc" className="w-5 h-5" />
                <Label htmlFor="sort-price-desc" className="text-base flex-1">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-3 py-3 border-b border-border/50">
                <RadioGroupItem value="name_asc" id="sort-name-asc" className="w-5 h-5" />
                <Label htmlFor="sort-name-asc" className="text-base flex-1">Name: A to Z</Label>
              </div>
              <div className="flex items-center space-x-3 py-3">
                <RadioGroupItem value="name_desc" id="sort-name-desc" className="w-5 h-5" />
                <Label htmlFor="sort-name-desc" className="text-base flex-1">Name: Z to A</Label>
              </div>
            </RadioGroup>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
