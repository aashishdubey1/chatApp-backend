import express from 'express'
import authRouter from './authRoutes.js'
import roomRouter from './roomRoutes.js'

const apiRouter = express.Router()

apiRouter.use('/auth',authRouter)
apiRouter.use('/rooms',roomRouter)


export default apiRouter;