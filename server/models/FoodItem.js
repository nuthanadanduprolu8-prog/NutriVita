import mongoose from 'mongoose';
import { memoryStore, getDBStatus } from '../config/db.js';

const foodItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teluguName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains_millets', 'pulses_legumes', 'dairy', 'nuts_seeds', 'eggs_poultry_fish', 'snack', 'snacks'],
    required: true,
    index: true,
  },
  servingSize: {
    type: String,
    default: '100g',
  },
  calories: {
    type: Number,
    required: true,
  },
  macronutrients: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  vitamins: {
    vitaminA: { type: Number, default: 0 },
    vitaminB1: { type: Number, default: 0 },
    vitaminB2: { type: Number, default: 0 },
    vitaminB3: { type: Number, default: 0 },
    vitaminB6: { type: Number, default: 0 },
    vitaminB9: { type: Number, default: 0 },
    vitaminB12: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    vitaminD: { type: Number, default: 0 },
    vitaminE: { type: Number, default: 0 },
    vitaminK: { type: Number, default: 0 },
  },
  minerals: {
    iron: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
  },
  imageUrl: {
    type: String,
    required: true,
  },
  descriptionEn: { type: String },
  descriptionTe: { type: String },
  benefitsEn: [{ type: String }],
  benefitsTe: [{ type: String }],
  tags: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodItemModel = mongoose.models.FoodItem || mongoose.model('FoodItem', foodItemSchema);

// Unified Food Repository
export const FoodRepository = {
  async findAll({ search, category, sort, richIn, limit = 50, page = 1 } = {}) {
    const status = getDBStatus();
    
    // Prune any legacy test artifacts or mint chutney entries from memoryStore
    memoryStore.foods = memoryStore.foods.filter(f => !f.name.toLowerCase().includes('fresh mint chutney') && !f.id.startsWith('test_mint_'));

    // Fallback store handling (also works when Mongoose is offline)
    let foods = [...memoryStore.foods];

    // 1. Category Filter
    if (category && category !== 'all') {
      foods = foods.filter(f => f.category === category);
    }

    // 2. Search Filter (matches English name, Telugu name, or tags)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      foods = foods.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.teluguName && f.teluguName.toLowerCase().includes(q)) ||
        (f.descriptionEn && f.descriptionEn.toLowerCase().includes(q)) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 3. Rich In Nutrient Filter
    if (richIn) {
      if (richIn === 'iron') foods = foods.filter(f => f.minerals?.iron >= 2.0);
      else if (richIn === 'calcium') foods = foods.filter(f => f.minerals?.calcium >= 100);
      else if (richIn === 'vitamin_c') foods = foods.filter(f => f.vitamins?.vitaminC >= 25);
      else if (richIn === 'vitamin_a') foods = foods.filter(f => f.vitamins?.vitaminA >= 100);
      else if (richIn === 'vitamin_d') foods = foods.filter(f => f.vitamins?.vitaminD > 0);
      else if (richIn === 'b12') foods = foods.filter(f => f.vitamins?.vitaminB12 > 0.3);
      else if (richIn === 'folate') foods = foods.filter(f => f.vitamins?.vitaminB9 >= 50);
      else if (richIn === 'protein') foods = foods.filter(f => f.macronutrients?.protein >= 10);
    }

    // 4. Sorting
    if (sort) {
      if (sort === 'calories_asc') foods.sort((a, b) => a.calories - b.calories);
      else if (sort === 'calories_desc') foods.sort((a, b) => b.calories - a.calories);
      else if (sort === 'protein_desc') foods.sort((a, b) => (b.macronutrients?.protein || 0) - (a.macronutrients?.protein || 0));
      else if (sort === 'iron_desc') foods.sort((a, b) => (b.minerals?.iron || 0) - (a.minerals?.iron || 0));
      else if (sort === 'calcium_desc') foods.sort((a, b) => (b.minerals?.calcium || 0) - (a.minerals?.calcium || 0));
      else if (sort === 'vitaminc_desc') foods.sort((a, b) => (b.vitamins?.vitaminC || 0) - (a.vitamins?.vitaminC || 0));
      else if (sort === 'name_asc') foods.sort((a, b) => a.name.localeCompare(b.name));
    }

    const total = foods.length;
    const startIndex = (page - 1) * limit;
    const paginated = foods.slice(startIndex, startIndex + limit);

    return {
      foods: paginated,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  },

  async findById(id) {
    const food = memoryStore.foods.find(f => f.id === id || f._id === id);
    return food || null;
  },

  async getCategories() {
    // Prune any legacy test artifacts
    memoryStore.foods = memoryStore.foods.filter(f => !f.name.toLowerCase().includes('fresh mint chutney') && !f.id.startsWith('test_mint_'));
    const categoriesMap = {};
    memoryStore.foods.forEach(f => {
      categoriesMap[f.category] = (categoriesMap[f.category] || 0) + 1;
    });
    return categoriesMap;
  },

  async create(newFood) {
    const food = {
      ...newFood,
      _id: 'food_' + Date.now(),
      createdAt: new Date(),
    };
    memoryStore.foods.push(food);
    return food;
  },

  async deleteById(id) {
    const status = getDBStatus();
    if (status.connected && FoodItemModel) {
      try {
        await FoodItemModel.deleteOne({ id });
      } catch (e) {
        // ignore
      }
    }
    const idx = memoryStore.foods.findIndex(f => f.id === id || f._id === id);
    if (idx !== -1) {
      const deleted = memoryStore.foods.splice(idx, 1)[0];
      return deleted;
    }
    return null;
  }
};

export default FoodItemModel;
