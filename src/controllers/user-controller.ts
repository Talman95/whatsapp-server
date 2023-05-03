import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import UserModel from '../models/User'
import { tokenService } from '../services/tokenService'

export const UserController = {
    register: async (req: Request, res: Response) => {
        try {
            const password: string = req.body.password

            const salt = await bcrypt.genSalt(7)
            const hash = await bcrypt.hash(password, salt)

            const user = await UserModel.create({
                email: req.body.email,
                passwordHash: hash,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
            })

            const token = tokenService.generateToken(user._id.toString())

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                token,
            })
        } catch (err) {
            console.log(err)

            res.status(500).json({
                message: 'Не удалось зарегестрироваться'
            })
        }
    },
}