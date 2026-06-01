import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_fallback';

interface TokenPayload {
  userId: string;
  role: Role;
}

/**
 * Protect routes by verifying the Authorization header JWT token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch {
      throw new UnauthorizedError('Authentication token is invalid or has expired');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict access to specific roles (e.g., ADMIN only)
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
