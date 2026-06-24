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

// ─── Product Service ───────────────────────────────────────────────────────

export interface IProductService {
  getProducts(filter?: ProductFilter): Product[] | Promise<Product[]>;
  getProductBySlug(slug: string): Product | null | Promise<Product | null>;
  getProductById(id: string): Product | null | Promise<Product | null>;
  getFeaturedProducts(limit?: number): Product[] | Promise<Product[]>;
  getPopularProducts(limit?: number): Product[] | Promise<Product[]>;
  getCategoryName(categorySlug: string): string;
}

// ─── Category Service ──────────────────────────────────────────────────────

import type { Category as CategoryEntity } from "./entities";

export interface ICategoryService {
  getAll(): Category[] | Promise<Category[]>;
  getBySlug(slug: string): Category | null | Promise<Category | null>;
  getCategoriesWithAll(): (Category & { isAll?: boolean })[];
}

export interface Category extends CategoryEntity {}
export interface CategoryWithAll extends Category {
  isAll?: boolean;
}

// ─── Cart Service ──────────────────────────────────────────────────────────

export interface ICartService {
  getItems(): CartItem[] | Promise<CartItem[]>;
  addItem(item: Omit<CartItem, "_id">): string | Promise<string>;
  updateQuantity(cartItemId: string, quantity: number): void | Promise<void>;
  removeItem(cartItemId: string): void | Promise<void>;
  clearCart(): void | Promise<void>;
  getSubtotal(): number | Promise<number>;
  getItemCount(): number | Promise<number>;
}

// ─── Order Service ─────────────────────────────────────────────────────────

export interface IOrderService {
  getOrders(): Order[] | Promise<Order[]>;
  createOrder(order: Omit<Order, "_id" | "createdAt">): string | Promise<string>;
  updateOrderStatus(orderId: string, status: Order["status"]): void | Promise<void>;
}

// ─── Review Service ────────────────────────────────────────────────────────

export interface IReviewService {
  getByProduct(productId: string): Review[] | Promise<Review[]>;
  addReview(
    productId: string,
    rating: number,
    text: string,
    userName?: string,
  ): string | Promise<string>;
}

// ─── User Service ──────────────────────────────────────────────────────────

export interface IUserService {
  getCurrentUser(): UserProfile | null | Promise<UserProfile | null>;
  updateProfile(data: Partial<Pick<UserProfile, "name" | "phone" | "address">>): void | Promise<void>;
}

// ─── Promocode Service ─────────────────────────────────────────────────────

export interface IPromocodeService {
  check(code: string): Pick<Promocode, "code" | "discount"> | null | Promise<Pick<Promocode, "code" | "discount"> | null>;
  apply(code: string): Pick<Promocode, "code" | "discount"> | Promise<Pick<Promocode, "code" | "discount">>;
}

// ─── Contact Service ───────────────────────────────────────────────────────

export interface IContactService {
  submit(data: Pick<ContactMessage, "name" | "email" | "phone" | "message">): void | Promise<void>;
  getMessages(): ContactMessage[] | Promise<ContactMessage[]>;
}
