import mongoose from "mongoose";
import colors from "colors";
import {exit} from "node:process";

export const connectDB = async () => {
    try {
        console.log(process.env.DATABASE_URL);
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(colors.green.bold(`MongoDB Connected: ${conn.connection}`));
    } catch (error) {
        console.error(colors.red.bold(`Error: ${error.message}`));
        exit(1);
    }
}