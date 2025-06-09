import 'dotenv/config';
import express from 'express';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js"
import cors from 'cors'
import './models/index.js';

const app = express();
connectDb();

app.use(express.json()); 
app.use(cors())


app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("Hello World"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
