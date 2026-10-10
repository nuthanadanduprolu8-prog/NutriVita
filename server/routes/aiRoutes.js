import express from 'express';
import { chatWithVitaMate, getSuggestedPrompts } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithVitaMate);
router.get('/prompts', getSuggestedPrompts);

export default router;
