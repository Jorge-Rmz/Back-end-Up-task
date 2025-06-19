import mongoose, {Schema, Document, Types} from "mongoose";

const taskStatus = {
    PENDING: "pending",
    ON_HOLD: "onHold",
    IN_PROGRESS: "inProgress",
    UNDER_REVIEW: "underReview",
    COMPLETED: "completed"
}as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document  {
    taskName: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus; 
}

const TaskSchema: Schema = new Schema({
    taskName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    }
},{timestamps: true});

export const Task = mongoose.model<ITask>("Task", TaskSchema); 
