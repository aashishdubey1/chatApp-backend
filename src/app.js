import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import serverConfig from './config/serverConfig.js'
import helmet from 'helmet'
import connectToDb from './config/dbConfig.js';
import apiRouter from './routes/index.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import {handleConnection} from './service/socketService.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(cors());


app.use('/api',apiRouter)

handleConnection(io);


app.get('/ping',(req,res)=>{
    res.status(200).json({msg:"Pong"})
})

app.get('/',(req,res)=>{
    res.send("Server is running")
})
// app.all('*',(req,res,next)=>{
//     next(new Error(`Can't find ${req.originalUrl} on this server!`,404))
// })

app.use(globalErrorHandler)


server.listen(serverConfig.PORT,async ()=>{
    console.log("Server is running on port",serverConfig.PORT)
    await connectToDb()
})