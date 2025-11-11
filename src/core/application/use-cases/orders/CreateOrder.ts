import { injectable, inject } from "inversify";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Order, OrderStatus, OrderItem } from "../../../domain/entities/Order";
import { Money } from "../../../domain/value-objects/Money";
import { CreateOrderDTO } from "../../dtos/OrderDTO";
import {
  ValidationError,
  NotFoundError,
} from "../../../../shared/errors/AppError";

@injectable()
export class CreateOrderUseCase {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
    @inject("IProductRepository") private productRepository: IProductRepository
  ) {}

  async execute(dto: CreateOrderDTO, customerId: string): Promise<Order> {
    // Validate and fetch products
    const orderItems: OrderItem[] = [];
    let subtotal = new Money(0);
    let sellerId = "";

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new NotFoundError(`Product ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for product ${product.name}`
        );
      }

      if (!sellerId) {
        sellerId = product["props"].sellerId;
      }

      const itemPrice = product.price;
      const itemSubtotal = itemPrice.multiply(item.quantity);

      orderItems.push({
        productId: product.id!,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      });

      subtotal = subtotal.add(itemSubtotal);

      // Update product stock
      product.updateStock(-item.quantity);
      await this.productRepository.update(product);
    }

    // Calculate totals
    const shippingCost = new Money(20.0); // Fixed shipping for now
    const tax = subtotal.multiply(0.05); // 5% tax
    const total = subtotal.add(shippingCost).add(tax);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create order
    const order = new Order({
      orderNumber,
      customerId,
      sellerId,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      status: OrderStatus.PENDING,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
    });

    return await this.orderRepository.save(order);
  }
}
