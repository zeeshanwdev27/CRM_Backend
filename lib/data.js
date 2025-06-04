import mongoose from "mongoose";
import User from "../models/User.js";


async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CrmApp");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

async function adminEntry() {
    try{
        // Check Admin
        const existAdmin = await User.findOne({email: "admin123@gmail.com"})

        if(existAdmin){
            console.log("admin already registered")
            return
        }

        const user = new User({
            name: "admin123",
            email: "admin123@gmail.com",
            password: "admin123",
            role: "admin"
        })
        await user.save()
        console.log("Admin Succesfully Added Into DB")

    }catch(e){
        console.error("Error Inserted Admin into DB",e);
    }
}


async function main() {
  await connectDB();
  await adminEntry();
  mongoose.connection.close();
}

main();