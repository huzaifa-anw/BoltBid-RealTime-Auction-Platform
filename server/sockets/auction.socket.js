const auctionSocketSetup = (io) => {
    // auth middleware for socket 
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) throw new Error('auth token/access token not found');

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // sync form, throws directly
            socket.user = decoded;
            next();
        } catch (err) {
            throw new Error('access token could not be verified',);
        }
    })

    io.on('connection', (socket) => {

        socket.on('join-auction', (auctionId) => {
            socket.join(`auction:${auctionId}`);
        })

        socket.on('leave-auction', (auctionId) => {
            socket.leave(`auction:${auctionId}`);
        })

        socket.on('place-bid', (data) => {
            await handlePlaceBid(io, socket, data);
        })
    })
}

const handlePlaceBid = async (io, socket, data) => {
    try {
        // Validate data
        const {auctionId, bidderId, ammount} = data;

        // Check authentication

        // Start transaction

        // Fetch auction

        // Validate auction state

        // Validate bid amount

        // Insert bid

        // Update auction

        // Commit transaction

        // Broadcast to everyone in the room
    } catch (e) {
        socket.emit('place-bid-error', {
            message: e.message
        });
    }
}

export default auctionSocketSetup;