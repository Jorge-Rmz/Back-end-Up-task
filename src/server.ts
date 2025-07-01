import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import ProjectRoutes from "./routes/projectRoutes";

dotenv.config();
connectDB();

const app = express();

//Logging middleware
//leer consultas de formularios
app.use(morgan('dev'));

app.use(cors(corsConfig));

app.use(express.json());

app.use('/api/projects', ProjectRoutes);

export default app;