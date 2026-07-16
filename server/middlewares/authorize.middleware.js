import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from "express-async-handler";

const authorize = asyncHandler(async (req, res, next) => {
    const authHeaders = req.headers.authorization || req.headers['Authorization'];

    if (!authHeaders) throw new ApiError('Auth Headers not found', 400, 'AUTH_HEADERS_NOT_FOUND');
    if (!authHeaders.startsWith('Bearer ')) throw new ApiError('Wrong authorization token format', 403, 'TOKEN_FORMAT_ERROR');

    const token = authHeaders.split(' ')[1];
    if (!token) throw new ApiError('Access Token not found', 403, 'TOKEN_NOT_FOUND');

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // sync form, throws directly
        req.user = decoded;
        next();
    } catch (err) {
        throw new ApiError('Access Token could not be verified', 401, 'INVALID_TOKEN');
    }
})

export default authorize;