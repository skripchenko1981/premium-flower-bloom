import type { IOrderService } from "@/core/domain/services";
import type { IOrderRepository } from "@/core/domain/repositories";
import type { Order } from "@/core/domain/entities";

export class OrderService implements IOrderService {
  constructor(private readonly orderRepo: IOrderRepository) {}

  getOrders(): Order[] {
    return this.orderRepo.getAll();
  }

  createOrder(order: Omit<Order, "_id" | "createdAt">): string {
    return this.orderRepo.create(order);
  }

  updateOrderStatus(orderId: string, status: Order["status"]): void {
    this.orderRepo.updateStatus(orderId, status);
  }
}
