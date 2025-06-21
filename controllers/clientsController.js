import Client from "../models/Clients.js"
import asyncHandler from "express-async-handler";


export const createClient = asyncHandler( async(req,res)=>{
    const {name,email,company,projects,value,status,lastContact } = req.body

    if(!name || !email || !company){
        res.status(400)
        throw new Error ("Please Fill All Required Fields")
    }

    const existingClient = await Client.findOne({email})
    if(existingClient){
        res.status(400)
        throw new Error ("Client Already Existed")
    }

    const client = await Client.create({
        name,
        email,
        company,
        projects,
        value,
        status,
        lastContact
    })

    res.status(201).json({
        status: "success",
        message: "Client Created Successfully",
        data: client
    })
})

export const getClients = asyncHandler(async(req,res)=>{

    const getClients = await Client.find({})
    res.status(200).json({
        status:"success",
        message: "Clients Fetch Successfully",
        data: {
            getClients
        }
    })
})