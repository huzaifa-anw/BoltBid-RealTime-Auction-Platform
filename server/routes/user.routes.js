import { Router } from "express";
import authorize from "../middlewares/authorize.middleware.js";
import userProfile from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/me', authorize ,userProfile);

export default userRouter;