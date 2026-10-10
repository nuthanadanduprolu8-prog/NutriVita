import { VitaminRepository } from '../models/VitaminInfo.js';

// @desc    Get all vitamins and minerals with filtering
// @route   GET /api/vitamins
// @access  Public
export const getVitamins = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    const vitamins = await VitaminRepository.findAll({ type, search });

    res.status(200).json({
      success: true,
      count: vitamins.length,
      data: vitamins,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vitamin profile with populated food sources
// @route   GET /api/vitamins/:id
// @access  Public
export const getVitaminById = async (req, res, next) => {
  try {
    const vitamin = await VitaminRepository.findById(req.params.id);

    if (!vitamin) {
      return res.status(404).json({
        success: false,
        message: `Vitamin with ID '${req.params.id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: vitamin,
    });
  } catch (error) {
    next(error);
  }
};
