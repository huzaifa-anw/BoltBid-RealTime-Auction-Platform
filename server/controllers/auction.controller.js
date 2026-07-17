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

    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const normalizedDescription = typeof description === 'string' ? description.trim() : '';

    if (!normalizedTitle || !normalizedDescription || startingPrice == null || endsAtDurationInHrs == null) {
        throw new ApiError('all fields are required', 400, 'VALIDATION_ERROR');
    }

    if (normalizedTitle.length > 254) throw new ApiError('title should be between 1-254 characters', 400, 'VALIDATION_ERROR');
    if (normalizedDescription.length > 254) throw new ApiError('description should be between 1-254 characters', 400, 'VALIDATION_ERROR');

    const parsedStartingPrice = Number(startingPrice);
    const parsedDurationHrs = Number(endsAtDurationInHrs);

    if (!Number.isFinite(parsedStartingPrice) || !Number.isInteger(parsedStartingPrice) || parsedStartingPrice <= 0) {
        throw new ApiError('starting price must be a positive whole number', 400, 'VALIDATION_ERROR');
    }

    if (!Number.isFinite(parsedDurationHrs) || !Number.isInteger(parsedDurationHrs) || parsedDurationHrs <= 0) {
        throw new ApiError('endsAtDurationInHrs must be a positive whole number', 400, 'VALIDATION_ERROR');
    }

    const MIN_DURATION_HRS = 1; // 1 hour
    const MAX_DURATION_HRS = 24 * 10; // 10 days

    if (parsedDurationHrs < MIN_DURATION_HRS) throw new ApiError('auction must run for at least 1 hour', 400, 'VALIDATION_ERROR');
    if (parsedDurationHrs > MAX_DURATION_HRS) throw new ApiError('auction cannot run longer than 10 days', 400, 'VALIDATION_ERROR');

    const endsAtDate = new Date(Date.now() + (parsedDurationHrs * 60 * 60 * 1000));

    const auction = {
        title: normalizedTitle,
        host_id: hostId,
        description: normalizedDescription,
        starting_price: parsedStartingPrice,
        ends_at: endsAtDate,
        status: 'ACTIVE',
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
        throw new ApiError("auction does not exist", 404, 'AUCTION_DOES_NOT_EXIST');
    }

    if (auctionRecord.status === "ENDED") {
        throw new ApiError("auction has ended", 409 , 'AUCTION_ENDED');
    }

    const response = new ApiResponse(true, 200, "auction fetched", { auction: auctionRecord });
    return res.status(response.statusCode).json(response);
});

// delete auction by id
export const deleteAuction = asyncHandler(async (req, res) => {
    const {id} = req.params;

    // check if the user requesting for deletion owns the auction
    const userId = req.user.id;
    
    let auction;

    try {
        const auctionRows = await db
            .select()
            .from(auctions)
            .where(eq(auctions.id, id));
            
        auction = auctionRows[0]
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    if (!auction) {
        throw new ApiError("auction does not exist", 404, 'AUCTION_DOES_NOT_EXIST');
    }

    if (userId !== auction.host_id) throw new ApiError("user does not have permission to delete the requested auction", 401, 'UNAUTHORIZED');

    // delete the auction

    try {
        await db.delete(auctions).where(eq(auctions.id, id));
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    const response = new ApiResponse(true, 200, null);
    return res.status(response.statusCode).json(response);
});