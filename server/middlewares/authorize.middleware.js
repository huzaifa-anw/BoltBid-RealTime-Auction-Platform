import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js'
import asyncHandler from "express-async-handler"
import { promisify } from 'util'

const authorize = asyncHandler (async (req, res, next) => {
    // access auth headers
    const authHeaders = req.headers.authorization || req.headers['Authorization'];
    console.dir(authHeaders);

    if(!authHeaders) throw new ApiError('Auth Headers not found', 400);

    if(!authHeaders.startsWith('Bearer ')) throw new ApiError('Wrong authorization token format', 403);
    
    const token = authHeaders.split(' ')[1];
    if(!token) throw new ApiError('Access Token not found ', 403);

    // wrap jwt.verify into promisify
    const verifyToken = promisify(jwt.verify);

    const payload = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    console.dir(req.user);

    next();
})

export default authorize;