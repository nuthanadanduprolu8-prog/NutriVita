import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
import { VisionAIService } from './services/visionAIService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load standard local and root .env files
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

// 2. Render Cloud Secret Files support (/etc/secrets/ directory)
const renderSecretsDir = '/etc/secrets';
if (fs.existsSync(renderSecretsDir)) {
  try {
    const envFile = path.join(renderSecretsDir, '.env');
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
      console.log('[Startup] Loaded Render secret file: /etc/secrets/.env');
    }

    const secretFiles = fs.readdirSync(renderSecretsDir);
    for (const file of secretFiles) {
      const fullPath = path.join(renderSecretsDir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          dotenv.config({ path: fullPath });
          const upper = file.toUpperCase();
          if (upper.includes('GEMINI') || upper.includes('GOOGLE')) {
            const rawContent = fs.readFileSync(fullPath, 'utf8').trim();
            if (rawContent && !rawContent.includes('\n') && !rawContent.includes('=')) {
              process.env[file] = rawContent;
            }
          }
        }
      } catch {}
    }
  } catch (err) {
    console.warn('[Startup] Notice scanning /etc/secrets:', err.message);
  }
}

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true,
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
  const keyInfo = VisionAIService.getApiKeyInfo();
  
  let secretsFiles = [];
  try {
    if (fs.existsSync('/etc/secrets')) {
      secretsFiles = fs.readdirSync('/etc/secrets');
    }
  } catch {}

  res.status(200).json({
    status: 'healthy',
    application: 'NutriVita API',
    version: '1.0.2',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    visionAi: {
      hasKey: Boolean(keyInfo.key),
      keySource: keyInfo.envVarName || null,
      keyLength: keyInfo.length || 0,
      matchedEnvKeys: Object.keys(process.env).filter(k => 
        k.toUpperCase().includes('GEMINI') || 
        k.toUpperCase().includes('GOOGLE') || 
        k.toUpperCase().includes('VISION')
      ),
      renderSecretsDirExists: fs.existsSync('/etc/secrets'),
      renderSecretsFiles: secretsFiles
    }
  });
});

// Manual database reconnect trigger
app.all('/api/health/reconnect', async (req, res) => {
  await connectDB();
  res.status(200).json({
    message: 'Triggered database connection attempt.',
    database: getDBStatus(),
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

  // Non-blocking vision health probe for Render startup diagnostic logs
  VisionAIService.checkVisionHealth(true)
    .then((health) => {
      if (health.reachable) {
        console.log(`🤖 [Startup] Vision AI Service is ONLINE: ${health.provider} (${health.model}) [Key: ${health.envVarName}]`);
      } else if (health.configured) {
        console.warn(`⚠️ [Startup] Vision AI key detected in ${health.envVarName}, but probe failed: ${health.error}`);
      } else {
        console.warn('ℹ️ [Startup] Vision AI key not configured in environment (GEMINI_API_KEY/GOOGLE_API_KEY). Running in educational rules-based mode.');
      }
    })
    .catch((err) => {
      console.warn('⚠️ [Startup] Vision AI probe notice:', err.message);
    });
});

export default app;
