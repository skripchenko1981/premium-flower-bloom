import type {
  Product,
  ProductFilter,
  Category,
  CartItem,
  Order,
  Review,
  UserProfile,
  Promocode,
  ContactMessage,
} from "./entities";

// ─── Product Repository ───────────────────────────────────────────────────

export interface IProductRepository {
  getAll(filter?: ProductFilter): Product[] | Promise<Product[]>;
  getBySlug(slug: string): Product | null | Promise<Product | null>;
  getById(id: string): Product | null | Promise<Product | null>;
  getFeatured(limit?: number): Product[] | Promise<Product[]>;
  getPopular(limit?: number): Product[] | Promise<Product[]>;
  getByCategory(category: string): Product[] | Promise<Product[]>;
}

// ─── Category Repository ───────────────────────────────────────────────────

export interface ICategoryRepository {
  getAll(): Category[] | Promise<Category[]>;
  getBySlug(slug: string): Category | null | Promise<Category | null>;
}

// ─── Cart Repository ───────────────────────────────────────────────────────

export interface ICartRepository {
  getItems(): CartItem[] | Promise<CartItem[]>;
  addItem(item: Omit<CartItem, "_id">): string | Promise<string>;
  updateQuantity(cartItemId: string, quantity: number): void | Promise<void>;
  removeItem(cartItemId: string): void | Promise<void>;
  clear(): void | Promise<void>;
}

// ─── Order Repository ──────────────────────────────────────────────────────

export interface IOrderRepository {
  getAll(): Order[] | Promise<Order[]>;
  getById(id: string): Order | null | Promise<Order | null>;
  create(order: Omit<Order, "_id" | "createdAt"> & { createdAt?: number }): string | Promise<string>;
  updateStatus(orderId: string, status: Order["status"]): void | Promise<void>;
}

// ─── Review Repository ─────────────────────────────────────────────────────

export interface IReviewRepository {
  getByProduct(productId: string): Review[] | Promise<Review[]>;
  add(review: Omit<Review, "_id" | "createdAt"> & { createdAt?: number }): string | Promise<string>;
}

// ─── User/Profile Repository ───────────────────────────────────────────────

export interface IUserRepository {
  getCurrent(): UserProfile | null | Promise<UserProfile | null>;
  update(data: Partial<Pick<UserProfile, "name" | "phone" | "address">>): void | Promise<void>;
}

// ─── Promocode Repository ──────────────────────────────────────────────────

export interface IPromocodeRepository {
  check(code: string): Pick<Promocode, "code" | "discount"> | null | Promise<Pick<Promocode, "code" | "discount"> | null>;
  apply(code: string): Pick<Promocode, "code" | "discount"> | Promise<Pick<Promocode, "code" | "discount">>;
}

// ─── Contact Repository ────────────────────────────────────────────────────

export interface IContactRepository {
  submit(data: Pick<ContactMessage, "name" | "email" | "phone" | "message">): void | Promise<void>;
  getAll(): ContactMessage[] | Promise<ContactMessage[]>;
}
