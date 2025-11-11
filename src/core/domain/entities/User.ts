import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

export enum UserRole {
  CUSTOMER = "customer",
  SELLER = "seller",
  ADMIN = "admin",
}

export interface UserProps {
  id?: string;
  email: Email;
  password: Password;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  updateProfile(name: string, phone?: string, avatar?: string): void {
    this.props.name = name;
    this.props.phone = phone;
    this.props.avatar = avatar;
    this.props.updatedAt = new Date();
  }

  verify(): void {
    this.props.isVerified = true;
    this.props.updatedAt = new Date();
  }

  async changePassword(newPassword: Password): Promise<void> {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      email: this.props.email.getValue(),
      name: this.props.name,
      role: this.props.role,
      phone: this.props.phone,
      avatar: this.props.avatar,
      isVerified: this.props.isVerified,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
