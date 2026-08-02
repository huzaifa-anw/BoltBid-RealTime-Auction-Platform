// Landing.jsx
import { motion } from "framer-motion";
import {
    FaBolt,
    FaGavel,
    FaArrowRight,
    FaClock,
    FaShieldAlt,
    FaUsers,
} from "react-icons/fa";
import { Link } from "react-router";
import { Radio,Handshake,Trophy } from 'lucide-react';

export default function Landing() {
    const features = [
        {
            icon: <FaBolt />,
            title: "Real-Time Bidding",
            desc: "Socket powered auctions that update instantly.",
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure Marketplace",
            desc: "Authentication and protected transactions built in.",
        },
        {
            icon: <FaUsers />,
            title: "Competitive",
            desc: "Compete with bidders around the world in seconds.",
        },
    ];

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#111827] text-white relative font-['Inter']">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-[#111827] to-slate-950" />

            <div className="absolute w-96 h-96 bg-cyan-400/20 blur-[130px] rounded-full -top-24 -left-24 animate-pulse" />

            <div className="absolute w-80 h-80 bg-cyan-300/10 blur-[120px] rounded-full bottom-0 right-0 animate-pulse" />

            {/* Grid */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Navbar */}
            <nav className="relative z-20 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    <div className="flex items-center">
                        <img src="./boltbid.webp" className="h-20" />
                    </div>

                    <div className="flex gap-3">
                        <Link to="/login">
                            <button className="border border-cyan-400 px-5 py-2 rounded-xl hover:bg-cyan-400 hover:text-black transition">
                                Login
                            </button>
                        </Link>

                        <Link to="/signup">
                            <button className="bg-cyan-400 text-black font-semibold px-5 py-2 rounded-xl hover:scale-105 transition">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-20 px-8 pt-20 pb-32">

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .8 }}
                    >

                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-cyan-300 mb-8">
                            
                            Live Marketplace
                        </div>

                        <h1 className="font-['Inter'] text-6xl lg:text-7xl font-bold leading-tight">

                            Win the Bid.
                            <br />

                            <span className="text-cyan-400">
                                Before Anyone Else.
                            </span>

                        </h1>

                        <p className="mt-8 text-slate-300 text-lg leading-8 max-w-xl">

                            BoltBid is the lightning-fast real-time auction marketplace
                            where every second matters. Buy, sell and compete with live
                            bidding powered by WebSockets.

                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">

                            <Link to="/signup">
                                <button className="bg-cyan-400 text-black font-semibold px-8 py-4 rounded-2xl hover:shadow-[0_0_40px_rgba(34,211,238,.45)] transition flex items-center gap-2">

                                    Sign Up

                                    <FaArrowRight />

                                </button>
                            </Link>


                            <Link to="/login">
                                <button className="border border-slate-600 px-8 py-4 rounded-2xl hover:border-cyan-400 transition">

                                    Login

                                </button>
                            </Link>

                        </div>

                        <div className="flex gap-10 mt-14">

                            <div>
                                <h2 className="text-8xl mx-8 py-2 font-bold text-cyan-400">
                                    <Radio size={30} />
                                </h2>
                                <p className="text-slate-400">
                                    Compete Live
                                </p>
                            </div>

                            <div>
                                <h2 className="text-3xl mx-8 py-2 font-bold text-cyan-400">
                                    <Handshake size={30} />
                                </h2>
                                <p className="text-slate-400">
                                    Find Deals
                                </p>
                            </div>

                            <div>
                                <h2 className="text-3xl mx-8 py-2 font-bold text-cyan-400">
                                    <Trophy size={30} />
                                </h2>
                                <p className="text-slate-400">
                                    Win Instantly
                                </p>
                            </div>

                        </div>

                    </motion.div>

                    {/* Right */}
                    <div
                        className="relative flex justify-center"
                    >

                        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

                            <div className="flex justify-between">

                                <div>

                                    <p className="text-slate-400">
                                        LIVE AUCTION
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        MacBook Pro M3
                                    </h2>

                                </div>

                                <div className="bg-green-500/20 text-green-300 px-3 py-2 rounded-xl h-fit animate-pulse">
                                    &#x2B58; LIVE
                                </div>

                            </div>

                            <div className="mt-10">

                                <p className="text-slate-400">
                                    Current Bid
                                </p>

                                <h1 className="text-5xl font-bold text-cyan-400">
                                    $1,240
                                </h1>

                            </div>

                            <div className="mt-10 flex justify-between">

                                <div>

                                    <p className="text-slate-400">
                                        Highest Bidder
                                    </p>

                                    <p className="font-semibold">
                                        Huzaifa
                                    </p>

                                </div>

                                <div>

                                    <p className="text-slate-400">
                                        Ends In
                                    </p>

                                    <div className="flex items-center gap-2 text-orange-300">
                                        <FaClock />
                                        00:00:18
                                    </div>

                                </div>

                            </div>
                            <Link to="/login">
                                <button className="w-full mt-10 bg-cyan-400 text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition">

                                    Place Bid

                                </button>
                            </Link>

                        </div>
                    </div>

                </div>

            </section>

            {/* Features */}

            <section className="relative z-20 px-8 pb-28">

                <div className="max-w-7xl mx-auto">

                    <h2 className="text-center text-4xl font-bold font-['Inter'] mb-14">

                        Built For Modern Auctions

                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        {features.map((feature, i) => (

                            <motion.div
                                whileHover={{
                                    y: -8,
                                }}
                                key={i}
                                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
                            >

                                <div className="text-4xl text-cyan-400">

                                    {feature.icon}

                                </div>

                                <h3 className="text-2xl font-bold mt-6">

                                    {feature.title}

                                </h3>

                                <p className="text-slate-400 mt-4 leading-7">

                                    {feature.desc}

                                </p>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="relative z-20 px-8 pb-28">

                <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-r from-cyan-500/20 to-cyan-300/10 border border-cyan-400/20 backdrop-blur-xl p-14 text-center">

                    <h2 className="text-5xl font-bold font-['Inter']">

                        Ready To Win?

                    </h2>

                    <p className="text-slate-300 mt-6 max-w-2xl mx-auto">

                        Join BoltBid today and experience real-time auctions built
                        for speed, competition and opportunity.

                    </p>

                    <Link to="/signup">
                        <button className="mt-10 bg-cyan-400 text-black font-bold px-10 py-4 rounded-2xl hover:scale-105 transition">

                            Create Your Account

                        </button>
                    </Link>

                </div>

            </section>

            {/* Footer */}

            <footer className="relative z-20 border-t border-white/10 py-8 text-center text-slate-500">

                © {new Date().getFullYear()} BoltBid. Built for real-time bidding.

            </footer>

        </div>
    );
}