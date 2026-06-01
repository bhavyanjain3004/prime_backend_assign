import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { UnauthorizedError } from '../utils/errors';

export class TaskController {
  /**
   * Create a new task
   */
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      const task = await TaskService.createTask(req.user.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks (paginated and filtered)
   */
  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      // Query params are already parsed/coerced by validate(queryTaskSchema)
      const { page, limit, status, priority, search } = req.query as unknown as {
        page: number;
        limit: number;
        status?: any;
        priority?: any;
        search?: string;
      };

      const result = await TaskService.getTasks(req.user.id, req.user.role, {
        page,
        limit,
        status,
        priority,
        search,
      });

      res.status(200).json({
        status: 'success',
        data: result.tasks,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get task by ID
   */
  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      const task = await TaskService.getTaskById(
        req.params.id,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        status: 'success',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update task by ID
   */
  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      const task = await TaskService.updateTask(
        req.params.id,
        req.user.id,
        req.user.role,
        req.body
      );

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete task by ID
   */
  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      await TaskService.deleteTask(req.params.id, req.user.id, req.user.role);

      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
