import { UserRole as PrismaUserRole } from '@prisma/client';

// Re-export Prisma enums to avoid conflicts
export { PrismaUserRole as UserRole };

export interface User {
  id: string;
  email: string;
  name: string;
  role: PrismaUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  role?: PrismaUserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password'>;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}