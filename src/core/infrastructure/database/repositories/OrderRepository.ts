import { injectable } from "inversify";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order, OrderStatus } from "../../../domain/entities/Order";
import { Money } from "../../../domain/value-objects/Money";
import { OrderModel } from "../models/OrderModel";

@injectable()
export class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findByPk(id);
    return orderModel ? this.toDomain(orderModel) : null;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<{ orders: Order[]; total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {
      customerId: userId,
    };

    if (status) {
      where.status = status;
    }

    const { rows, count } = await OrderModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const orders = rows.map((row) => this.toDomain(row));
    return { orders, total: count };
  }

  async findBySellerId(
    sellerId: string,
    page: number,
    limit: number
  ): Promise<{ orders: Order[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await OrderModel.findAndCountAll({
      where: { sellerId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const orders = rows.map((row) => this.toDomain(row));
    return { orders, total: count };
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ orders: Order[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await OrderModel.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const orders = rows.map((row) => this.toDomain(row));
    return { orders, total: count };
  }

  async save(order: Order): Promise<Order> {
    const orderJSON = order.toJSON();
    const orderModel = await OrderModel.create({
      orderNumber: orderJSON.orderNumber,
      customerId: orderJSON.customerId,
      sellerId: orderJSON.sellerId,
      items: orderJSON.items,
      subtotal: orderJSON.subtotal,
      shippingCost: orderJSON.shippingCost,
      tax: orderJSON.tax,
      total: orderJSON.total,
      status: orderJSON.status,
      shippingAddress: orderJSON.shippingAddress,
      paymentMethod: orderJSON.paymentMethod,
      trackingNumber: orderJSON.trackingNumber,
      notes: orderJSON.notes,
    });

    return this.toDomain(orderModel);
  }

  async update(order: Order): Promise<Order> {
    const orderJSON = order.toJSON();
    await OrderModel.update(
      {
        status: orderJSON.status,
        trackingNumber: orderJSON.trackingNumber,
        notes: orderJSON.notes,
      },
      { where: { id: order.id } }
    );
    return order;
  }

  async delete(id: string): Promise<void> {
    await OrderModel.destroy({ where: { id } });
  }

  private toDomain(model: OrderModel): Order {
    return new Order({
      id: model.id,
      orderNumber: model.orderNumber,
      customerId: model.customerId,
      sellerId: model.sellerId,
      items: model.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: new Money(parseFloat(item.price)),
        subtotal: new Money(parseFloat(item.subtotal)),
      })),
      subtotal: new Money(parseFloat(model.subtotal.toString())),
      shippingCost: new Money(parseFloat(model.shippingCost.toString())),
      tax: new Money(parseFloat(model.tax.toString())),
      total: new Money(parseFloat(model.total.toString())),
      status: model.status as OrderStatus,
      shippingAddress: model.shippingAddress,
      paymentMethod: model.paymentMethod,
      trackingNumber: model.trackingNumber,
      notes: model.notes,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
