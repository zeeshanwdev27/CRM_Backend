import express from 'express';
import { getRoles, deleteRole, createRole } from '../controllers/roleController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getRoles);
router.delete('/:id', protect, admin, deleteRole);
router.post('/', protect, admin, createRole);

export default router;