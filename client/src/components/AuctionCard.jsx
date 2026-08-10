import { FaClock, FaGavel, FaUserCircle, FaEdit } from "react-icons/fa";

export default function AuctionCard({ id, title, staringPrice, endsAt, highestBid, description, imageURL, hostId, profileId, handleDelete, handleOpenUpdateModal }) {

    function getTimeRemaining(endsAt) {
        const difference = new Date(endsAt) - new Date();

        if (difference <= 0) {
            return "Ended";
        }

        const totalHours = Math.floor(difference / (1000 * 60 * 60));

        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        return `${hours}h`;
    }

    const timeStr = getTimeRemaining(endsAt);
    const isHost = hostId && profileId && hostId === profileId;

    return (
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#1F2937] shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-[#22D3EE]/40">
            <img src={imageURL} alt={title} className="h-44 w-full object-cover" />

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{title}</h3>
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        Live
                    </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>

                <div className="mt-5 rounded-2xl bg-[#111827] p-4">
                    <p className="text-sm text-slate-400">Current bid</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-2xl font-semibold text-[#F9FAFB]">${highestBid || ' ___ '}</span>
                        <span className="text-sm text-slate-400">{timeStr === 'Ended' ? 'Ended' : `Ends in ${timeStr}`}</span>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                    {isHost ? (
                        <>
                            <button onClick={() => handleOpenUpdateModal(id)} className="flex items-center gap-2 rounded-xl border border-[#22D3EE] bg-transparent px-3 py-2 text-sm font-medium text-[#22D3EE] transition hover:bg-[#22D3EE]/10">
                                <FaEdit /> Update
                            </button>
                            <button onClick={() => handleDelete(id)} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                                Delete
                            </button>
                        </>
                    ) : (
                        <button className="flex items-center gap-2 rounded-xl bg-[#22D3EE] px-3 py-2 text-sm font-medium text-[#111827] transition hover:opacity-90">
                            <FaGavel /> Bid Now
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
