import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";

import connectDB from "./config/db.js";


dotenv.config();

connectDB();


const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);


// Test Route
app.get("/", (req,res)=>{
    res.send("🚀 IdeaHub Backend Running...");
});


const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
});