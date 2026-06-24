import type { ICartService } from "@/core/domain/services";
import type { ICartRepository } from "@/core/domain/repositories";
import type { CartItem } from "@/core/domain/entities";

export class CartService implements ICartService {
  private cartRepo: ICartRepository;

  constructor(cartRepo: ICartRepository) {
    this.cartRepo = cartRepo;
  }

  getItems(): CartItem[] | Promise<CartItem[]> {
    return this.cartRepo.getItems();
  }

  addItem(item: Omit<CartItem, "_id">): string | Promise<string> {
    return this.cartRepo.addItem(item);
  }

  updateQuantity(cartItemId: string, quantity: number): void | Promise<void> {
    this.cartRepo.updateQuantity(cartItemId, quantity);
  }

  removeItem(cartItemId: string): void | Promise<void> {
    this.cartRepo.removeItem(cartItemId);
  }

  clearCart(): void | Promise<void> {
    this.cartRepo.clear();
  }

  getSubtotal(): number | Promise<number> {
    const items = this.cartRepo.getItems();
    if (items instanceof Promise) {
      return items.then((resolved) => resolved.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount(): number | Promise<number> {
    const items = this.cartRepo.getItems();
    if (items instanceof Promise) {
      return items.then((resolved) => resolved.length);
    }
    return items.length;
  }
}
