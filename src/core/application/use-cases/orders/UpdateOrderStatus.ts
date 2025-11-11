import { injectable, inject } from "inversify";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order, OrderStatus } from "../../../domain/entities/Order";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../../shared/errors/AppError";

@injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository
  ) {}

  async execute(
    orderId: string,
    status: string,
    userId: string
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order");
    }

    // Check if user is the seller
    if (order["props"].sellerId !== userId) {
      throw new UnauthorizedError("Not authorized to update this order");
    }

    // Update status
    order.updateStatus(status as OrderStatus);

    return await this.orderRepository.update(order);
  }
}
