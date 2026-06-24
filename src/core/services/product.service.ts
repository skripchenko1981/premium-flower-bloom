import type { IProductService } from "@/core/domain/services";
import type { IProductRepository, ICategoryRepository } from "@/core/domain/repositories";
import type { Product, ProductFilter } from "@/core/domain/entities";

export class ProductService implements IProductService {
  private productRepo: IProductRepository;
  private categoryRepo: ICategoryRepository;

  constructor(
    productRepo: IProductRepository,
    categoryRepo: ICategoryRepository,
  ) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  getProducts(filter?: ProductFilter): Product[] | Promise<Product[]> {
    return this.productRepo.getAll(filter);
  }

  getProductBySlug(slug: string): Product | null | Promise<Product | null> {
    return this.productRepo.getBySlug(slug);
  }

  getProductById(id: string): Product | null | Promise<Product | null> {
    return this.productRepo.getById(id);
  }

  getFeaturedProducts(limit?: number): Product[] | Promise<Product[]> {
    return this.productRepo.getFeatured(limit);
  }

  getPopularProducts(limit?: number): Product[] | Promise<Product[]> {
    return this.productRepo.getPopular(limit);
  }

  getCategoryName(categorySlug: string): string | Promise<string> {
    const cat = this.categoryRepo.getBySlug(categorySlug);
    if (cat instanceof Promise) {
      return cat.then((resolved) => resolved?.name ?? categorySlug);
    }
    return cat?.name ?? categorySlug;
  }
}
