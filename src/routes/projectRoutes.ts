import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { body, param } from 'express-validator';
import { handleInputErors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { taskBelongsToProject, taskExists } from '../middleware/task';

const router = Router();

router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clienteName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErors,
    ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('El ID del proyecto debe ser un ID de MongoDB válido'),
    handleInputErors,
    ProjectController.getProjectById);

router.put('/:id',
    param('id').isMongoId().withMessage('El ID del proyecto debe ser un ID de MongoDB válido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clienteName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErors,
    ProjectController.updateProject);

router.delete('/:id',
    param('id').isMongoId().withMessage('El ID del proyecto debe ser un ID de MongoDB válido'),
    handleInputErors,
    ProjectController.deleteProject);

// Add task to project
router.param('projectId', projectExists);
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.post('/:projectId/tasks',
    handleInputErors,
    body('taskName').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    TaskController.createTask)


router.get('/:projectId/tasks',
    TaskController.getProjectTasks)

router.get('/:projectId/tasks/:taskId',
    TaskController.getTaskById)

router.put('/:projectId/tasks/:taskId',
    body('taskName').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErors,
    TaskController.updateTask)


router.delete('/:projectId/tasks/:taskId',
    TaskController.deleteTask)

router.put('/:projectId/tasks/:taskId/status',
    body('status').notEmpty().withMessage('El estado de la tarea es obligatorio'),
    handleInputErors,
    TaskController.updateTaskStatus)

export default router;