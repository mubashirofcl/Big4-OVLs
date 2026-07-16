"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/types/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const inStock = searchParams.get("inStock") === "true";

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

  const activeFilterCount = Array.from(searchParams.keys()).filter((k) => k !== "page" && k !== "sort").length;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Categories</h3>
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
              {cat.productCount !== undefined && (
                <span className="text-xs text-muted-foreground">{cat.productCount}</span>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Brands</h3>
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
        <h3 className="font-semibold text-lg">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStock}
            onCheckedChange={(checked) => updateFilter("inStock", checked ? "true" : "")}
          />
          <Label htmlFor="inStock">In stock only</Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <FilterIcon className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 pr-6">
        <FilterContent />
      </div>
    </>
  );
}
