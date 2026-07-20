"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/types/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  materials?: string[];
  finishes?: string[];
  colors?: string[];
  sizes?: string[];
}

export function ProductFilters({ 
  categories, 
  brands,
  materials = [],
  finishes = [],
  colors = [],
  sizes = []
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const currentMaterial = searchParams.get("material") || "all";
  const currentFinish = searchParams.get("finish") || "all";
  const currentSize = searchParams.get("size") || "all";
  const inStock = searchParams.get("inStock") === "true";
  
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

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
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-8 pb-32">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Categories</h3>
        <RadioGroup value={currentCategory} onValueChange={(val) => updateFilter("category", val)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="cat-all" />
            <Label htmlFor="cat-all">All Categories</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}`} />
                <Label htmlFor={`cat-${cat.slug}`}>{cat.name}</Label>
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="mat-all" />
              <Label htmlFor="mat-all">All Materials</Label>
            </div>
            {materials.map((m) => (
              <div key={m} className="flex items-center space-x-2">
                <RadioGroupItem value={m} id={`mat-${m}`} />
                <Label htmlFor={`mat-${m}`}>{m}</Label>
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="fin-all" />
              <Label htmlFor="fin-all">All Finishes</Label>
            </div>
            {finishes.map((f) => (
              <div key={f} className="flex items-center space-x-2">
                <RadioGroupItem value={f} id={`fin-${f}`} />
                <Label htmlFor={`fin-${f}`}>{f}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Colour</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isActive = searchParams.get("color") === c;
              return (
                <button
                  key={c}
                  onClick={() => updateFilter("color", isActive ? "all" : c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${isActive ? 'border-primary scale-110' : 'border-border hover:scale-105'}`}
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="sz-all" />
              <Label htmlFor="sz-all">All Sizes</Label>
            </div>
            {sizes.map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <RadioGroupItem value={s} id={`sz-${s}`} />
                <Label htmlFor={`sz-${s}`}>{s}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min Price" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
            className="w-full h-10"
          />
          <span>-</span>
          <Input 
            type="number" 
            placeholder="Max Price" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            className="w-full h-10"
          />
        </div>
        <Button onClick={handlePriceApply} variant="secondary" className="w-full h-10">
          Apply Price
        </Button>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Brands</h3>
          <RadioGroup value={currentBrand} onValueChange={(val) => updateFilter("brand", val)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="brand-all" />
              <Label htmlFor="brand-all">All Brands</Label>
            </div>
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <RadioGroupItem value={brand} id={`brand-${brand}`} />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-wider">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStock}
            onCheckedChange={(checked) => updateFilter("inStock", checked ? "true" : "")}
          />
          <Label htmlFor="inStock">In stock only</Label>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-4">
        <Button suppressHydrationWarning variant="outline" className="flex-1 h-12" onClick={clearAllFilters}>Clear all</Button>
        <Button suppressHydrationWarning className="flex-1 h-12" onClick={() => setIsOpen(false)}>Show Results</Button>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button suppressHydrationWarning variant="outline" className="w-full sm:w-auto h-10 px-4 flex items-center justify-center gap-2 rounded-lg border-border bg-background shadow-sm active:scale-95 transition-transform">
          <FilterIcon className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] h-full overflow-hidden p-0 flex flex-col">
        <div className="px-6 py-6 border-b border-border">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold text-left">Filters</SheetTitle>
          </SheetHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 relative">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
