import express from 'express';
import { getSymptoms, getSymptomById, assessSymptoms } from '../controllers/symptomController.js';

const router = express.Router();

router.get('/', getSymptoms);
router.get('/:id', getSymptomById);
router.post('/assess', assessSymptoms);

export default router;
