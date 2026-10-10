import express from 'express';
import { getFoods, getFoodById, getCategories, addFood, deleteFood } from '../controllers/foodController.js';

const router = express.Router();

router.get('/meta/categories', getCategories);
router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', addFood);
router.delete('/:id', deleteFood);

export default router;
