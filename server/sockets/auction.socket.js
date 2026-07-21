const auctionSocketSetup = (io) => {
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
        const {}
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