import User from '../models/User.js'

export const addUser = async(req,res)=>{
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
}

export const allUsers = async(req,res)=>{
        const users= await User.find({}).select('-password');
        res.status(200).json({status:"success", message: "Users Successfully Fetched", data: users})
}


export const deleteUser = async(req,res)=>{
    const {id} = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if(deletedUser){
        res.status(200).json({
            status:"success",
            message:"User Deleted Successfully"
        })
    }else{
        res.status(404).json({
            message:"User Not Found"
        })
    }
}


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, status, joinDate } = req.body;

    // Basic validation
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('Please include all required fields');
    }

    // Check if email is being changed to one that already exists
    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            name,
            email,
            phone,
            role,
            status,
            joinDate: joinDate || user.joinDate
        },
        { new: true, runValidators: true }
    ).select('-password');

    if (updatedUser) {
        res.status(200).json({
            status: "success",
            message: "User updated successfully",
        });
    } else {
        res.status(400);
        throw new Error('User update failed');
    }
}