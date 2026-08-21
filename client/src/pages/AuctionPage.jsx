import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import axios from 'axios'
import { formatDistanceToNow } from "date-fns";
import { IoIosWarning } from "react-icons/io";

export default function AuctionPage() {
    let { id } = useParams();

    const socketRef = useRef(null);

    // states
    const [auction, setAuction] = useState({});
    const [auctionError, setAuctionError] = useState(false);

    const [bidValue, setBidValue] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState('');

    const [profile, setProfile] = useState({});
    const [profileError, setProfileError] = useState(false);
    
    const [bids, setBids] = useState([]);
    const [highestBid, setHighestBid] = useState(null);
    const [bidsError, setErrorBids] = useState(false);

    const getAuction = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auctions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                console.log('loggin auction (api)......');
                console.dir(response.data.data.auction);
                setAuction(response.data.data.auction);
                setHighestBid(response.data.data.auction.highest_bid);
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
            });
            
            if (response.data.success) {
                const normalized = response.data.data.bids.map(b => ({
                    id: b.bidId,
                    amount: b.amount,
                    bidderId: b.bidder.id,
                    bidderName: b.bidder.name,
                    createdAt: b.createdAt,
                }));
                console.log('loggin bids (api)......')
                console.dir(normalized)
                setBids(normalized);
            }
        } catch (e) {
            console.log('----an error occurred ------')
            console.dir(e);
            setAuctionError('Unable to fetch bids at the moment');
        }
    }

    const getProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                console.log(response.data.data)
                setProfile(response.data.data)
            }
        } catch (e) {
            setProfileError(true);
            console.log("an error occured")
            console.dir(e);
        }
    }

    const initializeSocket = () => {
        const token = localStorage.getItem('token');
        socketRef.current = io(`${import.meta.env.VITE_WS_SERVER_URL}`, {
        reconnectionDelayMax: 10000,
        auth: {
            token
        },
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-auction', id)
        })

        socketRef.current.on('bid-placed', (data) => {
            console.log(data)
            setHighestBid(data.bid.amount);
            console.log(typeof data.bid.amount)
            setBids(prev => [{
                id: data.bid.id,
                amount: data.bid.amount,
                bidderId: data.bidderId,
                bidderName: data.bidderName,
                createdAt: data.bid.createdAt,
            }, ...prev]);
        })

        socketRef.current.on('place-bid-error', (data) => {
            setBidError(data.message)   
        })

    }


    // useEffect

    useEffect(() => {
        getAuction();
        getBids();
        initializeSocket();
        getProfile();
    }, [id])

    function handlePlaceBid(e) {
        e.preventDefault();

        const val = Number(bidValue);
        const minimumBid = highestBid !== null ? highestBid + (highestBid * 0.01) : auction.starting_price + (auction.starting_price * 0.01);

        setBidError('');
        setBidSuccess('');

        if (!Number.isFinite(val) || val <= 0 || bidValue === '') {
            setBidError('Enter a valid numeric amount greater than 0.');
            return;
        }

        if (val < minimumBid) {
            setBidError('Invalid bid amount');
            return;
        }

        socketRef.current.emit('place-bid', {auctionId: id, amount: Number(bidValue)})

        setBidSuccess(`Bid placed: $${val}`);
    }

    const isHost = profile.id === auction.host_id;

    if (isHost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white px-6">
                <div className="max-w-2xl text-center">
                    <div className="text-red-400 text-7xl flex items-center justify-center font-extrabold mb-4">
                        <IoIosWarning />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Cannot Bid on Your Own Auction</h1>
                    <p className="text-slate-300 text-lg mb-8">
                        You are the host of this auction. Hosts cannot place bids on their own items.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#111827] px-3 py-6 text-slate-50 sm:px-6 sm:py-10">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                {/* Left column */}

                <section className="min-w-0 overflow-hidden rounded-3xl border border-white/5 bg-slate-800">
                    <div className="relative">
                        <img
                            src={auction.image_url}
                            alt={auction.title}
                            className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[550px]"
                        />

                        {<div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />}
                        {highestBid && 
                            <div className="absolute bottom-4 left-4 rounded-2xl border border-cyan-400/30 bg-slate-950/80 px-4 py-3 backdrop-blur sm:bottom-8 sm:left-8 sm:px-6 sm:py-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    Current Bid
                                </p>

                                <h2 className="text-4xl text-cyan-400">
                                    ${highestBid}
                                </h2>
                            </div>
                        }
                    </div>

                    <div className="space-y-8 p-4 sm:p-8">
                        <div>
                            <h1 className="break-words text-3xl sm:text-5xl">
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

                <aside className="min-w-0 space-y-6">
                    {/* Bid panel */}

                    <div className="rounded-3xl border border-white/5 bg-slate-800 p-4 sm:p-6 lg:sticky lg:top-6">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                            Highest Bid
                        </p>

                        <h2 className="mt-2 text-4xl text-cyan-400 sm:text-5xl">
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
                                    step="any"
                                    value={bidValue}
                                    onChange={(e) => setBidValue(e.target.value)}
                                    placeholder={
                                        highestBid
                                            ? `Suggested: ${Math.trunc(highestBid + (highestBid * 0.01))}`
                                            : `Suggested: ${Math.trunc(auction.starting_price + (auction.starting_price * 0.01))}`
                                    }
                                    min={
                                        highestBid
                                            ? Math.trunc(highestBid + (highestBid * 0.01))
                                            : Math.trunc(auction.starting_price + (auction.starting_price * 0.01))
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
                                Minimum reccommemded: $
                                {highestBid
                                    ? Math.trunc(highestBid + (highestBid * 0.01))
                                    : Math.trunc(auction.starting_price + (auction.starting_price * 0.01))
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

                    <div className="rounded-3xl border border-white/5 bg-slate-800 p-4 sm:p-6">
                        <h3 className="text-xl font-bold">Recent Bids</h3>

                        <div className="mt-6 border-l border-cyan-400/20 pl-4 sm:pl-6">
                            {bids.length > 0 ? bids.map((bid) => (
                                <div key={bid.id} className="mb-8 last:mb-0">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold">{bid.bidderName}</p>
                                            <p className="text-sm text-slate-500">
                                                {formatDistanceToNow(new Date(bid.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-xl text-cyan-400">${bid.amount}</p>
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