import type { Request, Response } from 'express'
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { transporter } from '../config/nodemailer';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            //prevenir usuario duplicado
            const userExists = await User.findOne({ email });
            if (userExists) {
                res.status(409).json({ error: 'El usuario ya existe' });
            }
            // Crea un usuario
            const user = new User(req.body);
            // hash password
            user.password = await hashPassword(password);

            //Generar token de confirmación
            const token = new Token();
            token.user = user.id;
            token.token = generateToken();

            //enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([
                user.save(),
                token.save()
            ]);

            res.status(201).json( 'Cuenta creada exitosamente, revisa tu email para confirmarla' );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creando la cuenta' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                res.status(400).json({ error: 'Token no válido' });
            }

            const user = await User.findById(tokenExists.user);
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Actualizar el usuario a confirmado
            user.confirmed = true;

            // Eliminar el token
            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ]);

            res.status(201).json( 'Cuenta confirmada exitosamente' );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error confirmando la cuenta' });
        }
    }

}