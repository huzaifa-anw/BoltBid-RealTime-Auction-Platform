import { Router } from "express";

const auctionRouter = Router();

// auctions
auctionRouter.get('/', (req, res) => res.json({msg: 'get all auctions'}));

auctionRouter.post('/', (req, res) => res.json({msg: 'create an auction'}));
auctionRouter.get('/:id', (req, res) => res.json({msg: 'get the specified auction'}));
auctionRouter.patch('/:id', (req, res) => res.json({msg: 'update the specified auction'}));
auctionRouter.delete('/:id', (req, res) => res.json({msg: 'delete the specified auction'}));
// bids (separate controller from auctions)
auctionRouter.post('/:id/bids', (req, res) => res.json({msg: 'make a bid'}));
auctionRouter.get('/:id/bids', (req, res) => res.json({msg: 'get all bids for the given auction id'}))

export default auctionRouter;