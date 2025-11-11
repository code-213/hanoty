import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../../config/jwt";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UnauthorizedError } from "../../../../shared/errors/AppError";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        jwtConfig.refreshTokenSecret
      ) as any;

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        jwtConfig.accessTokenSecret,
        { expiresIn: jwtConfig.accessTokenExpiry }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        jwtConfig.refreshTokenSecret,
        { expiresIn: jwtConfig.refreshTokenExpiry }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }
}
