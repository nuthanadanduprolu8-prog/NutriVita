import mongoose from 'mongoose';
import { foodsData } from '../data/foodsData.js';
import { vitaminsData } from '../data/vitaminsData.js';
import { symptomsData } from '../data/symptomsData.js';

let isConnected = false;
let isInMemoryFallback = false;

// Fallback in-memory collections pre-seeded with verified data
export const memoryStore = {
  users: [],
  foods: [...foodsData],
  vitamins: [...vitaminsData],
  symptoms: [...symptomsData],
  mealPlans: [],
  assessments: []
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrivita';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Fast failover if no local daemon
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
    
    // Seed database collections if empty
    await seedMongoCollections();
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to MongoDB at ${uri}.`);
    console.info(`[NutriVita] Activating resilient in-memory storage mode for local operation.`);
    isInMemoryFallback = true;
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
  return {
    connected: isConnected,
    isFallback: isInMemoryFallback,
    mode: isConnected ? 'MongoDB (Mongoose)' : 'In-Memory Resilient Store',
    foodCount: isConnected ? 'Synced with Mongo' : memoryStore.foods.length,
    vitaminCount: isConnected ? 'Synced with Mongo' : memoryStore.vitamins.length,
  };
};
