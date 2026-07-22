import express from 'express';
import {createServer} from 'http'
import { Server } from "socket.io";
import 'dotenv/config';
import authRouter from './routes/auth.routes.js';
import auctionRouter from './routes/auction.routes.js';
import userRouter from './routes/user.routes.js';
import logger from './middlewares/logger.middleware.js'
import errorHandler from './middlewares/errorHandler.middleware.js'
import auctionSocketSetup from './sockets/auction.socket.js';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    credentials: true,
  },
});
auctionSocketSetup(io);

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

// Logging Middleware
app.use(logger);

// Router Mounts
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/auctions', auctionRouter);
app.use('/api/v1/users', userRouter);

app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`BoltBid server is running on port: ${PORT}`);
})
