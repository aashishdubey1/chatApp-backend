import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import serverConfig from '../config/serverConfig.js';

function signToken(id){
    return jwt.sign({id},serverConfig.JWT_SECRET_KEY,{expiresIn:serverConfig.JWT_EXPIRES_IN})
}


export async function login(req,res,next) {
    
    const {email,password} = req.body

    if(!email || !password) return next(new Error("Please provide email and password",400));

    const exitstingUser = await User.findOne({email}).select("+password");

    if(!exitstingUser || !(await exitstingUser.comparePassword(password))) return next(new Error("Incorrect email or password",401));

    exitstingUser.password = undefined;

    const token = signToken(exitstingUser._id);

    res.status(200).json({
        success:"true",
        token,
        data:{
            user:exitstingUser
        }
    })
}

export async function register(req,res,next){
   try {
    const {username,email,password} = req.body

    if(!username || !email || !password) return next(new Error("Please provide username, email and password",400));

    const exitstingUser = await User.findOne({$or:[{email},{username}]})

    if(exitstingUser) return next(new Error("User already exists",400));

    const newUser = await User.create({username,email,password})

    newUser.password = undefined;

    const token = signToken(newUser._id);

    res.status(201).json({
        success:true,
        token,
        data:{
            user:newUser
        }
    })
   } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

export async function getProfile(req,res){
    res.status(200).json({
        success:true,
        data:{
            user:req.user
        }
    })
}