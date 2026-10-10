import express from 'express';
import { getBodyAreas, assessBodyChange, getBodyAnalyzerStatus } from '../controllers/bodyAnalyzerController.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/status', getBodyAnalyzerStatus);
router.get('/areas', getBodyAreas);
router.post('/assess', upload.single('photo'), handleUploadError, assessBodyChange);

export default router;
