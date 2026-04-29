import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js'
import asyncHandler from "express-async-handler"
import { promisify } from 'util'

const authorize = asyncHandler (async (req, res, next) => {
    // access auth headers
    const authHeaders = req.headers.authorization || req.headers['Authorization'];

    if(!authHeaders) throw new ApiError('Auth Headers not found', 400, 'AUTH_HEADERS_NOT_FOUND');

    if(!authHeaders.startsWith('Bearer ')) throw new ApiError('Wrong authorization token format', 403, 'TOKEN_FORMAT_ERROR');
    
    const token = authHeaders.split(' ')[1];
    if(!token) throw new ApiError('Access Token not found ', 403, 'TOKEN_NOT_FOUND');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) throw new ApiError('Acess Token could not be verified', 401, 'INVALID_TOKEN');
        req.user = decoded;
        console.dir(req.user);
        next();
    })
})

export default authorize;