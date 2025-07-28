import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document  {
    projectName: string;
    clienteName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[]; 
    manager: PopulatedDoc<IUser & Document>; 
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clienteName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [{
        type: Types.ObjectId,
        ref: "Task"
    }],
    manager: {
        type: Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export const Project = mongoose.model<IProject>("Project", ProjectSchema); 
