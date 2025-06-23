import mongoose from "mongoose";
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


export const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.isValidObjectId(id)) {
        res.status(400);
        throw new Error("Invalid Client ID format");
    }

    // Check if client exists before attempting deletion
    const client = await Client.findById(id);
    if (!client) {
        res.status(404);
        throw new Error("Client not found");
    }

    // Perform deletion
    const deletedClient = await Client.findByIdAndDelete(id);
    
    if (!deletedClient) {
        res.status(500);
        throw new Error("Failed to delete client");
    }

    res.status(200).json({
        status: "success",
        message: "Client deleted successfully",
        data: {
            id: deletedClient._id,
            name: deletedClient.name
        }
    });
});


export const getSingleClient = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400); 
            throw new Error("Invalid contact ID format");
        }
    
        const client = await Client.findById(id);
    
        if (!client) {
            res.status(404); 
            throw new Error("Contact not found");
        }
    
        res.status(200).json({
            status: "success",
            message: "Contact retrieved successfully",
            data: {
                client 
            }
        });
    
})


export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid client ID");
  }

  const {
    name,
    email,
    company,
    projects,
    value,
    status,
    lastContact
  } = req.body;

  // Basic validation
  if (!name || !email || !company || !value) {
    res.status(400);
    throw new Error("Please provide all required fields: name, email, company, value");
  }

  const updatedClient = await Client.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        email,
        company,
        projects: Array.isArray(projects) ? projects : [],
        value,
        status: status || 'active',
        lastContact: lastContact || new Date()
      }
    },
    { new: true, runValidators: true }
  );

  if (!updatedClient) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.status(200).json({
    success: true,
    message: "Client updated successfully",
    data: {
      client: updatedClient
    }
  });
});