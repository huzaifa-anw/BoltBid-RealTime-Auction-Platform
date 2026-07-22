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
        const {auctionId, bidderId, amount} = data;

        if (!auctionId || !bidderId || !amount) throw Error("all fields are required (auctionId, bidderId, ammount)");

        // Check authentication
        if (bidderId != socket.user.id) throw Error("cannot place bid on behalf of other's")

        // Start transaction
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
            // auction = {
            //   id: '93e4a406-587a-4667-8220-a99489753d1b',
            //   title: 'A really comfy bed',
            //   host_id: 'e12e151b-2319-4b1d-82fd-2f834c70e6ee',
            //   description: 'just a comfy and cozy bed',
            //   starting_price: 15000,
            //   highest_bid: null,
            //   highest_bidder_id: null,
            //   ends_at: '2026-07-19 00:34:28.22+00',
            //   created_at: '2026-07-17 15:34:26.834212+00',
            //   updated_at: '2026-07-17 15:34:26.834212+00',
            //   image_url: '...',
            //   status: 'ACTIVE'
            // }

            // Validate auction state

            // Validate bid amount

            // Insert bid

            // Update auction

            // Commit transaction
        })

        // Broadcast to everyone in the room
    } catch (e) {
        socket.emit('place-bid-error', {
            message: e.message
        });
    }
}

export default auctionSocketSetup;