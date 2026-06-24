/** Domain entity: Product size option */
export interface ProductSize {
  name: string;
  label?: string;
  price: number;
}

/** Domain entity: Product */
export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  popular?: boolean;
  description: string;
  careTips?: string;
  sizes: ProductSize[];
  tags?: string[];
  createdAt?: number;
}

/** Domain entity: Category */
export interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
  description?: string;
  order?: number;
}

/** Domain entity: Cart item */
export interface CartItem {
  _id: string;
  userId?: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  withCard?: boolean;
}

/** Domain entity: Order */
export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount?: number;
  promocode?: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  deliveryAddress: string;
  deliveryDate?: string;
  deliveryTime?: string;
  cardMessage?: string;
  notes?: string;
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/** Domain entity: Review */
export interface Review {
  _id: string;
  userId?: string;
  productId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: number;
}

/** Domain entity: User / Profile */
export interface UserProfile {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  address?: string;
  role?: "admin" | "user" | "member";
  emailVerificationTime?: number;
}

/** Domain entity: Promocode */
export interface Promocode {
  _id: string;
  code: string;
  discount: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: number;
}

/** Domain entity: Contact message */
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: number;
}

/** Product query filter */
export interface ProductFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "name" | "newest";
}

/** Pagination params */
export interface PaginationParams {
  page: number;
  size: number;
}
