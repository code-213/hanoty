import bcrypt from "bcrypt";

export class Password {
  private readonly value: string;

  private constructor(hashedPassword: string) {
    this.value = hashedPassword;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return new Password(hashedPassword);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
