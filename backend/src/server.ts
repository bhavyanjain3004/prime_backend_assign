import dotenv from 'dotenv';
// Load environment variables before importing other files
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with options
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Swagger Documentation Configuration
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable Task Manager API',
      version: '1.0.0',
      description: 'Complete Backend REST API with JWT Auth, Role-Based Access Control, Redis Caching, and Postgres Schema validation.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: 'V1 Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Document paths from both source TS files and built JS files
  apis: ['./src/routes/*.ts', './dist/routes/*.js', './backend/src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes injection
app.use('/api/v1', apiRouter);

// Fallback for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

// Boot server
app.listen(PORT, () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
  console.log(`📘 API documentation available at http://localhost:${PORT}/api-docs`);
});
