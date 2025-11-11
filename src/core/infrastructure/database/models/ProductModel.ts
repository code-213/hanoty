import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UserModel } from "./UserModel";

@Table({ tableName: "products", timestamps: true })
export class ProductModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DECIMAL(10, 2))
  price!: number;

  @Column(DataType.INTEGER)
  stock!: number;

  @Column(DataType.STRING)
  category!: string;

  @Column(DataType.STRING)
  sku!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  sellerId!: string;

  @Column(DataType.JSON)
  images!: string[];

  @Default("active")
  @Column(DataType.ENUM("active", "inactive", "deleted"))
  status!: string;

  @BelongsTo(() => UserModel)
  seller!: UserModel;
}
