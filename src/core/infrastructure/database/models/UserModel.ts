import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
} from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class UserModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.ENUM("customer", "seller", "admin"))
  role!: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.STRING)
  avatar?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified!: boolean;
}
