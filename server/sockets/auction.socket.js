import { sql } from "drizzle-orm";
import { db } from "../db/db.js";
import jwt from 'jsonwebtoken'

const auctionSocketSetup = (io) => {
    // auth middleware for socket 
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Access token not found"));

        try {
            console.log(token);
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // sync form, throws directly
            socket.user = decoded;
            next();
        } catch (err) {
            console.error(err);
            return next(new Error("Invalid access token"));
        }
    })

    io.on('connection', (socket) => {

        socket.on('join-auction', (auctionId) => {
            socket.join(`auction:${auctionId}`);
        })

        socket.on('leave-auction', (auctionId) => {
            socket.leave(`auction:${auctionId}`);
        })

        socket.on('place-bid', async (data) => {
            await handlePlaceBid(io, socket, data);
        })
    })
}

const handlePlaceBid = async (io, socket, data) => {
    try {
        // Validate data
        const {auctionId, amount} = data;

        if (!auctionId || typeof amount !== 'number' || Number.isNaN(amount)) throw Error("all fields are required (auctionId, ammount)");

        // Check authentication
        const bidderId = socket.user.id;

        // Start transaction
        let response;
        await db.transaction(async (tx) => {
            const result = await tx.execute(sql`
                SELECT *
                FROM auctions
                WHERE id = ${auctionId}
                FOR UPDATE;
            `);

            console.log(result.rows[0]);
            // Fetch auction
            const auction = result.rows[0];

            // Validate auction state
            if(!auction) throw Error("auction does not exist")

            if (auction.host_id === bidderId) throw Error("cannot bid on your own auction");

            if (auction.status !== 'ACTIVE') throw Error("auction has ended");

            const hasExpired = new Date(auction.ends_at) <= new Date();
            if (hasExpired) throw Error("auction has ended")

            const currentPrice = auction.highest_bid ?? auction.starting_price;

            if (amount <= currentPrice)
            throw new Error("Bid must be higher than current price");

            const bid = {
                auction_id: auctionId,
                bidder_id: bidderId,
                amount
            }
        
            const dbResponse = await tx.insert(bids).values(bid).returning();   
            response = dbResponse[0];

            await tx.update(auctions)
            .set({
                highest_bid: amount,
                highest_bidder_id: bidderId,
            })
            .where(eq(auctions.id, auctionId)) 
            // transaction commits
        })

        // broadcast to all sockets in room (finally :) )
        io.in(`auction:${auctionId}`).emit('bid-placed', 
            {
                bid: response,
            }
        );

    } catch (e) {
        socket.emit('place-bid-error', {
            message: e.message
        });
    }
}

export default auctionSocketSetup;