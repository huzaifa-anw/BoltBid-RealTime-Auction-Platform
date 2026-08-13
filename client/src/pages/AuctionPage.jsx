import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from 'axios'

export default function AuctionPage() {
    let { id } = useParams();

    // states
    const [auction, setAuction] = useState({});
    const [auctionError, setAuctionError] = useState(false);

    const [bidValue, setBidValue] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState('');
    
    const [bids, setBids] = useState([]);
    const [highestBid, setHighestBid] = useState('');
    const [bidsError, setErrorBids] = useState(false);

    const getAuction = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auctions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.dir(response);
            if (response.data.success) {
                setAuction(response.data.data.auction)
                setHighestBid(response.data.data.auction.highest_bid)
            }
        } catch (e) {
            console.log('----an error occurred ------')
            console.dir(e);
            setAuctionError('Unable to fetch auction at the moment');
        }
    }

    const getBids = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auctions/${id}/bids`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.dir(response);
            if (response.data.success) {
                console.log(response.data.data)
                setBids(response.data.data.bids)
            }
        } catch (e) {
            console.log('----an error occurred ------')
            console.dir(e);
            setAuctionError('Unable to fetch bids at the moment');
        }
    }


    // useEffect

    useEffect(() => {
        getAuction();
        getBids();
    }, [])

    function handlePlaceBid(e) {
        e.preventDefault();

        const val = Number(bidValue);
        const minimumBid = highestBid !== null ? highestBid + (highestBid * 0.01) : auction.starting_price + (auction.starting_price * 0.01);

        setBidError('');
        setBidSuccess('');

        if (!Number.isFinite(val) || val <= 0) {
            setBidError('Enter a valid numeric amount greater than 0.');
            return;
        }

        if (val <= highestBid) {
            setBidError(`Your bid must be greater than the current highest bid (${highestBid}).`);
            return;
        }

        if (val <= auction.starting_price && highestBid === auction.starting_price) {
            setBidError(`Your bid must be greater than the starting price (${auction.starting_price}).`);
            return;
        }

        setBidSuccess(`Bid placed: $${val} — (dummy action, no state change)`);
        setBidValue('');
    }

    return (
        <div className="min-h-screen bg-[#111827] px-6 py-10 text-slate-50">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Left column */}

                <section className="overflow-hidden rounded-3xl border border-white/5 bg-slate-800">
                    <div className="relative">
                        <img
                            src={auction.image_url}
                            alt={auction.title}
                            className="h-[550px] w-full object-cover"
                        />

                        {<div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />}
                        {highestBid && 
                            <div className="absolute bottom-8 left-8 rounded-2xl border border-cyan-400/30 bg-slate-950/80 px-6 py-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    Current Bid
                                </p>

                                <h2 className="text-4xl text-cyan-400">
                                    ${highestBid}
                                </h2>
                            </div>
                        }
                    </div>

                    <div className="space-y-8 p-8">
                        <div>
                            <h1 className="text-5xl tracking">
                                {auction.title}
                            </h1>

                            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                                {auction.description}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl bg-slate-950 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Starting Price
                                </p>

                                <p className="mt-3 text-3xl font-bold">
                                    ${auction.starting_price}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-950 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Owner
                                </p>

                                <p className="mt-3 text-2xl font-bold">
                                    {auction.host_name}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Current Bid
                                </p>

                                <p className="mt-3 text-3xl text-cyan-400">
                                    ${highestBid ?? ' ___ '}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right column */}

                <aside className="space-y-6">
                    {/* Bid panel */}

                    <div className="sticky top-6 rounded-3xl border border-white/5 bg-slate-800 p-6">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                            Highest Bid
                        </p>

                        <h2 className="mt-2 text-5xl text-cyan-400">
                            ${highestBid ?? auction.starting_price}
                        </h2>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold">Place a Bid</h3>

                            <form
                                onSubmit={handlePlaceBid}
                                className="mt-4 space-y-4"
                            >
                                <input
                                    type="number"
                                    value={bidValue}
                                    onChange={(e) => setBidValue(e.target.value)}
                                    step={
                                        highestBid
                                            ? highestBid + (highestBid * 0.01)
                                            : auction.starting_price + (auction.starting_price * 0.01)
                                    }
                                    placeholder={
                                        highestBid
                                            ? `Enter > ${highestBid + (highestBid * 0.01)}`
                                            : `Enter > ${auction.starting_price + (auction.starting_price * 0.01)}`
                                    }
                                    min={
                                        highestBid
                                            ? highestBid + (highestBid * 0.01)
                                            : auction.starting_price + (auction.starting_price * 0.01)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-4 text-lg outline-none transition focus:border-cyan-400"
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-cyan-400 py-4 text-slate-900 transition hover:scale-[1.02]"
                                >
                                    PLACE BID
                                </button>
                            </form>

                            <p className="mt-4 text-sm text-slate-400">
                                Minimum allowed: $
                                {highestBid
                                    ? highestBid + (highestBid * 0.01)
                                    : auction.starting_price + (auction.starting_price * 0.01)
                                }
                            </p>

                            {bidError && (
                                <div className="mt-3 text-sm text-red-500">
                                    {bidError}
                                </div>
                            )}

                            {bidSuccess && (
                                <div className="mt-3 text-sm text-green-500">
                                    {bidSuccess}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent bids */}

                    <div className="rounded-3xl border border-white/5 bg-slate-800 p-6">
                        <h3 className="text-xl font-bold">Recent Bids</h3>

                        <div className="mt-6 border-l border-cyan-400/20 pl-6">
                            {bids.length > 0 ? bids.map((bid) => (
                                    <div key={bid.id} className="mb-8 last:mb-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold">
                                                    {bid.name}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {bid.time}
                                                </p>
                                            </div>

                                            <p className="text-xl text-cyan-400">
                                                ${bid.amount}
                                            </p>
                                        </div>
                                    </div>
                                )) : <h6>No bids at the moment</h6>}
                        </div>

                        {bidsError && 
                            <div className="mt-6 border-l border-cyan-400/20 pl-6"> 
                                bidsError
                            </div>
                        }
                    </div>
                </aside>
            </div>
        </div>
    );
}