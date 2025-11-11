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

@Table({ tableName: "orders", timestamps: true })
export class OrderModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  orderNumber!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  customerId!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  sellerId!: string;

  @Column(DataType.JSON)
  items!: any[];

  @Column(DataType.DECIMAL(10, 2))
  subtotal!: number;

  @Column(DataType.DECIMAL(10, 2))
  shippingCost!: number;

  @Column(DataType.DECIMAL(10, 2))
  tax!: number;

  @Column(DataType.DECIMAL(10, 2))
  total!: number;

  @Default("pending")
  @Column(
    DataType.ENUM(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled"
    )
  )
  status!: string;

  @Column(DataType.JSON)
  shippingAddress!: any;

  @Column(DataType.STRING)
  paymentMethod!: string;

  @Column(DataType.STRING)
  trackingNumber?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @BelongsTo(() => UserModel, "customerId")
  customer!: UserModel;

  @BelongsTo(() => UserModel, "sellerId")
  seller!: UserModel;
}
