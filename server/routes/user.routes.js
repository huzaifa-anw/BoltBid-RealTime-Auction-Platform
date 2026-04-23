import { Router } from "express";
import authorize from "../middlewares/authorize.middleware.js";

const userRouter = Router();

userRouter.get('/me', authorize ,(req, res) => res.json({msg: 'get user profile data'}));

export default userRouter;