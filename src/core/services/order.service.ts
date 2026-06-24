import type { IOrderService } from "@/core/domain/services";
import type { IOrderRepository } from "@/core/domain/repositories";
import type { Order } from "@/core/domain/entities";

export class OrderService implements IOrderService {
  private orderRepo: IOrderRepository;

  constructor(orderRepo: IOrderRepository) {
    this.orderRepo = orderRepo;
  }

  getOrders(): Order[] | Promise<Order[]> {
    return this.orderRepo.getAll();
  }

  createOrder(order: Omit<Order, "_id" | "createdAt">): string | Promise<string> {
    return this.orderRepo.create(order);
  }

  updateOrderStatus(orderId: string, status: Order["status"]): void | Promise<void> {
    this.orderRepo.updateStatus(orderId, status);
  }
}
