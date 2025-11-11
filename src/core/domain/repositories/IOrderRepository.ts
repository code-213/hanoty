import { Order } from "../entities/Order";

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<{ orders: Order[]; total: number }>;
  findBySellerId(
    sellerId: string,
    page: number,
    limit: number
  ): Promise<{ orders: Order[]; total: number }>;
  save(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}
