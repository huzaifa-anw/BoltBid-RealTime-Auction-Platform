import { Router } from "express";

const authRouter = Router();

authRouter.post('/register', (req, res) => res.json({msg: 'welcome to /register'}));
authRouter.post('/login', (req, res) => res.json({msg: 'welcome to /login'}));

export default authRouter;