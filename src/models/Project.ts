import mongoose, {Schema, Document} from "mongoose";



export type ProjectType = Document & {
    projectName: string;
    clienteName: string;
    description: string;
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
    }
});

export const Project = mongoose.model<ProjectType>("Project", ProjectSchema); 
