import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Room from '../models/roomModel.js';
import Message from '../models/messageModel.js';

const socketAuth = async (socket,next) => {
    try {
        const token = socket.handshake.query.token;
        const decoded = jwt.verify(token,config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return next(new Error("User not found",404));
        socket.user = user;
        next(); 
    } catch (error) {
        next(new Error(error.message,500));
    }
}

const handleConnection = (io) =>{
    io.use(socketAuth);

    io.on('connection',(socket)=>{
        console.log(`User connected: ${socket.user.username}`);

        socket.on('join_room',async(roomId)=>{
            try {
                const room  = await Room.findById(roomId);
                if(!room || !room.members.includes(socket.user._id)) return socket.emit('error','Cannot join room');

                socket.join(roomId);
                socket.emit('joined_room',{roomId,roomName:room.name});

                socket.to(roomId).emit('user_joined',{username:socket.user.username});

            } catch (error) {
                socket.emit('error',error.message);
            }
        })

        socket.on('send_message',async(data)=>{
            try {
                const {roomId,content} = data;

                const room = await Room.findById(roomId);
                if(!room || !room.members.includes(socket.user._id)) return socket.emit('error','Cannot send message');

                const message = await Message.create({
                    sender:socket.user._id,
                    room:roomId,
                    content
                });

                await room.populate('sender','username');

                io.to(roomId).emit('new_message',{
                    _id:message._id,
                    content:message.content,
                    sender:{
                        id:message.sender._id,
                        username:message.sender.username,
                    },
                    room:message.room,
                    createdAt:message.createdAt,
                })
            } catch (error) {
                socket.emit('error',error.message);
            }
        })
        
        socket.on('leave_room',async(roomId)=>{
            try {
                socket.leave(roomId);
                socket.to(roomId).emit('user_left',{username:socket.user.username,userId:socket.user._id});
            } catch (error) {
                socket.emit('error',error.message);
            }
        })

        socket.on('disconnect',()=>{
            console.log(`User disconnected: ${socket.user.username}`);
        })
    })
}

export {handleConnection};