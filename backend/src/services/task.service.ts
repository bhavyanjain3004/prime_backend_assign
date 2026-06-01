import { prisma } from '../utils/db';
import { redisService } from './redis.service';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { TaskStatus, TaskPriority, Role, Task } from '@prisma/client';

export interface TaskFilters {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class TaskService {
  /**
   * Create a new task
   */
  public static async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
    }
  ): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });

    // Invalidate task cache
    await this.invalidateCache(userId);

    return task;
  }

  /**
   * Get paginated tasks with filters & Redis caching
   */
  public static async getTasks(
    userId: string,
    role: Role,
    filters: TaskFilters
  ): Promise<PaginatedTasks> {
    const { page, limit, status, priority, search } = filters;
    const skip = (page - 1) * limit;

    // Cache key structure: tasks:{role}:{userId}:{filters}
    const cacheKey = `tasks:${role}:${role === Role.ADMIN ? 'all' : userId}:p${page}:l${limit}:s:${status || 'any'}:pr:${priority || 'any'}:se:${search || 'none'}`;

    // Try reading cache
    const cachedData = await redisService.get<PaginatedTasks>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build Prisma query condition
    const where: {
      userId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    // Standard users see only their own tasks
    if (role !== Role.ADMIN) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute parallel DB query
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const result: PaginatedTasks = {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Store in cache for 5 minutes (300 seconds)
    await redisService.set(cacheKey, result, 300);

    return result;
  }

  /**
   * Get single task by ID with access control
   */
  public static async getTaskById(
    taskId: string,
    userId: string,
    role: Role
  ): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Access check: User must own the task, or be an Admin
    if (role !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    return task;
  }

  /**
   * Update task with access control
   */
  public static async updateTask(
    taskId: string,
    userId: string,
    role: Role,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
    }
  ): Promise<Task> {
    // Check if task exists and check access
    const task = await this.getTaskById(taskId, userId, role);

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    // Invalidate caches
    await this.invalidateCache(userId, task.userId);

    return updatedTask;
  }

  /**
   * Delete task with access control
   */
  public static async deleteTask(
    taskId: string,
    userId: string,
    role: Role
  ): Promise<void> {
    // Check if task exists and check access
    const task = await this.getTaskById(taskId, userId, role);

    await prisma.task.delete({
      where: { id: taskId },
    });

    // Invalidate caches
    await this.invalidateCache(userId, task.userId);
  }

  /**
   * Helper to clear redis cache patterns on modify
   */
  private static async invalidateCache(currentUserId: string, targetUserId?: string): Promise<void> {
    // Clear user cached queries
    await redisService.delPattern(`tasks:*:*`);
  }
}
