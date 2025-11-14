import jwt from 'jsonwebtoken';
import { User, UserRole } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// JWT payload interface
interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  // Use type assertion for options to fix TypeScript issues
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRE as unknown as jwt.SignOptions['expiresIn'],
    issuer: 'crm-api'
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};