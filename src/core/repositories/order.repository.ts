import type { IOrderRepository } from "@/core/domain/repositories";
import type { Order } from "@/core/domain/entities";

/**
 * Order repository — delegates to Convex mutations/queries.
 * Static fallback returns empty arrays.
 */
export class OrderRepository implements IOrderRepository {
  getAll(): Order[] | Promise<Order[]> {
    return [];
  }

  getById(_id: string): Order | null | Promise<Order | null> {
    return null;
  }

  async create(_order: Omit<Order, "_id" | "createdAt"> & { createdAt?: number }): Promise<string> {
    // In production, delegates to Convex mutation
    return `order_${Date.now()}`;
  }

  async updateStatus(_orderId: string, _status: Order["status"]): Promise<void> {
    // Delegates to Convex mutation
  }
}
