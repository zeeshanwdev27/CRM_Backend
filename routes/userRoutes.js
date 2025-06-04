import express from 'express'
import asyncHandler from "express-async-handler"
import { protect, admin } from '../middlewares/authMiddleware.js'
import User from '../models/User.js'


const router = express.Router()


router.post('/adduser', protect, admin, asyncHandler(async(req,res)=>{
    const {email,name,password,phone,role,status,joinDate} = req.body

        if (!email || !name || !password || !phone) {
        res.status(400);
        throw new Error('Please include all required fields');
    }

    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400)
        throw new Error("User Already Registered")
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role,
        status,
        joinDate: joinDate || Date.now()
    });

      if (user) {
    res.status(201).json({
        message: "User Successfully Inserted"
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}))


router.get("/allusers", protect, admin, asyncHandler(async(req,res)=>{
        const users= await User.find({}).select('-password');
        res.status(200).json({status:"success", message: "Users Successfully Fetched", data: users})
}))


export default router