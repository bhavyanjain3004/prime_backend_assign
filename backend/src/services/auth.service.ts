import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db';
import { BadRequestError, ConflictError, UnauthorizedError } from '../utils/errors';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_fallback';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_fallback';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserResponse;
}

export class AuthService {
  /**
   * Register a new user
   */
  public static async register(data: {
    email: string;
    password?: string;
    name?: string;
    role?: Role;
  }): Promise<AuthResponse> {
    const { email, password, name, role } = data;

    if (!password) {
      throw new BadRequestError('Password is required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role || Role.USER,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  /**
   * Log in an existing user
   */
  public static async login(data: {
    email: string;
    password?: string;
  }): Promise<AuthResponse> {
    const { email, password } = data;

    if (!password) {
      throw new BadRequestError('Password is required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  /**
   * Refresh access token using a refresh token
   */
  public static async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
        role: Role;
      };

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.role);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  /**
   * Helper to generate Access and Refresh JWTs
   */
  private static generateTokens(userId: string, role: Role): AuthTokens {
    const accessToken = jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Format user object to exclude password hash
   */
  private static formatUser(user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    createdAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
