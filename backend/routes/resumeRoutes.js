import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer to store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a PDF file'));
    }
    cb(undefined, true);
  },
});

router.post('/analyze', protect, upload.single('resume'), analyzeResume);

export default router;
