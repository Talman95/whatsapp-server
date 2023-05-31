import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import { tokenService } from '../services/tokenService'

export const UserController = {
  register: async (req: Request, res: Response) => {
    try {
      const password: string = req.body.password

      const salt = await bcrypt.genSalt(7)
      const hash = await bcrypt.hash(password, salt)

      const user = await User.create({
        email: req.body.email,
        passwordHash: hash,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
      })

      const token = tokenService.generateToken(user._id.toString())

      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        token,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Не удалось зарегистрироваться',
      })
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' })
      }

      const isValidPass = await bcrypt.compare(
        req.body.password,
        user.passwordHash
      )

      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        })
      }

      const token = tokenService.generateToken(user._id)

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        token,
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        message: 'Не удалось авторизоваться',
      })
    }
  },
  authMe: async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      const user = await User.findById(req.userId).select('-passwordHash')

      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        })
      }

      res.status(200).json(user)
    } catch (err) {
      res.status(404).json({
        message: 'Нет доступа',
      })
    }
  },
  getUsersByName: async (req: Request, res: Response) => {
    const name = req.query.name as string
    //@ts-ignore
    const userId = req.userId as string

    const query = req.query.name
      ? { fullName: { $regex: name.trim(), $options: 'i' } }
      : {}

    const users = await User.find(query)
      .select('-passwordHash -token')
      .find({ _id: { $ne: userId } })
      .sort({ updatedAt: -1 })

    res.status(200).json(users)
  },
}
