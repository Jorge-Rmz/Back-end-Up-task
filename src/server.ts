import express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import ProjectRoutes from "./routes/projectRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/projects', ProjectRoutes);

export default app;