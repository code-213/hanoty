import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../config/jwt";

export class AuthService {
  static generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, jwtConfig.accessTokenSecret, {
      expiresIn: jwtConfig.accessTokenExpiry,
    });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, jwtConfig.refreshTokenSecret, {
      expiresIn: jwtConfig.refreshTokenExpiry,
    });
  }

  static verifyAccessToken(token: string): any {
    return jwt.verify(token, jwtConfig.accessTokenSecret);
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, jwtConfig.refreshTokenSecret);
  }
}
