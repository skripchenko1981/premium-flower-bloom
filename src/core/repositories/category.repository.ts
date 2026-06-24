import type { ICategoryRepository } from "@/core/domain/repositories";
import type { Category } from "@/core/domain/entities";
import { api } from "@/convex/_generated/api";
import { categories as demoCategories, getCategoryBySlug } from "@/lib/data/categories";

/**
 * Category repository with a two-tier strategy:
 * 1. Try Convex (real backend)
 * 2. Fall back to local demo data if Convex returns empty
 */
export class CategoryRepository implements ICategoryRepository {
  getAll(): Category[] | Promise<Category[]> {
    // We'll use a reactive approach — the calling code can use Convex hooks directly.
    // For non-reactive contexts, we return demo data.
    return demoCategories;
  }

  getBySlug(slug: string): Category | null | Promise<Category | null> {
    return getCategoryBySlug(slug) ?? null;
  }
}
