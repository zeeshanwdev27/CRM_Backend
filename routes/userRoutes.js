import express from 'express'
import asyncHandler from "express-async-handler"
import { protect, admin } from '../middlewares/authMiddleware.js'
import {addUser, allUsers, deleteUser, updateUser } from '../controllers/userController.js'


const router = express.Router()


router.post('/adduser', protect, admin, asyncHandler(addUser))
router.get("/allusers", protect, admin, asyncHandler(allUsers))
router.delete("/:id", protect, admin, asyncHandler(deleteUser))
router.put("/:id", protect, admin, asyncHandler(updateUser))


export default router