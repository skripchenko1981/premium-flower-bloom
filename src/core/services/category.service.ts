import type { ICategoryService } from "@/core/domain/services";
import type { ICategoryRepository } from "@/core/domain/repositories";
import type { Category } from "@/core/domain/entities";

export class CategoryService implements ICategoryService {
  private categoryRepo: ICategoryRepository;

  constructor(categoryRepo: ICategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  getAll(): Category[] | Promise<Category[]> {
    return this.categoryRepo.getAll();
  }

  getBySlug(slug: string): Category | null | Promise<Category | null> {
    return this.categoryRepo.getBySlug(slug);
  }

  getCategoriesWithAll(): (Category & { isAll?: boolean })[] | Promise<(Category & { isAll?: boolean })[]> {
    const all = this.getAll();
    if (all instanceof Promise) {
      return all.then((resolved) => [{ name: "Усі", slug: "", isAll: true } as Category & { isAll?: boolean }, ...resolved]);
    }
    return [{ name: "Усі", slug: "", isAll: true } as Category & { isAll?: boolean }, ...all];
  }
}
