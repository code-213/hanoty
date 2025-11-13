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

@Table({ tableName: "cards", timestamps: true })
export class CardModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  title!: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId!: string;

  @Default("active")
  @Column(DataType.ENUM("active", "flagged", "deleted"))
  status!: string;

  @Default(0)
  @Column(DataType.INTEGER)
  views!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  clicks!: number;

  @Column(DataType.TEXT)
  flagReason?: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;
}
