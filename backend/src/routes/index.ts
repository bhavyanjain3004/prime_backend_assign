import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';

const router = Router();

// Sub-routes registration
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
