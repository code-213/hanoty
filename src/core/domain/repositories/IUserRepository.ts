import { User } from "../entities/User";
import { Email } from "../value-objects/Email";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }>;
  searchUsers(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }>;
}
