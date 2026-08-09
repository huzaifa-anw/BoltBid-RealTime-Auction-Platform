import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AuctionCard from "../components/AuctionCard";
import axios from "axios"

const sampleAuctions = [
    {
        title: "MacBook Pro M3",
        price: "1240",
        bidder: "Huzaifa",
        endsIn: "00:18:12",
        category: "Electronics",
        description: "Lightly used laptop with a stunning Retina display and all-day battery life.",
        image: "/boltbid.webp",
    },
    {
        title: "Vintage Rolex",
        price: "8600",
        bidder: "Amina",
        endsIn: "01:02:40",
        category: "Watches",
        description: "Elegant chronograph with a polished steel case and premium leather strap.",
        image: "/boltbid.webp",
    },
    {
        title: "Gaming Chair Pro",
        price: "320",
        bidder: "Nadia",
        endsIn: "00:44:05",
        category: "Furniture",
        description: "Ergonomic gaming chair with lumbar support and premium reclining features.",
        image: "/boltbid.webp",
    },
];

export default function HomePage() {

    // STATES

    const [activeView, setActiveView] = useState("browse");

    // profile data
    const [profile, setProfile] = useState({});
    const [profileError, setProfileError] = useState(false);

    // ongoing auctions
    const [auctions, setAuctions] = useState([]);
    const [auctionsError, setAuctionsError] = useState(false);
    const [auctionsErrorMessage, setAuctionsErrorMessage] = useState('')

    // create auction form state
    const [newAuction, setNewAuction] = useState({
        title: '',
        description: '',
        startingPrice: '',
        durationHours: '',
        imageUrl: '',
    });

    const handleNewAuctionChange = (e) => {
        const { name, value } = e.target;
        setNewAuction((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateAuction = async (e) => {
        e.preventDefault();
        // TODO: wire this to create auction API
        console.log('Creating auction:', newAuction);
        setNewAuction({ title: '', description: '', startingPrice: '', durationHours: '' });
    };

    // API CALL FUNCTIONS
    const getProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                setProfile(response.data.data)
            }
        } catch (e) {
            setProfileError(true);
            console.log("an error occured")
            console.dir(e);
        }
    }

    const getAuctions = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/v1/auctions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                const auctionsArray = response.data.data.auctions;

                if (auctionsArray.length > 0) {
                    setAuctions(auctionsArray)
                }
                else {
                    setAuctionsError(true);
                    setAuctionsErrorMessage('There\'s not any active auctions at the moment')
                }
            }
        } catch (e) {
            setAuctionsError(true);
            setAuctionsErrorMessage('Unable to fetch auctions at the moment')
            console.log("an error occured");
            console.dir(e);
        }
    }


    // USE EFFECTS
    useEffect(() => {
        getProfile()
        getAuctions()
    }, [])

    return (
        <div className="min-h-screen bg-[#111827] text-[#F9FAFB]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar userName={profile.name || "Guest User"} profileError={profileError} activeView={activeView} setActiveView={setActiveView} />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-[#22D3EE]">Dashboard</p>
                            <h1 className="mt-1 text-3xl font-semibold text-[#F9FAFB]">
                                {activeView === 'create' ? 'Create a new auction' : 'Browse ongoing auctions'}
                            </h1>
                        </div>
                        <img src="/boltbid.webp" alt="BoltBid logo" className="h-16 w-auto" />
                        <div className="rounded-2xl border border-[#22D3EE]/20 bg-[#1F2937] px-4 py-3 text-sm text-slate-300">
                            <span className="font-medium text-[#22D3EE]">{sampleAuctions.length}</span> live listings available
                        </div>
                    </div>

                    <div className={`grid gap-5 ${activeView === 'create' ? 'justify-items-center' : 'lg:grid-cols-[1fr_420px]'}`}>
                        {activeView !== 'create' && (
                            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {auctionsError ?
                                    <p className="mt-2 text-lg text-red-400">{auctionsErrorMessage}</p>
                                    :
                                    sampleAuctions.map((auction) => (
                                        <AuctionCard key={auction.title} {...auction} />
                                    ))
                                }
                            </section>
                        )}

                        {activeView === 'create' && (
                            <aside className="w-full max-w-[480px] rounded-3xl border border-[#22D3EE]/20 bg-[#111827] p-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                <h2 className="mb-6 text-2xl font-semibold text-[#F9FAFB]">Auction details</h2>
                                <form className="space-y-5" onSubmit={handleCreateAuction}>
                                    <label className="block text-sm font-medium text-slate-300">
                                        Title
                                        <input
                                            name="title"
                                            value={newAuction.title}
                                            onChange={handleNewAuctionChange}
                                            required
                                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                            placeholder="Enter auction title"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-300">
                                        Description
                                        <textarea
                                            name="description"
                                            value={newAuction.description}
                                            onChange={handleNewAuctionChange}
                                            required
                                            rows={5}
                                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                            placeholder="Describe the item"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-300">
                                        Starting price
                                        <input
                                            name="startingPrice"
                                            type="number"
                                            min="0"
                                            value={newAuction.startingPrice}
                                            onChange={handleNewAuctionChange}
                                            required
                                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                            placeholder="Enter starting price"
                                               />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-300">
                                        Image URL
                                        <input
                                            name="imageUrl"
                                            type="url"
                                            value={newAuction.imageUrl}
                                            onChange={handleNewAuctionChange}
                                            required
                                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                            placeholder="Enter image URL"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-300">
                                        Duration (hours)
                                        <input
                                            name="durationHours"
                                            type="number"
                                            min="1"
                                            value={newAuction.durationHours}
                                            onChange={handleNewAuctionChange}
                                            required
                                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                            placeholder="How many hours until auction ends"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        className="w-full rounded-2xl bg-[#22D3EE] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#38bdf8]"
                                    >
                                        Create auction
                                    </button>
                                </form>
                            </aside>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}