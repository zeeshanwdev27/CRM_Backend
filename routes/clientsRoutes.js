import express from "express";
import {createClient, getClients} from "../controllers/clientsController.js"
import {getSingleContact} from "../controllers/contactsController.js"

const router = express.Router();

router.get("/add/:id", getSingleContact );
router.get("/getclients", getClients );
router.post("/add", createClient)

export default router;
