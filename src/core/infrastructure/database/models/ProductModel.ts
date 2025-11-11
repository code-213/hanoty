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

  @Column(DataType.UUID)
  sellerId!: string;

  @Column(DataType.JSON)
  images!: string[];

  @Default("active")
  @Column(DataType.ENUM("active", "inactive", "deleted"))
  status!: string;
}
