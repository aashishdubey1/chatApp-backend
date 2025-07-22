import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        maxlength:500,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true,
    },
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);

export default Message;