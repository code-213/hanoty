import { Request, Response, NextFunction } from "express";
import { container } from "../../../../config/container";
import { RegisterUserUseCase } from "../../../application/use-cases/auth/RegisterUser";
import { LoginUserUseCase } from "../../../application/use-cases/auth/LoginUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AuthRequest } from "../middlewares/authMiddleware";
import { NotFoundError } from "../../../../shared/errors/AppError";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerUseCase =
        container.get<RegisterUserUseCase>(RegisterUserUseCase);
      const user = await registerUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: { user },
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginUseCase = container.get<LoginUserUseCase>(LoginUserUseCase);
      const result = await loginUseCase.execute(req.body);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_in: 3600,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRepository = container.get<IUserRepository>("IUserRepository");
      const user = await userRepository.findById(req.user!.userId);

      if (!user) {
        throw new NotFoundError("User");
      }

      res.status(200).json({
        success: true,
        data: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRepository = container.get<IUserRepository>("IUserRepository");
      const user = await userRepository.findById(req.user!.userId);

      if (!user) {
        throw new NotFoundError("User");
      }

      user.updateProfile(req.body.name, req.body.phone, req.body.avatar);
      const updatedUser = await userRepository.update(user);

      res.status(200).json({
        success: true,
        data: updatedUser.toJSON(),
        message: "Profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
