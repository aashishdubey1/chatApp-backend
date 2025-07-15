import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is Required"],
        unique:true,
        trim:true,
        minlength:[3,"Username must be at least 3 characters long"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
        minlength:[8,"Password must be at least 8 characters long"],
        select:false
    },
    created_At:{
        type:Date,
        default:Date.now()
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password)
}

const User = mongoose.model('User',userSchema)

export default User;