import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
    },
    description:{
        type:String,
        trim:true,
        maxlength:200,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],    
},{timestamps:true})

const Room = mongoose.model("Room",roomSchema);

export default Room;