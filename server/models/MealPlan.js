import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // optional for guest plans
    index: true,
  },
  title: {
    type: String,
    required: true,
    default: 'Personalized Daily Nutrition Plan',
  },
  targetCalories: {
    type: Number,
    required: true,
  },
  dietaryPreference: {
    type: String,
    default: 'vegetarian',
  },
  meals: {
    breakfast: [{
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      portion: { type: String, default: '1 serving' },
      calories: { type: Number, default: 0 },
      imageUrl: { type: String },
    }],
    lunch: [{
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      portion: { type: String, default: '1 serving' },
      calories: { type: Number, default: 0 },
      imageUrl: { type: String },
    }],
    snack: [{
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      portion: { type: String, default: '1 serving' },
      calories: { type: Number, default: 0 },
      imageUrl: { type: String },
    }],
    dinner: [{
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      portion: { type: String, default: '1 serving' },
      calories: { type: Number, default: 0 },
      imageUrl: { type: String },
    }],
  },
  totalNutrients: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    vitaminA: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MealPlanModel = mongoose.models.MealPlan || mongoose.model('MealPlan', mealPlanSchema);

export default MealPlanModel;
