
import type { Request, Response } from 'express';
import { Task } from '../models/Task';

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
            res.status(500).json({ error: 'Error creando la tarea.' });
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const task = await Task.find({ project: req.project.id }).populate('project', 'projectName clienteName description');
            if (!task || task.length === 0) {
                res.status(404).json({ error: 'No se encontraron tareas para este proyecto.' });
            }
            res.status(200).json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la tarea.' });
        }
    }
    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la tarea.' });
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.taskName = req.body.taskName;
            req.task.description = req.body.description;
            await req.task.save();
            res.status(200).json("Tarea actualizada exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la tarea.' });
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(t => t.toString() !== req.task.id.toString());
            await Promise.allSettled([
                req.task.deleteOne(),
                req.project.save()
            ]);
            res.status(200).json("Tarea eliminada exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la tarea.' });
        }
    }


    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            await req.task.save();
            res.status(200).json("Estado actualizado exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al buscar la tarea.' });
        }
    }
}