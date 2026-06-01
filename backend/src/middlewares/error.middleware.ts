import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Log unexpected errors
  if (!(err instanceof AppError) && !(err instanceof ZodError)) {
    console.error('Unhandled Error:', err);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma Unique Constraint Error (e.g. Email exists)
  if ((err as { code?: string }).code === 'P2002') {
    const fields = (err as { meta?: { target?: string[] } }).meta?.target || [];
    res.status(409).json({
      status: 'error',
      message: `A record with this ${fields.join(', ')} already exists`,
    });
    return;
  }

  // Custom Application Error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // General fallback
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    status: 'error',
    message: isDev ? err.message : 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};
