import express from 'express'
import serverConfig from './config/serverConfig.js'
import helmet from 'helmet'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());


app.get('/ping',(req,res)=>{
    res.status(200).json({msg:"Pong"})
})


app.listen(serverConfig.PORT,()=>{
    console.log("Server is running on port",serverConfig.PORT)
})