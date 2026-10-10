import { memoryStore, getDBStatus } from '../config/db.js';
import MealPlanModel from '../models/MealPlan.js';
import { FOOD_SYNONYM_MAP } from './scannerController.js';

// @desc    Analyze and balance a custom meal plate
// @route   POST /api/meals/balance
// @access  Public
export const balanceMeal = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { foodId, quantity = 100 }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one food item to evaluate meal balance.',
      });
    }

    const aggregated = {
      totalCalories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      iron: 0,
      calcium: 0,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminB12: 0,
      vitaminB9: 0,
      itemsDetailed: [],
    };

    const categoriesPresent = new Set();

    for (const item of items) {
      const rawId = String(item.foodId || '').toLowerCase().trim();
      const mappedId = FOOD_SYNONYM_MAP[rawId] || rawId;
      const food = memoryStore.foods.find(f => f.id === item.foodId || f._id === item.foodId || f.id === mappedId || (f.id && f.id.toLowerCase() === rawId));
      if (!food) continue;

      const qty = Number(item.quantity) || 100;
      const ratio = qty / 100;

      categoriesPresent.add(food.category);

      const calories = Math.round(food.calories * ratio);
      const protein = Number(((food.macronutrients?.protein || 0) * ratio).toFixed(1));
      const carbs = Number(((food.macronutrients?.carbs || 0) * ratio).toFixed(1));
      const fats = Number(((food.macronutrients?.fats || 0) * ratio).toFixed(1));
      const fiber = Number(((food.macronutrients?.fiber || 0) * ratio).toFixed(1));

      const iron = Number(((food.minerals?.iron || 0) * ratio).toFixed(2));
      const calcium = Math.round((food.minerals?.calcium || 0) * ratio);
      const vitaminA = Math.round((food.vitamins?.vitaminA || 0) * ratio);
      const vitaminC = Number(((food.vitamins?.vitaminC || 0) * ratio).toFixed(1));
      const vitaminD = Math.round((food.vitamins?.vitaminD || 0) * ratio);
      const vitaminB12 = Number(((food.vitamins?.vitaminB12 || 0) * ratio).toFixed(2));
      const vitaminB9 = Math.round((food.vitamins?.vitaminB9 || 0) * ratio);

      aggregated.totalCalories += calories;
      aggregated.protein += protein;
      aggregated.carbs += carbs;
      aggregated.fats += fats;
      aggregated.fiber += fiber;
      aggregated.iron += iron;
      aggregated.calcium += calcium;
      aggregated.vitaminA += vitaminA;
      aggregated.vitaminC += vitaminC;
      aggregated.vitaminD += vitaminD;
      aggregated.vitaminB12 += vitaminB12;
      aggregated.vitaminB9 += vitaminB9;

      aggregated.itemsDetailed.push({
        foodId: food.id,
        name: food.name,
        teluguName: food.teluguName,
        category: food.category,
        quantity: qty,
        calories,
        imageUrl: food.imageUrl,
        protein,
        iron,
        vitaminC,
      });
    }

    // Round aggregated sums
    aggregated.protein = Number(aggregated.protein.toFixed(1));
    aggregated.carbs = Number(aggregated.carbs.toFixed(1));
    aggregated.fats = Number(aggregated.fats.toFixed(1));
    aggregated.fiber = Number(aggregated.fiber.toFixed(1));
    aggregated.iron = Number(aggregated.iron.toFixed(2));
    aggregated.vitaminC = Number(aggregated.vitaminC.toFixed(1));
    aggregated.vitaminB12 = Number(aggregated.vitaminB12.toFixed(2));

    // Balance & Plate Split Evaluation
    const totalMacros = aggregated.protein + aggregated.carbs + aggregated.fats;
    const proteinRatio = totalMacros > 0 ? (aggregated.protein * 4) / (aggregated.totalCalories || 1) : 0;
    const carbRatio = totalMacros > 0 ? (aggregated.carbs * 4) / (aggregated.totalCalories || 1) : 0;
    const fatRatio = totalMacros > 0 ? (aggregated.fats * 9) / (aggregated.totalCalories || 1) : 0;

    let balanceScore = 50;
    const strengths = [];
    const suggestions = [];

    // Check Veggies / Greens presence
    if (categoriesPresent.has('vegetables')) {
      balanceScore += 15;
      strengths.push('Healthy vegetable & fiber foundation present.');
    } else {
      suggestions.push({
        gap: 'Vegetables & Leafy Greens Missing',
        tip: 'Add a serving of spinach, drumstick leaves, or carrots to boost dietary fiber, carotenoids, and mineral density.',
        foodId: 'spinach'
      });
    }

    // Check Protein adequacy
    if (aggregated.protein >= 15) {
      balanceScore += 15;
      strengths.push(`Adequate protein content (${aggregated.protein}g) for muscle support.`);
    } else {
      suggestions.push({
        gap: 'Protein Content Low (< 15g)',
        tip: 'Consider pairing your meal with toor dal, boiled chickpeas, paneer, or whole eggs to achieve sustained satiety.',
        foodId: 'lentils'
      });
    }

    // Check Vitamin C & Iron synergy
    if (aggregated.iron >= 2.0 && aggregated.vitaminC < 20) {
      suggestions.push({
        gap: 'Suboptimal Iron Absorption Synergy',
        tip: 'Your meal contains iron, but low Vitamin C. Add a squeeze of lemon or fresh amla/guava to boost non-heme iron uptake up to 300%!',
        foodId: 'amla'
      });
    } else if (aggregated.iron >= 2.0 && aggregated.vitaminC >= 20) {
      balanceScore += 10;
      strengths.push('Excellent Iron + Vitamin C synergy pairing for hemoglobin synthesis!');
    }

    // Check Calcium
    if (aggregated.calcium >= 150) {
      balanceScore += 10;
      strengths.push(`Good calcium density (${aggregated.calcium}mg) for bone integrity.`);
    } else {
      suggestions.push({
        gap: 'Low Meal Calcium (< 150mg)',
        tip: 'Add a bowl of fresh curd (dahi), ragi porridge, or a spoonful of sesame seeds to meet bone mineral goals.',
        foodId: 'curd'
      });
    }

    balanceScore = Math.min(Math.max(balanceScore, 20), 100);

    const isBalanced = balanceScore >= 70;

    res.status(200).json({
      success: true,
      nutrition: aggregated,
      evaluation: {
        score: balanceScore,
        isBalanced,
        statusText: isBalanced ? 'Well Balanced Plate' : 'Needs Nutritional Adjustments',
        macroSplit: {
          proteinPercent: Math.round(proteinRatio * 100),
          carbsPercent: Math.round(carbRatio * 100),
          fatsPercent: Math.round(fatRatio * 100),
        },
        strengths,
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-generate a personalized balanced 1-day meal plan
// @route   POST /api/meals/generate
// @access  Public
export const generatePlan = async (req, res, next) => {
  try {
    const { dietaryPreference = 'vegetarian', targetCalories = 2000 } = req.body;
    const allFoods = [...memoryStore.foods];

    // Filter eligible foods
    let pool = allFoods;
    if (dietaryPreference === 'vegan') {
      pool = allFoods.filter(f => f.category !== 'dairy' && f.category !== 'eggs_poultry_fish');
    } else if (dietaryPreference === 'vegetarian') {
      pool = allFoods.filter(f => f.category !== 'eggs_poultry_fish');
    }

    const pickFood = (categoryPreference, fallbackCategories = []) => {
      const match = pool.find(f => f.category === categoryPreference);
      if (match) return match;
      for (const cat of fallbackCategories) {
        const fallback = pool.find(f => f.category === cat);
        if (fallback) return fallback;
      }
      return pool[0];
    };

    // Construct balanced daily meals
    const breakfast = [
      { food: pickFood('grains_millets', ['nuts_seeds']), portion: '1 bowl (150g)' },
      { food: pickFood('fruits', ['vegetables']), portion: '1 whole fruit (100g)' },
    ];

    const lunch = [
      { food: pickFood('grains_millets'), portion: '1.5 cups (150g)' },
      { food: pickFood('pulses_legumes', ['dairy']), portion: '1 cup cooked (150g)' },
      { food: pickFood('vegetables'), portion: '1 bowl stir-fry (120g)' },
    ];

    const snack = [
      { food: pickFood('nuts_seeds', ['fruits']), portion: 'Handful (30g)' },
      { food: pickFood('fruits'), portion: '1 piece (100g)' },
    ];

    const dinner = [
      { food: pickFood('grains_millets'), portion: '2 rotis / 1 bowl (120g)' },
      { food: pickFood('pulses_legumes', ['dairy', 'vegetables']), portion: '1 cup (150g)' },
      { food: pickFood('vegetables'), portion: 'Fresh salad (100g)' },
    ];

    const formatMealList = (list) => list.map(item => ({
      foodId: item.food.id,
      name: item.food.name,
      teluguName: item.food.teluguName,
      category: item.food.category,
      portion: item.portion,
      calories: item.food.calories,
      imageUrl: item.food.imageUrl,
      protein: item.food.macronutrients?.protein || 0,
      iron: item.food.minerals?.iron || 0,
      calcium: item.food.minerals?.calcium || 0,
      vitaminC: item.food.vitamins?.vitaminC || 0,
    }));

    const plan = {
      title: `Balanced ${dietaryPreference.replace('_', ' ')} Daily Nutrition Plan`,
      targetCalories: Number(targetCalories),
      dietaryPreference,
      meals: {
        breakfast: formatMealList(breakfast),
        lunch: formatMealList(lunch),
        snack: formatMealList(snack),
        dinner: formatMealList(dinner),
      },
      createdAt: new Date(),
    };

    // Calculate approximate daily total calories
    const allMealItems = [
      ...plan.meals.breakfast,
      ...plan.meals.lunch,
      ...plan.meals.snack,
      ...plan.meals.dinner
    ];

    const totalCals = allMealItems.reduce((acc, item) => acc + item.calories, 0);
    const totalProtein = Number(allMealItems.reduce((acc, item) => acc + item.protein, 0).toFixed(1));
    const totalIron = Number(allMealItems.reduce((acc, item) => acc + item.iron, 0).toFixed(1));
    const totalCalcium = Math.round(allMealItems.reduce((acc, item) => acc + item.calcium, 0));
    const totalVitC = Math.round(allMealItems.reduce((acc, item) => acc + item.vitaminC, 0));

    plan.dailyTotals = {
      calories: totalCals,
      protein: totalProtein,
      iron: totalIron,
      calcium: totalCalcium,
      vitaminC: totalVitC,
    };

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a meal plan
// @route   POST /api/meals/save
// @access  Public / Private
export const saveMealPlan = async (req, res, next) => {
  try {
    const { title, targetCalories, dietaryPreference, meals, dailyTotals } = req.body;
    const userId = req.user ? String(req.user._id || req.user.id) : 'guest_user';

    const newPlan = {
      id: 'plan_' + Date.now(),
      _id: 'plan_' + Date.now(),
      userId,
      title: title || 'Custom Nutrition Plan',
      targetCalories: Number(targetCalories) || 2000,
      dietaryPreference: dietaryPreference || 'vegetarian',
      meals: meals || {},
      dailyTotals: dailyTotals || {},
      createdAt: new Date(),
    };

    memoryStore.mealPlans.push(newPlan);

    res.status(201).json({
      success: true,
      message: 'Meal plan successfully saved to your profile.',
      data: newPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved meal plans
// @route   GET /api/meals/saved
// @access  Public / Private
export const getSavedPlans = async (req, res, next) => {
  try {
    const userId = req.user ? String(req.user._id || req.user.id) : null;
    let plans = [...memoryStore.mealPlans];

    if (userId) {
      // Authenticated users strictly see only their own saved plans
      plans = plans.filter(p => String(p.userId) === userId);
    } else {
      // Guest users without login see guest plans
      plans = plans.filter(p => p.userId === 'guest_user');
    }

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved meal plan
// @route   DELETE /api/meals/saved/:id
// @access  Public / Private
export const deleteMealPlan = async (req, res, next) => {
  try {
    const planId = req.params.id;
    const userId = req.user ? String(req.user._id || req.user.id) : null;
    const index = memoryStore.mealPlans.findIndex(p => {
      const match = p.id === planId || p._id === planId;
      if (!match) return false;
      if (userId) {
        return String(p.userId) === userId;
      }
      return true;
    });

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found.',
      });
    }

    memoryStore.mealPlans.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

