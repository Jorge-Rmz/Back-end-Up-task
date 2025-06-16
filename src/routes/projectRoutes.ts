import {Router} from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { body } from 'express-validator';
import { handleInputErors } from '../middleware/validation';

const router = Router();

router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clienteName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErors,
    ProjectController.createProject)
router.get('/', ProjectController.getAllProjects)

export default router;