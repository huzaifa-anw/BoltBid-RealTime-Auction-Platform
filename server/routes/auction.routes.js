import { Router } from "express";

const auctionRouter = Router();

auctionRouter.post('/', (req, res) => res.json({msg: 'create an auction'}));
auctionRouter.get('/', (req, res) => res.json({msg: 'get all auctions'}));
auctionRouter.get('/:id', (req, res) => res.json({msg: 'get a single auction'}));

export default auctionRouter;