import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { container } from "../../../../config/container";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { ICardRepository } from "../../../domain/repositories/ICardRepository";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
export class AdminController {
  // Check if user has admin role
  async checkRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user?.role === "admin";

      res.status(200).json({
        success: true,
        data: {
          isAdmin,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRepository = container.get<IUserRepository>("IUserRepository");
      const productRepository =
        container.get<IProductRepository>("IProductRepository");
      const orderRepository =
        container.get<IOrderRepository>("IOrderRepository");

      // Get total counts
      const { total: totalUsers } = await userRepository.findAll(1, 1);
      const { total: totalProducts } = await productRepository.findAll(1, 1);
      const { total: totalOrders } = await orderRepository.findAll(1, 1);

      // Calculate total revenue (simplified - should be from orders)
      const { orders: allOrders } = await orderRepository.findAll(1, 999999);
      const totalRevenue = allOrders.reduce(
        (sum, order) => sum + order.total.getAmount(),
        0
      );

      // Calculate growth percentages (mocked for now - in production, compare with previous period)
      const stats = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        revenueGrowth: 15.5,
        userGrowth: 8.2,
        productGrowth: 12.3,
        orderGrowth: 10.8,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get list of users with pagination and search
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const userRepository = container.get<IUserRepository>("IUserRepository");
      const productRepository =
        container.get<IProductRepository>("IProductRepository");

      let result;
      if (search) {
        result = await userRepository.searchUsers(search, page, limit);
      } else {
        result = await userRepository.findAll(page, limit);
      }

      // Get products count for each user
      const usersWithCounts = await Promise.all(
        result.users.map(async (user) => {
          const { total: productsCount } =
            await productRepository.findBySellerId(user.id!, 1, 1);

          return {
            id: user.id,
            email: user.email.getValue(),
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            productsCount,
            joinedAt: user["props"].createdAt,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          users: usersWithCounts,
          total: result.total,
          page,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get list of cards for management
  async getCards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = (req.query.status as string) || "all";

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      const cards = await cardRepository.findByStatus(status);

      res.status(200).json({
        success: true,
        data: cards.map((card) => card.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  }

  // Flag a card for review
  async flagCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      const card = await cardRepository.findById(id);

      if (!card) {
        throw new NotFoundError("Card");
      }

      card.flag(reason);
      await cardRepository.update(card);

      res.status(200).json({
        success: true,
        message: "Card flagged successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove flag from a card
  async unflagCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      const card = await cardRepository.findById(id);

      if (!card) {
        throw new NotFoundError("Card");
      }

      card.unflag();
      await cardRepository.update(card);

      res.status(200).json({
        success: true,
        message: "Card unflagged successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Soft delete a card
  async deleteCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      const card = await cardRepository.findById(id);

      if (!card) {
        throw new NotFoundError("Card");
      }

      card.softDelete();
      await cardRepository.update(card);

      res.status(200).json({
        success: true,
        message: "Card deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Permanently delete a card
  async permanentDeleteCard(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      await cardRepository.permanentDelete(id);

      res.status(200).json({
        success: true,
        message: "Card permanently deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  // Restore a soft-deleted card
  async restoreCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const cardRepository = container.get<ICardRepository>("ICardRepository");
      const card = await cardRepository.findById(id);

      if (!card) {
        throw new NotFoundError("Card");
      }

      card.restore();
      await cardRepository.update(card);

      res.status(200).json({
        success: true,
        message: "Card restored successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
