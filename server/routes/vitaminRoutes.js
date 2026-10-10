import express from 'express';
import { getVitamins, getVitaminById } from '../controllers/vitaminController.js';

const router = express.Router();

router.get('/', getVitamins);
router.get('/:id', getVitaminById);

export default router;
