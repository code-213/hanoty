import "reflect-metadata";
import { Container } from "inversify";
import { IUserRepository } from "../core/domain/repositories/IUserRepository";
import { IProductRepository } from "../core/domain/repositories/IProductRepository";
import { UserRepository } from "../core/infrastructure/database/repositories/UserRepository";
import { ProductRepository } from "../core/infrastructure/database/repositories/ProductRepository";
import { RegisterUserUseCase } from "../core/application/use-cases/auth/RegisterUser";
import { LoginUserUseCase } from "../core/application/use-cases/auth/LoginUser";
import { CreateProductUseCase } from "../core/application/use-cases/products/CreateProduct";
import { UpdateProductUseCase } from "../core/application/use-cases/products/UpdateProduct";

const container = new Container();

// Repositories
container
  .bind<IUserRepository>("IUserRepository")
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IProductRepository>("IProductRepository")
  .to(ProductRepository)
  .inSingletonScope();

// Use Cases
container.bind<RegisterUserUseCase>(RegisterUserUseCase).toSelf();
container.bind<LoginUserUseCase>(LoginUserUseCase).toSelf();
container.bind<CreateProductUseCase>(CreateProductUseCase).toSelf();
container.bind<UpdateProductUseCase>(UpdateProductUseCase).toSelf();

export { container };
