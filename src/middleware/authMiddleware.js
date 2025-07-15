import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import serverConfig from '../config/serverConfig.js';

async function protect(req,res,next) {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next(new Error("You are not logged in! Please log in to get access"));

    try {
        const decoded = jwt.verify(token,serverConfig.JWT_SECRET_KEY)

        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            return next(new Error("The user belonging to this token no longer exists.",401))
        }

        req.user = currentUser;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new Error('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new Error('Your token has expired! Please log in again.', 401));
        }
        next(err);
    }
}

export default protect;