import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';         //to remove try/catch & code more readable
import User from '../models/User.js'



const protect = asyncHandler(async (req, res, next) => {
    let token
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        res.status(401)
        throw new Error("Not authorized, no token")
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')

        if(!req.user){
            res.status(401)
            throw new Error("Not authorized, User not Found")
        }

        next()
    }catch(e){
        console.error(e)
        res.status(401)
        throw new Error("Not Authorized, Token Failed")
    }
})


// @desc    Admin-only middleware
const admin = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        res.status(403)
        throw new Error("Not authorized as admin")
    }
}


export {protect, admin}