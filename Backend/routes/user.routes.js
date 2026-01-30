import express from 'express';
import { askToAssistant, getAllUsers, updatesAssistant } from '../controllers/user.controllers.js';
import  isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/current',isAuth,getAllUsers)
userRouter.post('/update',isAuth,upload.single("assistantImage"),updatesAssistant)
userRouter.post('/asktoassistant',isAuth,askToAssistant)

export default userRouter;