import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const createRoom = async (req,res,next) => {
    try {
        const {name,description} = req.body;

        if(!name || !description) return next(new Error("Name and description are required",400));

        const room = await Room.create({
            name,
            description,
            creator:req.user._id,
            members:[req.user._id]
        })

        await room.populate('creator','username email')
            
            
        res.status(201).json({
            success:true,   
            message: 'Room created successfully',
            room
        })

    } catch (error) {
        next(new Error(error.message,500));
    }
}

export const getRooms = async (req,res,next) => {

    try {
        const rooms = await Room.find({members:{$in:[req.user._id]}}).populate('creator','username email');

        if(rooms.length === 0) return next(new Error("No rooms found",404));

        res.status(200).json({
            success:true,
            message: 'Rooms fetched successfully',
            rooms
        })

    } catch (error) {
        next(new Error(error.message,500));
    }
}

export const joinRoom = async (req,res,next) => {
    
    try {
        const {roomId} = req.params;
        const room = await Room.findById(roomId);

        if(!room) return next(new Error("Room not found",404));
        
        if(room.members.includes(req.user._id)) return next(new Error("You are already a member of this room",400));

        room.members.push(req.user._id);

        await room.save();

        // await room.populate('creator','username email')
        //   .populate('members','username');

        res.status(200).json({
            success:true,
            message: 'Joined room successfully',
        })

    } catch (error) {
        next(new Error(error.message,500));
    }
}

export const getMessages = async (req,res,next) => {
    try {
        const {roomId} = req.params;
        const {page = 1,limit = 10} = req.query;

        const room = await Room.findById(roomId);

        if(!room) return next(new Error("Room not found",404));

        const messages = await Message.find({room:roomId})
            .populate('sender','username')
            .sort({createdAt:-1})
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success:true,
            messages:messages,
        })

    } catch (error) {
        next(new Error(error.message,500));
    }
}