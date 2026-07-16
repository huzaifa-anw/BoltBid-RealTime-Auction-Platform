import { Router } from "express";
import { createAuction, getAuction, getAuctions } from "../controllers/auction.controller.js";
import authorize from '../middlewares/authorize.middleware.js'

const auctionRouter = Router();

// auctions
// get all auctions
auctionRouter.get('/', authorize, getAuctions);
// create an auction
auctionRouter.post('/', authorize, createAuction);
// get a specific auction through id
auctionRouter.get('/:id', authorize ,getAuction);
auctionRouter.patch('/:id', (req, res) => res.json({msg: 'update the specified auction'}));
auctionRouter.delete('/:id', (req, res) => res.json({msg: 'delete the specified auction'}));
// bids (separate controller from auctions)
auctionRouter.post('/:id/bids', (req, res) => res.json({msg: 'make a bid'}));
auctionRouter.get('/:id/bids', (req, res) => res.json({msg: 'get all bids for the given auction id'}))

export default auctionRouter;