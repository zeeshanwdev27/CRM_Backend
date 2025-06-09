import express from 'express';
import { getRoles } from '../controllers/roleController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getRoles);

export default router;