import asyncHandler from "express-async-handler";
import { desc, eq } from "drizzle-orm";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { db } from "../db/db.js";
import { auctions, bids } from "../db/schema.js";

export const getAuctionBids = asyncHandler(async (req, res) => {
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

    if (!auction) {
        throw new ApiError("auction does not exist", 404, "AUCTION_NOT_FOUND");
    }

    let auctionBids;

    try {
        auctionBids = await db
            .select()
            .from(bids)
            .where(eq(bids.auction_id, id))
            .orderBy(desc(bids.created_at));
    } catch (err) {
        console.error("DB ERROR:", err);
        throw new ApiError(err.message, 500, "DB_ERROR");
    }

    const response = new ApiResponse(true, 200, "bids fetched", {
        auctionId: id,
        bids: auctionBids,
    });

    return res.status(response.statusCode).json(response);
});
