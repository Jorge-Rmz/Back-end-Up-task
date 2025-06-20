import type { Request, Response, NextFunction } from 'express';
import { ITask, Task } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}
export async function taskExists(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task no encontrada' });
        }
        req.task = task;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la tarea' });
    }
}


export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.task.project.toString() !== req.project.id.toString()) {
            res.status(400).json({ message: 'Acción no valida' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la tarea' });
    }
}