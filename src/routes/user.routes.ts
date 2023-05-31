import { Router } from 'express'

import handleErrors from '../middlewares/handleErrors'
import {
  loginValidation,
  registerValidator,
} from '../validators/user-validators'
import { UserController } from '../controllers/user.controller'
import checkAuth from '../middlewares/checkAuth'

export const userRoutes = Router()

userRoutes.post(
  '/register',
  registerValidator,
  handleErrors,
  UserController.register
)

userRoutes.post('/login', loginValidation, handleErrors, UserController.login)

userRoutes.get('/me', checkAuth, UserController.authMe)

userRoutes.get('/users', checkAuth, UserController.getUsersByName)
