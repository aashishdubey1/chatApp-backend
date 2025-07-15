import express from 'express';
import controllers from '../controllers/index.js'
import  protect  from '../middleware/authMiddleware.js'

const authRouter = express.Router()

const authController = controllers.authController

authRouter.post('/login',authController.login)

authRouter.post('/register',authController.register)

authRouter.get('/profile',protect,authController.getProfile)

export default authRouter;