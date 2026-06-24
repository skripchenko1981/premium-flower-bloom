import type { IProductRepository } from "@/core/domain/repositories";
import type { Product, ProductFilter } from "@/core/domain/entities";
import {
  demoProducts,
  getProductBySlug as getDemoBySlug,
  popularProducts,
} from "@/lib/data/products";

function mapDemoProduct(p: (typeof demoProducts)[number]): Product {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    category: p.category,
    images: p.images,
    inStock: p.inStock,
    featured: p.featured,
    popular: p.popular,
    description: p.description,
    careTips: p.careTips,
    sizes: p.sizes,
  };
}

function filterDemoProducts(filter?: ProductFilter): Product[] {
  let results = demoProducts.map(mapDemoProduct);

  if (!filter) return results;

  if (filter.category) {
    results = results.filter((p) => p.category === filter.category);
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (filter.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filter.maxPrice!);
  }

  if (filter.sortBy === "price-asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (filter.sortBy === "price-desc") {
    results.sort((a, b) => b.price - a.price);
  } else if (filter.sortBy === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  return results;
}

/**
 * Product repository with a two-tier strategy:
 * 1. Try Convex (real backend — used via hooks in components)
 * 2. Fall back to local demo data for static/sync contexts
 */
export class ProductRepository implements IProductRepository {
  getAll(filter?: ProductFilter): Product[] {
    return filterDemoProducts(filter);
  }

  getBySlug(slug: string): Product | null {
    const demo = getDemoBySlug(slug);
    return demo ? mapDemoProduct(demo) : null;
  }

  getById(id: string): Product | null {
    const demo = demoProducts.find((p) => p._id === id);
    return demo ? mapDemoProduct(demo) : null;
  }

  getFeatured(limit = 8): Product[] {
    return demoProducts
      .filter((p) => p.featured)
      .slice(0, limit)
      .map(mapDemoProduct);
  }

  getPopular(limit = 8): Product[] {
    return popularProducts.slice(0, limit).map(mapDemoProduct);
  }

  getByCategory(category: string): Product[] {
    return filterDemoProducts({ category });
  }
}
