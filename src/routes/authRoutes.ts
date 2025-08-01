import { Router } from 'express'
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController'
import { handleInputErors } from '../middleware/validation';

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña no puede ser menor a 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true;
    }),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErors,
    AuthController.createAccount);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErors,
    AuthController.confirmAccount
);

router.post('/login',
    body('password')
        .notEmpty().withMessage('La contraseña no puede estar vacia'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErors,
    AuthController.login
);

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErors,
    AuthController.requestConfirmationCode
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErors,
    AuthController.validateToken
);

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña no puede ser menor a 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true;
    }),
    handleInputErors,
    AuthController.updatePasswordWithToken
);

export default router;  