export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
  role: "seller" | "customer";
  phone?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}
