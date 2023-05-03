import { Router } from 'express'

import handleErrors from '../middlewares/handleErrors'
import {loginValidation, registerValidator} from '../validators/user-validators'
import {UserController} from '../controllers/user-controller'
import checkAuth from '../middlewares/checkAuth'

export const userRouter = Router()

userRouter.post('/register', registerValidator, handleErrors, UserController.register)

userRouter.post('/login', loginValidation, handleErrors, UserController.login)

userRouter.get('/me', checkAuth, UserController.authMe)
