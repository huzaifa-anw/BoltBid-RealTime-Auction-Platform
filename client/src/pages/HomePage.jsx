import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import Sidebar from "../components/Sidebar";
import AuctionCard from "../components/AuctionCard";
import axios from "axios"

export default function HomePage() {

    let navigate = useNavigate();

    // STATES

    const [activeView, setActiveView] = useState("browse");

    // profile data
    const [profile, setProfile] = useState({});
    const [profileError, setProfileError] = useState(false);

    // ongoing auctions
    const [auctions, setAuctions] = useState([]);
    const [auctionsError, setAuctionsError] = useState(false);
    const [auctionsErrorMessage, setAuctionsErrorMessage] = useState('')

    // update modal state
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState(null);
    const [extensionHours, setExtensionHours] = useState('');
    const [updateError, setUpdateError] = useState('');

    // create auction form state
    const [newAuction, setNewAuction] = useState({
        title: '',
        description: '',
        startingPrice: '',
        durationHours: '',
        imageUrl: '',
    });
    const [newAuctionFormError, setNewAuctionFormError] = useState('');

    const handleNewAuctionChange = (e) => {
        const { name, value } = e.target;
        setNewAuction((prev) => ({ ...prev, [name]: value }));

        if (newAuctionFormError) {
            setNewAuctionFormError('');
        }
    };

    const handleCreateAuction = async (e) => {
        e.preventDefault();

        const trimmedTitle = newAuction.title.trim();
        const trimmedDescription = newAuction.description.trim();
        const trimmedImageUrl = newAuction.imageUrl.trim();
        const parsedStartingPrice = Number(newAuction.startingPrice);
        const parsedDurationHours = Number(newAuction.durationHours);

        if (!trimmedTitle || !trimmedDescription || !trimmedImageUrl || newAuction.startingPrice === '' || newAuction.durationHours === '') {
            setNewAuctionFormError('all fields are required, (Title, Description, Starting Price, Image URL, Duration)');
            return;
        }

        if (trimmedTitle.length > 254) {
            setNewAuctionFormError('title should be between 1-254 characters');
            return;
        }

        if (trimmedDescription.length > 254) {
            setNewAuctionFormError('description should be between 1-254 characters');
            return;
        }

        if (!Number.isFinite(parsedStartingPrice) || !Number.isInteger(parsedStartingPrice) || parsedStartingPrice <= 0) {
            setNewAuctionFormError('starting price must be a positive whole number');
            return;
        }

        if (!Number.isFinite(parsedDurationHours) || !Number.isInteger(parsedDurationHours) || parsedDurationHours <= 0) {
            setNewAuctionFormError('endsAtDurationInHrs must be a positive whole number');
            return;
        }

        if (parsedDurationHours < 1) {
            setNewAuctionFormError('auction must run for at least 1 hour');
            return;
        }

        if (parsedDurationHours > 24 * 10) {
            setNewAuctionFormError('auction cannot run longer than 10 days');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/api/v1/auctions',
                {
                    title: trimmedTitle,
                    description: trimmedDescription,
                    startingPrice: parsedStartingPrice,
                    imageURL: trimmedImageUrl,
                    endsAtDurationInHrs: parsedDurationHours,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setNewAuction({ title: '', description: '', startingPrice: '', durationHours: '', imageUrl: '' });
                setNewAuctionFormError('');
                setAuctionsError(false);
                setAuctionsErrorMessage('');
                setActiveView('browse');
                getAuctions();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Unable to create auction at the moment';
            setNewAuctionFormError(errorMessage);
        }
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
                console.log(response.data.data)
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
                console.dir(auctionsArray)

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

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:3000/api/v1/auctions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.dir(response);
            setAuctions(prev => prev.filter(auction => auction.id !== id));
        } catch (e) {
            console.log("an error occured");
            console.error(e);
            alert('Could not delete auction, check console for details')
        }
    }

    const openUpdateModal = (id) => {
        setSelectedAuctionId(id);
        setExtensionHours('');
        setUpdateError('');
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedAuctionId(null);
        setExtensionHours('');
        setUpdateError('');
    };

    const handleUpdateModalSubmit = async (e) => {
        e.preventDefault();

        const parsedHours = Number(extensionHours);

        if (!Number.isFinite(parsedHours) || !Number.isInteger(parsedHours) || parsedHours <= 0) {
            setUpdateError('Please enter a positive whole number of hours.');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `http://localhost:3000/api/v1/auctions/${selectedAuctionId}`,
                { extendByHours: parsedHours },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.data.success) {
                closeUpdateModal();
                getAuctions();
            }
        } catch (e) {
            const errorMessage = e.response?.data?.message || 'Unable to extend auction at the moment.';
            setUpdateError(errorMessage);
        }
    }

    const handleLogout = (e) => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-[#111827] text-[#F9FAFB]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar userName={profile.name || "Guest User"} profileError={profileError} activeView={activeView} setActiveView={setActiveView} handleLogout={handleLogout} />

                <main className="flex-1 p-6 lg:p-8 min-w-0">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-[#22D3EE]">Dashboard</p>
                            <h1 className="mt-1 text-3xl font-semibold text-[#F9FAFB]">
                                {activeView === 'create' ? 'Create a new auction' : 'Browse ongoing auctions'}
                            </h1>
                        </div>
                        <img src="/boltbid.webp" alt="BoltBid logo" className="h-16 w-auto" />
                        <div className="rounded-2xl border border-[#22D3EE]/20 bg-[#1F2937] px-4 py-3 text-sm text-slate-300">
                            <span className="font-medium text-[#22D3EE]">{auctions.length}</span> live listings available
                        </div>
                    </div>

                    <div className={`grid gap-5 ${activeView === 'create' ? 'justify-items-center' : 'lg:grid-cols-[1fr_420px]'}`}>
                        {activeView !== 'create' && (
                            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {auctionsError ?
                                    <p className="mt-2 text-lg text-red-400">{auctionsErrorMessage}</p>
                                    :
                                    auctions.map((auction) => (
                                        <AuctionCard 
                                            key={auction.id}
                                            id={auction.id}
                                            title={auction.title} 
                                            description={auction.description}
                                            highestBid={auction.highest_bid} 
                                            imageURL={auction.image_url}
                                            endsAt={auction.ends_at}
                                            hostId={auction.host_id}
                                            profileId={profile.id}
                                            handleDelete={handleDelete}
                                            handleOpenUpdateModal={openUpdateModal}
                                        />
                                    ))
                                }
                            </section>
                        )}

                        {isUpdateModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                                <div className="w-full max-w-md rounded-3xl bg-[#111827] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#F9FAFB]">Extend auction duration</h2>
                                            <p className="text-sm text-slate-400">Enter the number of hours to extend this auction.</p>
                                        </div>
                                        <button onClick={closeUpdateModal} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
                                            Close
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdateModalSubmit} className="space-y-4">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Extension hours
                                            <input
                                                type="number"
                                                min="1"
                                                value={extensionHours}
                                                onChange={(e) => { setExtensionHours(e.target.value); if (updateError) setUpdateError(''); }}
                                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#1F2937] px-4 py-3 text-white outline-none transition focus:border-[#22D3EE]"
                                                placeholder="Enter hours to extend"
                                            />
                                        </label>

                                        {updateError && (
                                            <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                                {updateError}
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                            <button type="button" onClick={closeUpdateModal} className="rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800">
                                                Cancel
                                            </button>
                                            <button type="submit" className="rounded-2xl bg-[#22D3EE] px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#38bdf8]">
                                                Extend auction
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
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

                                    {newAuctionFormError && (
                                        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                            {newAuctionFormError}
                                        </p>
                                    )}

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