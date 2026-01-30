import express from 'express';
import { signIn, Logout, signUp } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signIn', signIn);
authRouter.get('/logout', Logout);

export default authRouter;
