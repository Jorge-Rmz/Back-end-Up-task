import type {Request, Response, NextFunction} from 'express';
import { IProject, Project } from '../models/Project';

declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }   
}
export async function projectExists(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        req.project = project; 
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar el proyecto' });
    }
}