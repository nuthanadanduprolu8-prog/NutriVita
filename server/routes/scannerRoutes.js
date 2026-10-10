import express from 'express';
import { 
  identifyFood, 
  searchFoodsFallback, 
  getScannerStatus, 
  getPopularWholeFoods,
  correctOrRecalculateFood
} from '../controllers/scannerController.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/status', getScannerStatus);
router.get('/popular-foods', getPopularWholeFoods);
router.post('/identify', upload.single('image'), handleUploadError, identifyFood);
router.post('/correct', correctOrRecalculateFood);
router.get('/search', searchFoodsFallback);

export default router;
