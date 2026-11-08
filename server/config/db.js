import mongoose from 'mongoose';
import { foodsData } from '../data/foodsData.js';
import { vitaminsData } from '../data/vitaminsData.js';
import { symptomsData } from '../data/symptomsData.js';

let isConnected = false;
let isInMemoryFallback = false;
let isConnecting = false;
let lastConnectionError = null;
let retryTimer = null;

// Fallback in-memory collections pre-seeded with verified data
export const memoryStore = {
  users: [],
  foods: [...foodsData],
  vitamins: [...vitaminsData],
  symptoms: [...symptomsData],
  mealPlans: [],
  assessments: []
};

/**
 * Safely masks MongoDB URI credentials for logging
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/:([^@]+)@/, ':****@');
};

/**
 * Normalizes MongoDB URI, ensuring target database 'nutrivita' is specified
 */
export const normalizeMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') {
    return 'mongodb://127.0.0.1:27017/nutrivita';
  }

  let uri = rawUri.trim().replace(/^["']|["']$/g, '');

  // If this is a MongoDB Atlas SRV URI and lacks a path database name
  if (uri.startsWith('mongodb+srv://') || uri.includes('.mongodb.net')) {
    const atIndex = uri.indexOf('@');
    if (atIndex !== -1) {
      const postAt = uri.substring(atIndex + 1);
      const slashIndex = postAt.indexOf('/');
      if (slashIndex === -1) {
        // e.g. mongodb+srv://user:pass@cluster0.xxx.mongodb.net
        uri += '/nutrivita?retryWrites=true&w=majority';
      } else {
        const afterSlash = postAt.substring(slashIndex + 1);
        if (!afterSlash || afterSlash.startsWith('?')) {
          // e.g. mongodb+srv://user:pass@cluster0.xxx.mongodb.net/ or /?retryWrites=true
          const queryPart = afterSlash.startsWith('?') ? afterSlash : '?retryWrites=true&w=majority';
          uri = uri.substring(0, atIndex + 1 + slashIndex + 1) + 'nutrivita' + queryPart;
        }
      }
    }
  }

  return uri;
};

/**
 * Extracts target host for non-sensitive diagnostics
 */
const getTargetHost = (uri) => {
  try {
    if (!uri) return 'unconfigured';
    if (uri.includes('@')) {
      const hostPart = uri.split('@')[1].split('/')[0].split('?')[0];
      return hostPart;
    }
    return uri.split('://')[1]?.split('/')[0] || 'localhost';
  } catch {
    return 'unknown';
  }
};

/**
 * Categorizes and enriches connection error with clear remediation guidance
 */
const analyzeConnectionError = (err, uri) => {
  const errString = (err?.message || '') + (err?.cause?.message || '') + (err?.stack || '');
  const isAtlas = uri.includes('.mongodb.net') || uri.startsWith('mongodb+srv://');

  if (errString.includes('SSL alert number 80') || errString.includes('tlsv1 alert internal error') || (err?.name === 'MongooseServerSelectionError' && isAtlas)) {
    return {
      category: 'IP_NOT_WHITELISTED',
      message: 'MongoDB Atlas rejected the TLS connection (SSL Alert 80).',
      help: 'Your current IP address is not whitelisted in MongoDB Atlas Network Access. Go to MongoDB Atlas (cloud.mongodb.com) -> Security -> Network Access -> Add IP Address, and allow access (add your current IP or 0.0.0.0/0 for global access/Render).'
    };
  }

  if (errString.includes('bad auth') || errString.includes('authentication failed')) {
    return {
      category: 'AUTH_FAILED',
      message: 'MongoDB Atlas authentication failed.',
      help: 'Verify the database username and password in MONGODB_URI in server/.env (and Render environment variables).'
    };
  }

  if (errString.includes('ENOTFOUND') || errString.includes('querySrv ENOTFOUND')) {
    return {
      category: 'DNS_LOOKUP_FAILED',
      message: 'Could not resolve MongoDB Atlas cluster DNS SRV record.',
      help: 'Check your internet connection and verify the cluster domain name in MONGODB_URI.'
    };
  }

  if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
    return {
      category: 'LOCAL_MONGO_OFFLINE',
      message: 'No local MongoDB service running on 127.0.0.1:27017.',
      help: 'Start your local MongoDB service, or configure your MongoDB Atlas Cluster0 URI in server/.env to use persistent cloud storage.'
    };
  }

  return {
    category: 'CONNECTION_FAILED',
    message: err?.message || 'Unknown MongoDB connection error',
    help: 'Verify network connectivity, credentials, and cluster status.'
  };
};

export const connectDB = async () => {
  if (isConnecting) return isConnected;
  isConnecting = true;

  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrivita';
  const uri = normalizeMongoUri(rawUri);
  const sanitizedTarget = sanitizeMongoUri(uri);
  const targetHost = getTargetHost(uri);

  try {
    mongoose.set('strictQuery', false);

    // Set connection event listeners once
    if (mongoose.connection.listenerCount('connected') === 0) {
      mongoose.connection.on('connected', () => {
        isConnected = true;
        isInMemoryFallback = false;
        lastConnectionError = null;
        if (retryTimer) {
          clearTimeout(retryTimer);
          retryTimer = null;
        }
        console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
      });

      mongoose.connection.on('error', (err) => {
        console.error(`[MongoDB] Connection error event: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.warn(`[MongoDB] Connection disconnected.`);
      });
    }

    console.log(`[MongoDB] Connecting to ${sanitizedTarget}...`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000, // 8-second window for cloud cluster handshakes
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    isInMemoryFallback = false;
    lastConnectionError = null;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    console.log(`✅ [MongoDB Atlas] Connected successfully to database: ${mongoose.connection.name} on ${targetHost}`);
    
    // Seed database collections if empty
    await seedMongoCollections();
    return true;
  } catch (error) {
    isConnected = false;
    isInMemoryFallback = true;
    
    const analysis = analyzeConnectionError(error, uri);
    lastConnectionError = {
      timestamp: new Date().toISOString(),
      category: analysis.category,
      message: analysis.message,
      help: analysis.help,
      rawErrorName: error.name
    };

    console.warn(`\n❌ [MongoDB Connection Failed] Target: ${sanitizedTarget}`);
    console.warn(`   Category: ${analysis.category}`);
    console.warn(`   Details: ${analysis.message}`);
    console.warn(`   Remediation: ${analysis.help}\n`);
    console.warn(`⚠️  [NutriVita Storage Warning] Running in In-Memory Fallback mode.`);
    console.warn(`   User accounts and data will NOT persist across server restarts until MongoDB is connected.\n`);

    // Auto-retry connection every 30 seconds if configured for Atlas
    if (uri.includes('.mongodb.net') || uri.startsWith('mongodb+srv://')) {
      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          retryTimer = null;
          if (!isConnected) {
            console.log(`[MongoDB Auto-Retry] Attempting to reconnect to MongoDB Atlas...`);
            connectDB().catch(() => {});
          }
        }, 30000);
        if (retryTimer.unref) retryTimer.unref();
      }
    }
    return false;
  } finally {
    isConnecting = false;
  }
};

const seedMongoCollections = async () => {
  try {
    const FoodItemModel = mongoose.models.FoodItem;
    const VitaminInfoModel = mongoose.models.VitaminInfo;

    if (FoodItemModel && (await FoodItemModel.countDocuments()) === 0) {
      await FoodItemModel.insertMany(foodsData);
      console.log(`[MongoDB] Seeded ${foodsData.length} food items.`);
    }

    if (VitaminInfoModel && (await VitaminInfoModel.countDocuments()) === 0) {
      await VitaminInfoModel.insertMany(vitaminsData);
      console.log(`[MongoDB] Seeded ${vitaminsData.length} vitamin profiles.`);
    }
  } catch (err) {
    console.warn(`[MongoDB] Seed check notice: ${err.message}`);
  }
};

export const getDBStatus = () => {
  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrivita';
  const uri = normalizeMongoUri(rawUri);

  return {
    connected: isConnected,
    isFallback: isInMemoryFallback,
    mode: isConnected ? 'MongoDB (Mongoose)' : 'In-Memory Resilient Store',
    persistence: isConnected ? 'Persistent (MongoDB)' : 'Temporary (In-Memory RAM)',
    targetHost: getTargetHost(uri),
    databaseName: isConnected ? mongoose.connection.name : (uri.includes('/nutrivita') ? 'nutrivita' : 'unconnected'),
    foodCount: isConnected ? 'Synced with Mongo' : memoryStore.foods.length,
    vitaminCount: isConnected ? 'Synced with Mongo' : memoryStore.vitamins.length,
    lastError: lastConnectionError ? lastConnectionError.message : null,
    errorCategory: lastConnectionError ? lastConnectionError.category : null,
    remediation: lastConnectionError ? lastConnectionError.help : null,
  };
};
