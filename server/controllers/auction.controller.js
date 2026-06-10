import asyncHandler from "express-async-handler";
import ApiError from '../utils/ApiError.js'
import { db } from "../db/db.js";
import { auctions } from "../db/schema.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createAuction = asyncHandler(async (req, res) => {
        const {title, hostId, description, startingPrice, endsAt} = req.body;

        if (!title || !hostId || !description || !startingPrice || !endsAt) throw new ApiError('all fields are required ', 400, 'VALIDATION_ERROR');

        if (startingPrice <= 0) throw new ApiError('starting price should be a positive integer', 400, 'VALIDATION_ERROR');

        if (title.length <= 0 || title.length > 254 ) throw new ApiError('title should be between 1-254 characters', 400, 'VALIDATION_ERROR');

        if (description.length <= 0 || description.length > 254 ) throw new ApiError('description should be between 1-254 characters', 400, 'VALIDATION_ERROR');
         
        const endsAtNum = Number(endsAt);
        if (!Number.isFinite(endsAtNum)) throw new ApiError("endsAt must be a number", 400);
        // making sure time sent is in ms
        if (String(endsAtNum).length !== 13) throw new ApiError("endsAt must be epoch milliseconds", 400);

        // current time in epoch
        const nowDateEpoch = Date.now();

        // find the higher and upper bound for auction ending time in epoch
        const minEndsAtEpoch = nowDateEpoch + 1000 * 60 * 60; // 1 hour from now
        const maxEndsAtEpoch = nowDateEpoch + 1000 * 60 * 60 * 24 * 10; // 10 days from now

        if(endsAtNum < minEndsAtEpoch) throw new ApiError('auction cannot end before 1hr from the current time', 400, 'VALIDATION_ERROR');

        if(endsAtNum > maxEndsAtEpoch) throw new ApiError('auction cannot end later than 10 days from now', 400, 'VALIDATION_ERROR')

        const nowDate = new Date(nowDateEpoch);

        const endsAtDate = new Date(endsAtNum);

        const auction = {   
            title,
            host_id: hostId,
            description,
            starting_price: startingPrice, 
            ends_at: endsAtDate
        }

        let dbResponse;
        try {
            dbResponse = await db.insert(auctions).values(auction).returning();
        } catch (err) {
            console.error("DB ERROR:", err);
            throw new ApiError(err.message, 500, 'DB_ERROR');
        }

        const response = new ApiResponse(true, 201, 'auction created', {dbResponse});

        return res.status(response.statusCode).json(response);

})