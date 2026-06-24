import type { ICategoryService } from "@/core/domain/services";
import type { ICategoryRepository } from "@/core/domain/repositories";
import type { Category } from "@/core/domain/entities";

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  getAll(): Category[] {
    return this.categoryRepo.getAll();
  }

  getBySlug(slug: string): Category | null {
    return this.categoryRepo.getBySlug(slug);
  }

  getCategoriesWithAll(): (Category & { isAll?: boolean })[] {
    return [{ name: "Усі", slug: "", isAll: true } as Category & { isAll?: boolean }, ...this.getAll()];
  }
}
