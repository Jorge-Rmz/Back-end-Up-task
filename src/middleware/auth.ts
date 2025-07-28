import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const autheticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ error: 'No Autorizado' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('_id email name');
            if(!user) {
                res.status(401).json({ error: 'Token no valido' });
            }else{
                req.user = user;
            }
        }catch (error) {
            res.status(401).json({ error: 'Token inválido' });  
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}