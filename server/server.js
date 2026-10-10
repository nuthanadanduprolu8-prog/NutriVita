import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import vitaminRoutes from './routes/vitaminRoutes.js';
import scannerRoutes from './routes/scannerRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';
import bodyAnalyzerRoutes from './routes/bodyAnalyzerRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - supports server/.env, root .env, and relative __dirname
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Lightweight)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'NutriVita API',
    status: 'running'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'healthy',
    application: 'NutriVita API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/vitamins', vitaminRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/body-analyzer', bodyAnalyzerRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌿 NutriVita Backend Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🥦 Foods API: http://localhost:${PORT}/api/foods`);
  console.log(`💊 Vitamins API: http://localhost:${PORT}/api/vitamins`);
  console.log(`📷 Scanner API: http://localhost:${PORT}/api/scanner`);
  console.log(`🍽️ Meals API: http://localhost:${PORT}/api/meals`);
  console.log(`✨ VitaMate AI API: http://localhost:${PORT}/api/ai`);
  console.log(`🩺 Symptoms API: http://localhost:${PORT}/api/symptoms`);
});

export default app;
