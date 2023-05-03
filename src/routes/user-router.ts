import { Router } from 'express'

import handleErrors from "../middlewares/handleErrors"
import {registerValidator} from "../validators/user-validators"
import {UserController} from "../controllers/user-controller"

export const userRouter = Router()

userRouter.post('/register', registerValidator, handleErrors, UserController.register)