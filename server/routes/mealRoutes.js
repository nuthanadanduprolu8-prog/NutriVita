import express from 'express';
import { balanceMeal, generatePlan, saveMealPlan, getSavedPlans, deleteMealPlan } from '../controllers/mealController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/balance', balanceMeal);
router.post('/generate', generatePlan);
router.post('/save', optionalAuth, saveMealPlan);
router.get('/saved', optionalAuth, getSavedPlans);
router.delete('/saved/:id', optionalAuth, deleteMealPlan);

export default router;
