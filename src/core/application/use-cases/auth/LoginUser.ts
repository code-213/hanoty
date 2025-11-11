import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../../config/jwt";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Email } from "../../../domain/value-objects/Email";
import { LoginUserDTO, UserResponseDTO } from "../../dtos/UserDTO";
import { UnauthorizedError } from "../../../../shared/errors/AppError";

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(dto: LoginUserDTO): Promise<{
    user: UserResponseDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    const email = new Email(dto.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await user.password.compare(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtConfig.accessTokenSecret,
      { expiresIn: jwtConfig.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtConfig.refreshTokenSecret,
      { expiresIn: jwtConfig.refreshTokenExpiry }
    );

    return {
      user: {
        id: user.id!,
        email: user.email.getValue(),
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        phone: user.phone,
        avatar: user["props"].avatar,
        createdAt: new Date(),
      },
      accessToken,
      refreshToken,
    };
  }
}
