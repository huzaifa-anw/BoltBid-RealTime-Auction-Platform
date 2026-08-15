import { sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { eq } from "drizzle-orm";
import { bids, auctions } from "../db/schema.js";
import jwt from 'jsonwebtoken'

const auctionSocketSetup = (io) => {
    // auth middleware for socket 
    io.use(async (socket, next) => {
        console.log('socket auth middleware running')
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Access token not found"));

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // sync form, throws directly
            socket.user = decoded;
            next();
        } catch (err) {
            console.error(err);
            return next(new Error("Invalid access token"));
        }
    })

    io.on('connection', (socket) => {

        console.log('socket connectedddd __________')

        socket.on('join-auction', (auctionId) => {
            console.log('join auction event recieved on server')
            socket.join(`auction:${auctionId}`);
        })

        socket.on('leave-auction', (auctionId) => {
            socket.leave(`auction:${auctionId}`);
        })

        socket.on('place-bid', async (data) => {
            console.log('place bid event recieved on server')
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

        const normalizedResponse = {
            bid: {
                id: response.id,
                amount: response.amount,
                createdAt: response.created_at,
            },
            bidderId,
            bidderName: socket.user.name,
        }

        console.log('logging response (socket)');
        console.dir(normalizedResponse);
        // broadcast to all sockets in room (finally :) )
        io.in(`auction:${auctionId}`).emit('bid-placed', 
            normalizedResponse
        );

    } catch (e) {
        console.log(e);
        socket.emit('place-bid-error', {
            message: e.message
        });
    }
}

export default auctionSocketSetup;