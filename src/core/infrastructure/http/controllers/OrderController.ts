import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { container } from "../../../../config/container";
import { CreateOrderUseCase } from "../../../application/use-cases/orders/CreateOrder";
import { UpdateOrderStatusUseCase } from "../../../application/use-cases/orders/UpdateOrderStatus";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class OrderController {
  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;

      const orderRepository =
        container.get<IOrderRepository>("IOrderRepository");
      const { orders, total } = await orderRepository.findByUserId(
        req.user!.userId,
        page,
        limit,
        status
      );

      res.status(200).json({
        success: true,
        data: {
          orders: orders.map((o) => o.toJSON()),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderRepository =
        container.get<IOrderRepository>("IOrderRepository");
      const order = await orderRepository.findById(req.params.id);

      if (!order) {
        throw new NotFoundError("Order");
      }

      // Check ownership
      if (
        order["props"].customerId !== req.user!.userId &&
        order["props"].sellerId !== req.user!.userId
      ) {
        throw new UnauthorizedError("Not authorized to view this order");
      }

      res.status(200).json({
        success: true,
        data: order.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const createOrderUseCase =
        container.get<CreateOrderUseCase>(CreateOrderUseCase);
      const order = await createOrderUseCase.execute(
        req.body,
        req.user!.userId
      );

      res.status(201).json({
        success: true,
        data: order.toJSON(),
        message: "Order created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updateOrderStatusUseCase = container.get<UpdateOrderStatusUseCase>(
        UpdateOrderStatusUseCase
      );
      const order = await updateOrderStatusUseCase.execute(
        req.params.id,
        req.body.status,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: order.toJSON(),
        message: "Order status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
