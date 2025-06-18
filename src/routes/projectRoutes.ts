import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { body, param } from 'express-validator';
import { handleInputErors } from '../middleware/validation';

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


export default router;