import { injectable, inject } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { RegisterUserDTO, UserResponseDTO } from "../../dtos/UserDTO";
import { ValidationError } from "../../../../shared/errors/ValidationError";

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const email = new Email(dto.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
    }

    // Create password
    const password = await Password.create(dto.password);

    // Create user entity
    const user = new User({
      email,
      password,
      name: dto.name,
      role: dto.role as UserRole,
      phone: dto.phone,
      isVerified: false,
    });

    // Save to repository
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id!,
      email: savedUser.email.getValue(),
      name: savedUser.name,
      role: savedUser.role,
      isVerified: savedUser.isVerified,
      phone: savedUser.phone,
      createdAt: new Date(),
    };
  }
}
