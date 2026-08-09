import { FaClock, FaGavel, FaUserCircle } from "react-icons/fa";

export default function AuctionCard({ title, price, bidder, endsIn, category, description, image }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#1F2937] shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-[#22D3EE]/40">
      <img src={image} alt={title} className="h-44 w-full object-cover" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#22D3EE]">{category}</p>
            <h3 className="mt-2 text-xl font-semibold text-[#F9FAFB]">{title}</h3>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Live
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <FaUserCircle className="text-[#22D3EE]" />
          <span>Hosted by {bidder}</span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>

        <div className="mt-5 rounded-2xl bg-[#111827] p-4">
          <p className="text-sm text-slate-400">Current bid</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-semibold text-[#F9FAFB]">${price}</span>
            <span className="text-sm text-slate-400">Ends in</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <FaClock /> {endsIn}
          </span>
          <button className="flex items-center gap-2 rounded-xl bg-[#22D3EE] px-3 py-2 font-medium text-[#111827] transition hover:opacity-90">
            <FaGavel /> Bid Now
          </button>
        </div>
      </div>
    </article>
  );
}
