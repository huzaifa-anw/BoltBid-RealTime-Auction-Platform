import { Router } from "express";

const userRouter = Router();

userRouter.get('/me', (req, res) => res.json({msg: 'get user profile data'}));

export default userRouter;