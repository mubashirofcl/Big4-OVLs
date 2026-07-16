import { Category, PaginatedResponse, Product, ProductFilters } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

/**
 * Helper to fetch data from the admin API.
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}/api/public${endpoint}`;
  
  const res = await fetch(url, {
    // Default revalidation of 60 seconds for performance, can be overridden
    next: { revalidate: 60 },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

const dummyCategories: Category[] = [
  { id: "1", name: "Tiles", slug: "tiles", productCount: 4 },
  { id: "2", name: "Sanitaryware", slug: "sanitaryware", productCount: 2 },
  { id: "3", name: "Bath Fittings", slug: "bath-fittings", productCount: 2 }
];

const dummyProducts: Product[] = [
  {
    id: "p1",
    name: "Calacatta Gold Marble Tile",
    slug: "calacatta-gold-marble-tile",
    sku: "TILE-CG-001",
    description: "Premium Italian marble tile with gold veining, perfect for luxurious floors and walls.",
    brand: "MODULNOVA",
    price: 120,
    stock: 500,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    isActive: true,
    category: dummyCategories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p2",
    name: "Matte Black Wall Hung Toilet",
    slug: "matte-black-wall-hung-toilet",
    sku: "SAN-MB-002",
    description: "Modern rimless wall-hung toilet in a sleek matte black finish.",
    brand: "MERIDIANI",
    price: 450,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    isActive: true,
    category: dummyCategories[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p3",
    name: "Brushed Brass Rain Shower",
    slug: "brushed-brass-rain-shower",
    sku: "FIT-BB-003",
    description: "Luxurious 12-inch rain shower head in brushed brass.",
    brand: "FIAM",
    price: 280,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80",
    isActive: true,
    category: dummyCategories[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p4",
    name: "Terrazzo Hexagon Tile",
    slug: "terrazzo-hexagon-tile",
    sku: "TILE-TH-004",
    description: "Trendy hexagon terrazzo tiles for a playful yet elegant bathroom floor.",
    brand: "DIANI",
    price: 85,
    stock: 1200,
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    isActive: true,
    category: dummyCategories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p5",
    name: "Freestanding Acrylic Bathtub",
    slug: "freestanding-acrylic-bathtub",
    sku: "SAN-FA-005",
    description: "Minimalist freestanding acrylic bathtub in gloss white.",
    brand: "MOLTENI&C",
    price: 1200,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    isActive: true,
    category: dummyCategories[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p6",
    name: "Chrome Basin Mixer",
    slug: "chrome-basin-mixer",
    sku: "FIT-CB-006",
    description: "High-quality chrome basin mixer tap with smooth operation.",
    brand: "RIMADESIO",
    price: 110,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    isActive: true,
    category: dummyCategories[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p7",
    name: "Wood Effect Porcelain Tile",
    slug: "wood-effect-porcelain-tile",
    sku: "TILE-WE-007",
    description: "Durable porcelain tile that mimics the warm look of natural oak wood.",
    brand: "SANGIACOMO",
    price: 55,
    stock: 800,
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    isActive: true,
    category: dummyCategories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p8",
    name: "Large Format Concrete Tile",
    slug: "large-format-concrete-tile",
    sku: "TILE-LC-008",
    description: "Industrial style large format concrete-look porcelain tiles.",
    brand: "MODULNOVA",
    price: 95,
    stock: 350,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    isActive: true,
    category: dummyCategories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Fetch a paginated list of products based on filters.
 */
export async function getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : "/products";
  
  try {
    return await fetchApi<PaginatedResponse<Product>>(endpoint);
  } catch (error) {
    // Return dummy data on failure
    let filtered = [...dummyProducts];
    
    if (filters?.category) {
      filtered = filtered.filter(p => p.category.slug === filters.category);
    }
    if (filters?.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    if (filters?.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    }
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<{ data: Product } | null> {
  try {
    return await fetchApi<{ data: Product }>(`/products/${slug}`);
  } catch (error) {
    const product = dummyProducts.find(p => p.slug === slug);
    return product ? { data: product } : null;
  }
}

/**
 * Fetch all categories with product counts.
 */
export async function getCategories(): Promise<{ data: Category[] }> {
  try {
    return await fetchApi<{ data: Category[] }>("/categories");
  } catch (error) {
    return { data: dummyCategories };
  }
}
