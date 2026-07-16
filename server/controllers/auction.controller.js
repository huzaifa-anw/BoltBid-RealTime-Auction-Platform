import asyncHandler from "express-async-handler";
import { eq } from "drizzle-orm";
import ApiError from '../utils/ApiError.js'
import { db } from "../db/db.js";
import { auctions } from "../db/schema.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createAuction = asyncHandler(async (req, res) => {
    // endsAtDurationInHrs is how many hours from now the auction should stay open.
    // Client must send whole hours only — any conversion from days happens client-side.
    // the server does not accept anything other than hours
    const { title, description, startingPrice, imageURL, endsAtDurationInHrs } = req.body;

    const hostId = req.user.id;

    if (!hostId) throw new ApiError('host id wasnt found in access token paylaod, get token on api/v1/auth/login', 400, 'VALIDATION_ERROR');

    if (!title || !description || startingPrice == null || endsAtDurationInHrs == null) {
        throw new ApiError('all fields are required', 400, 'VALIDATION_ERROR');
    }

    if (startingPrice <= 0) throw new ApiError('starting price should be a positive integer', 400, 'VALIDATION_ERROR');

    if (endsAtDurationInHrs <= 0) throw new ApiError('auction end duartion (endsAtDurationInHrs) should be a positive integer', 400, 'VALIDATION_ERROR');

    if (title.length <= 0 || title.length > 254) throw new ApiError('title should be between 1-254 characters', 400, 'VALIDATION_ERROR');

    if (description.length <= 0 || description.length > 254) throw new ApiError('description should be between 1-254 characters', 400, 'VALIDATION_ERROR');

    const durationHrs = Number(endsAtDurationInHrs);
    if (!Number.isFinite(durationHrs)) throw new ApiError('endsAtDurationInHrs must be a number', 400, 'VALIDATION_ERROR');

    const MIN_DURATION_HRS = 1; // 1 hour
    const MAX_DURATION_HRS = 24 * 10; // 10 days

    if (durationHrs < MIN_DURATION_HRS) throw new ApiError('auction must run for at least 1 hour', 400, 'VALIDATION_ERROR');
    if (durationHrs > MAX_DURATION_HRS) throw new ApiError('auction cannot run longer than 10 days', 400, 'VALIDATION_ERROR');

    const endsAtDate = new Date(Date.now() + (durationHrs * 60 * 60 * 1000));   

    const auction = {
        title,
        host_id: hostId,
        description,
        starting_price: startingPrice,
        ends_at: endsAtDate,
        status: 'ACTIVE', // ACTIVE or ENDED
        image_url: imageURL
    };

    let dbResponse;
    try {
        dbResponse = await db.insert(auctions).values(auction).returning();
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, 'DB_ERROR');
    }

    const response = new ApiResponse(true, 201, 'auction created', { auction: dbResponse[0] });

    return res.status(response.statusCode).json(response);
});

// get all auctions
export const getAuctions = asyncHandler(async (req, res) => {
    let activeAuctions;

    try {
        activeAuctions = await db
            .select()
            .from(auctions)
            .where(eq(auctions.status, "ACTIVE"));
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    const response = new ApiResponse(true, 200, "auctions fetched", {
        auctions: activeAuctions
    });

    return res.status(response.statusCode).json(response);
});

// get one auction by id
export const getAuction = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let auctionRecord;

    try {
        const auctionRows = await db
            .select()
            .from(auctions)
            .where(eq(auctions.id, id));

        auctionRecord = auctionRows[0];
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    if (!auctionRecord) {
        const response = new ApiResponse(false, 404, "auction does not exist", null);
        return res.status(response.statusCode).json(response);
    }

    if (auctionRecord.status === "ENDED") {
        const response = new ApiResponse(false, 200, "auction has ended", { auction: auctionRecord });
        return res.status(response.statusCode).json(response);
    }

    const response = new ApiResponse(true, 200, "auction fetched", { auction: auctionRecord });
    return res.status(response.statusCode).json(response);
});