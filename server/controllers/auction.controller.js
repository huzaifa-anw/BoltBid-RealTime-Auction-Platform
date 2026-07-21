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
        throw new ApiError("auction does not exist", 404, 'AUCTION_NOT_FOUND');
    }

    if (auctionRecord.status === "ENDED") {
        throw new ApiError("auction has ended", 409 , 'AUCTION_ENDED');
    }

    const response = new ApiResponse(true, 200, "auction fetched", { auction: auctionRecord });
    return res.status(response.statusCode).json(response);
});

// update auction 
export const updateAuction = asyncHandler(async (req, res) => {
    const hostId = req.user.id;
    const allowedField = 'extendByHours';

    const requestFields = Object.keys(req.body);

    const invalidFields = requestFields.filter(field => {
        return field !== allowedField;
    })

    if (invalidFields.length > 0) throw new ApiError(
        `Invalid field(s): ${invalidFields.join(", ")}`,
        400,
        "VALIDATION_ERROR"
    );

    const { extendByHours } = req.body;
    const parsedExtendByHours = Number(extendByHours);
    const { id } = req.params;  

    let auction;

    try {
        const auctionRows = await db
            .select()
            .from(auctions)
            .where(eq(auctions.id, id));

        auction = auctionRows[0];
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    if (!auction) throw new ApiError('auction doesnt exist', 404, 'AUCTION_NOT_FOUND');

    if (auction.host_id !== hostId) throw new ApiError("user does not have permission to update the requested auction", 403, 'FORBIDDEN')

    if (auction.status === "ENDED") {
        throw new ApiError("auction has ended, cannot extend auction duration after it has ended", 409 , 'AUCTION_ENDED');
    }

    if (!Number.isFinite(parsedExtendByHours) || !Number.isInteger(parsedExtendByHours) || parsedExtendByHours <= 0) {
        throw new ApiError('extension hours should be a positive whole number greater than 0', 400, 'VALIDATION_ERROR');
    }

    const MAX_DURATION_HRS = 24 * 10; // 10 days

    const maxEndsAt = new Date(
        auction.created_at.getTime() + MAX_DURATION_HRS * 60 * 60 * 1000
    );

    const newEndsAt = new Date(
        auction.ends_at.getTime() + parsedExtendByHours * 60 * 60 * 1000
    );

    if (newEndsAt > maxEndsAt) {
        throw new ApiError(
            "Auction duration cannot exceed 10 days from creation.",
            400,
            "VALIDATION_ERROR"
        );
    }

    let updatedAuction;
    
    try {
        const updatedAuctionRows = await db.update(auctions)
            .set({ends_at: newEndsAt})
            .where(eq(auctions.id, id))
            .returning();

        updatedAuction = updatedAuctionRows[0];
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    const response = new ApiResponse(true, 200, 'auction updated successfully', updatedAuction);
    return res.status(response.statusCode).json(response);

})

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
        throw new ApiError("auction does not exist", 404, 'AUCTION_NOT_FOUND');
    }

    if (userId !== auction.host_id) throw new ApiError("user does not have permission to delete the requested auction", 403, 'FORBIDDEN');

    // delete the auction
    try {
        await db.delete(auctions).where(eq(auctions.id, id));
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    const response = new ApiResponse(true, 204, null);
    return res.status(response.statusCode).json(response);
});