import { checkPassword } from './../utils/auth';
import type { Request, Response } from 'express'
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { transporter } from '../config/nodemailer';
import { AuthEmail } from '../emails/AuthEmail';
import { token } from 'morgan';
import { generateJWT } from '../utils/jwt';

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

            res.status(201).json('Cuenta creada exitosamente, revisa tu email para confirmarla');
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
                res.status(404).json({ error: 'Token no válido' });
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

            res.status(201).json('Cuenta confirmada exitosamente');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error confirmando la cuenta' });
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                //enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });

                res.status(401).json({ error: 'Cuenta no confirmada, hemos enviado un email de confirmación' });
            }
            // Verificar contraseña
            const isPasswordValid = await checkPassword(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }   

            const token =  generateJWT({id: user.id});

            res.status(200).send( token )
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error iniciando sesión' });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ error: 'Usuario no existente' });
            }
            if( user.confirmed ) {
                res.status(403).json({ error: 'Cuenta ya confirmada' });
            }

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

            await token.save();

            res.status(201).json('Nuevo token enviado, revisa tu email para confirmar tu cuenta');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error generando un nuevo token' });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ error: 'Usuario no existente' });
            }
        
            //Generar token de confirmación
            const token = new Token();
            token.user = user.id;
            token.token = generateToken();
            await token.save();

            //enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });


            res.status(201).json('Rervisamos tu email, hemos enviado un token para restablecer tu contraseña');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error generando un nuevo token' });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                res.status(404).json({ error: 'Token no válido' });
            }
            res.status(200).json('Token válido, puedes restablecer tu contraseña');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error confirmando la cuenta' });
        }
    }


    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                res.status(404).json({ error: 'Token no válido' });
            }

            const user = await User.findById(tokenExists.user);
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Actualizar el usuario con la nueva contraseña
            user.password = await hashPassword(req.body.password);

            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ]);

            res.status(200).json('Password actualizado exitosamente');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error confirmando la cuenta' });
        }
    }

}