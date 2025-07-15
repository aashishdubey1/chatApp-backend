import express from 'express'
import serverConfig from './config/serverConfig.js'
import helmet from 'helmet'
import connectToDb from './config/dbConfig.js';
import apiRouter from './routes/index.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());


app.use('/api',apiRouter)


app.get('/ping',(req,res)=>{
    res.status(200).json({msg:"Pong"})
})

// app.all('*',(req,res,next)=>{
//     next(new Error(`Can't find ${req.originalUrl} on this server!`,404))
// })

app.use(globalErrorHandler)


app.listen(serverConfig.PORT,async ()=>{
    console.log("Server is running on port",serverConfig.PORT)
    await connectToDb()
})