import type { Request, Response } from 'express';
import { Project } from '../models/Project';

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        try {
            // Asigna el creador del proyecto
            project.manager = req.user.id;

            await project.save();
            res.send("project created successfully");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating project' });
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({ manager: req.user.id });
            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar los projectos' });
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate('tasks', 'taskName description status');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
            }
            // Verifica que el proyecto pertenezca al usuario autenticado
            if( project.manager.toString() !== req.user.id.toString()) {
                res.status(403).json({ error: 'No tienes permiso para acceder a este proyecto' });
            }

            res.json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar el proyecto' });
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
            }
            // Verifica que el proyecto pertenezca al usuario autenticado
            if( project.manager.toString() !== req.user.id.toString()) {
                res.status(403).json({ error: 'No tienes permiso para actualizar este proyecto' });
            }
            project.projectName = req.body.projectName;
            project.clienteName = req.body.clienteName;
            project.description = req.body.description;
            await project.save();
            res.send("Projecto actualizado");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar el proyecto' });
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
            }
            // Verifica que el proyecto pertenezca al usuario autenticado
            if( project.manager.toString() !== req.user.id.toString()) {
                res.status(403).json({ error: 'No tienes permiso para eliminar este proyecto' });
            }
            await project.deleteOne();
            res.send("Projecto eliminado");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar el proyecto' });
        }
    }
}
