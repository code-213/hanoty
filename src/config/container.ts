import "reflect-metadata";
import { Container } from "inversify";
import { IUserRepository } from "../core/domain/repositories/IUserRepository";
import { IProductRepository } from "../core/domain/repositories/IProductRepository";
import { IOrderRepository } from "../core/domain/repositories/IOrderRepository";
import { ICardRepository } from "../core/domain/repositories/ICardRepository";
import { UserRepository } from "../core/infrastructure/database/repositories/UserRepository";
import { ProductRepository } from "../core/infrastructure/database/repositories/ProductRepository";
import { OrderRepository } from "../core/infrastructure/database/repositories/OrderRepository";
import { CardRepository } from "../core/infrastructure/database/repositories/CardRepository";
import { RegisterUserUseCase } from "../core/application/use-cases/auth/RegisterUser";
import { LoginUserUseCase } from "../core/application/use-cases/auth/LoginUser";
import { RefreshTokenUseCase } from "../core/application/use-cases/auth/RefreshToken";
import { CreateProductUseCase } from "../core/application/use-cases/products/CreateProduct";
import { UpdateProductUseCase } from "../core/application/use-cases/products/UpdateProduct";
import { CreateOrderUseCase } from "../core/application/use-cases/orders/CreateOrder";
import { UpdateOrderStatusUseCase } from "../core/application/use-cases/orders/UpdateOrderStatus";

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
container
  .bind<IOrderRepository>("IOrderRepository")
  .to(OrderRepository)
  .inSingletonScope();
container
  .bind<ICardRepository>("ICardRepository")
  .to(CardRepository)
  .inSingletonScope();

// Auth Use Cases
container.bind<RegisterUserUseCase>(RegisterUserUseCase).toSelf();
container.bind<LoginUserUseCase>(LoginUserUseCase).toSelf();
container.bind<RefreshTokenUseCase>(RefreshTokenUseCase).toSelf();

// Product Use Cases
container.bind<CreateProductUseCase>(CreateProductUseCase).toSelf();
container.bind<UpdateProductUseCase>(UpdateProductUseCase).toSelf();

// Order Use Cases
container.bind<CreateOrderUseCase>(CreateOrderUseCase).toSelf();
container.bind<UpdateOrderStatusUseCase>(UpdateOrderStatusUseCase).toSelf();

export { container };
