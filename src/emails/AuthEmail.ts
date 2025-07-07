import { transporter } from "../config/nodemailer";

interface IEmail{
    email: string;
    name: string;
    token?: string;
}
export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        await transporter.sendMail({
            from: '"UpTask" <admin@uptask.com>',
            to: user.email,
            subject: 'Confirma tu cuenta en UpTask',
            text: `Hola ${user.name}, por favor confirma tu cuenta en UpTask`,
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, 
                para utilizarla debes de confirma r tu cuenta</p>
                <p>Haz click en el siguiente enlace para confirmar tu cuenta:
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a></p>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
                `,
        });
    }
}