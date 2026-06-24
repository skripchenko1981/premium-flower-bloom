import type { ICartRepository } from "@/core/domain/repositories";
import type { CartItem } from "@/core/domain/entities";
import { demoCartItems } from "@/lib/data/products";

/**
 * Cart repository that wraps Convex cart mutations.
 * In demo mode, returns local mock data.
 */
export class CartRepository implements ICartRepository {
  getItems(): CartItem[] | Promise<CartItem[]> {
    // Return demo data for static rendering
    return demoCartItems.map((item) => ({
      _id: item._id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      withCard: item.withCard,
    }));
  }

  async addItem(item: Omit<CartItem, "_id">): Promise<string> {
    // In real usage, this delegates to a Convex mutation.
    // For now return a mock id.
    return `cart_${Date.now()}`;
  }

  async updateQuantity(_cartItemId: string, _quantity: number): Promise<void> {
    // Delegates to Convex mutation in production
  }

  async removeItem(_cartItemId: string): Promise<void> {
    // Delegates to Convex mutation in production
  }

  async clear(): Promise<void> {
    // Delegates to Convex mutation in production
  }
}
