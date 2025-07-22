import express from 'express';
import controllers from '../controllers/index.js';
import protect from '../middleware/authMiddleware.js';

const {roomController} = controllers;

const roomRouter = express.Router();

roomRouter.use(protect);

roomRouter.post('/',roomController.createRoom);

roomRouter.get('/',roomController.getRooms);

roomRouter.post('/:roomId/join',roomController.joinRoom);

roomRouter.get('/:roomId/messages',roomController.getMessages);



export default roomRouter;