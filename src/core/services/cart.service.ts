import type { ICartService } from "@/core/domain/services";
import type { ICartRepository } from "@/core/domain/repositories";
import type { CartItem } from "@/core/domain/entities";

export class CartService implements ICartService {
  constructor(private readonly cartRepo: ICartRepository) {}

  getItems(): CartItem[] {
    return this.cartRepo.getItems();
  }

  addItem(item: Omit<CartItem, "_id">): string {
    return this.cartRepo.addItem(item);
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    this.cartRepo.updateQuantity(cartItemId, quantity);
  }

  removeItem(cartItemId: string): void {
    this.cartRepo.removeItem(cartItemId);
  }

  clearCart(): void {
    this.cartRepo.clear();
  }

  getSubtotal(): number {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.getItems().length;
  }
}
