import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = () => {
    console.log('SMTP_HOST', process.env.SMTP_HOST);
    console.log('SMTP_PORT', process.env.SMTP_PORT);
    console.log('SMTP_USER', process.env.SMTP_USER);
    console.log('SMTP_PASS', process.env.SMTP_PASS);
    return {
        host: process.env.SMTP_HOST,
        port: 2525,
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    } ;
}

export const transporter = nodemailer.createTransport(config())