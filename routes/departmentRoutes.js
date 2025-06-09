import express from 'express';
import { getDepartments } from '../controllers/departmentController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getDepartments);

export default router;