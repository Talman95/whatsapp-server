import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {_id: string}

            //@ts-ignore
            req.userId = decoded._id;
            next()
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа',
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}