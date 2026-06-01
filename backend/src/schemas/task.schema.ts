import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).min(1, 'Title cannot be empty').max(100, 'Title must not exceed 100 characters'),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    status: z.nativeEnum(TaskStatus, {
      errorMap: () => ({ message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' }),
    }).optional(),
    priority: z.nativeEnum(TaskPriority, {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    }).optional(),
    dueDate: z.preprocess(
      (val) => (val === '' || val === undefined ? null : val),
      z.coerce.date().nullable().optional()
    ),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(100, 'Title must not exceed 100 characters').optional(),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.preprocess(
      (val) => (val === '' || val === undefined ? null : val),
      z.coerce.date().nullable().optional()
    ),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
});

export const queryTaskSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().int().min(1).max(100).default(10)),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    search: z.string().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTaskInput = z.infer<typeof queryTaskSchema>;
