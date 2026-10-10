import { FoodRepository } from '../models/FoodItem.js';

// @desc    Get all foods with search, filtering, and sorting
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  try {
    const { search, category, sort, richIn, limit, page } = req.query;

    const result = await FoodRepository.findAll({
      search,
      category,
      sort,
      richIn,
      limit: limit ? parseInt(limit, 10) : 100,
      page: page ? parseInt(page, 10) : 1,
    });

    res.status(200).json({
      success: true,
      count: result.foods.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.foods,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res, next) => {
  try {
    const food = await FoodRepository.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: `Food item with ID '${req.params.id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of food categories and counts
// @route   GET /api/foods/meta/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await FoodRepository.getCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new food item to the reusable database
// @route   POST /api/foods
// @access  Public
export const addFood = async (req, res, next) => {
  try {
    const { name, teluguName, category, calories, macronutrients, vitamins, minerals, imageUrl, descriptionEn, descriptionTe, benefitsEn, benefitsTe, tags } = req.body;

    if (!name || !category || calories === undefined || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, calories, and a verified image URL.',
      });
    }

    const id = req.body.id || name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const newFood = await FoodRepository.create({
      id,
      name,
      teluguName: teluguName || name,
      category,
      calories: Number(calories),
      macronutrients: macronutrients || {},
      vitamins: vitamins || {},
      minerals: minerals || {},
      imageUrl,
      descriptionEn,
      descriptionTe,
      benefitsEn: benefitsEn || [],
      benefitsTe: benefitsTe || [],
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Food item successfully added to database.',
      data: newFood,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item by ID
// @route   DELETE /api/foods/:id
// @access  Public
export const deleteFood = async (req, res, next) => {
  try {
    const deleted = await FoodRepository.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Food item with ID '${req.params.id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food item successfully removed from database.',
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

