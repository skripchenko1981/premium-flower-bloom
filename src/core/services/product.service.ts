import type { IProductService } from "@/core/domain/services";
import type { IProductRepository, ICategoryRepository } from "@/core/domain/repositories";
import type { Product, ProductFilter } from "@/core/domain/entities";

export class ProductService implements IProductService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  getProducts(filter?: ProductFilter): Product[] {
    return this.productRepo.getAll(filter);
  }

  getProductBySlug(slug: string): Product | null {
    return this.productRepo.getBySlug(slug);
  }

  getProductById(id: string): Product | null {
    return this.productRepo.getById(id);
  }

  getFeaturedProducts(limit?: number): Product[] {
    return this.productRepo.getFeatured(limit);
  }

  getPopularProducts(limit?: number): Product[] {
    return this.productRepo.getPopular(limit);
  }

  getCategoryName(categorySlug: string): string {
    const cat = this.categoryRepo.getBySlug(categorySlug);
    return cat?.name ?? categorySlug;
  }
}
