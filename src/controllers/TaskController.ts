import type { Request, Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([
                task.save(),
                req.project.save()
            ])
            res.status(201).json({ message: 'Tarea creada exitosamente', task });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creando la tarea.' });
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const task = await Task.find({ project: req.project.id }).populate('project', 'projectName clienteName description');
            if (!task || task.length === 0) {
                res.status(404).json({ message: 'No se encontraron tareas para este proyecto.' });
            }
            res.status(200).json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar la tarea.' });
        }
    }
}