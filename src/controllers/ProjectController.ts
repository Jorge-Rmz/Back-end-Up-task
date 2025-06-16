import type { Request, Response } from 'express';
import { Project } from '../models/Project';

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        try {
            await project.save();
            res.send("project created successfully");
        }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Error creating project' });
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        res.send('Get all projects');
    }
}
