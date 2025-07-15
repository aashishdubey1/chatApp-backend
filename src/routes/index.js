import express from 'express'
import authRouter from './authRoutes.js'

const apiRouter = express.Router()

apiRouter.use('/auth',authRouter)
apiRouter.use('/rooms',roomRouter)


export default apiRouter;