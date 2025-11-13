import { injectable } from "inversify";
import { Op } from "sequelize";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { UserModel } from "../models/UserModel";

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findByPk(id);
    return userModel ? this.toDomain(userModel) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userModel = await UserModel.findOne({
      where: { email: email.getValue() },
    });
    return userModel ? this.toDomain(userModel) : null;
  }

  async save(user: User): Promise<User> {
    const userModel = await UserModel.create({
      email: user.email.getValue(),
      password: user.password.getValue(),
      name: user.name,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
    });
    return this.toDomain(userModel);
  }

  async update(user: User): Promise<User> {
    await UserModel.update(
      {
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
      { where: { id: user.id } }
    );
    return user;
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await UserModel.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const users = rows.map((row) => this.toDomain(row));
    return { users, total: count };
  }

  async searchUsers(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await UserModel.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const users = rows.map((row) => this.toDomain(row));
    return { users, total: count };
  }

  private toDomain(model: UserModel): User {
    return new User({
      id: model.id,
      email: new Email(model.email),
      password: Password.fromHash(model.password),
      name: model.name,
      role: model.role as UserRole,
      phone: model.phone,
      avatar: model.avatar,
      isVerified: model.isVerified,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
