import { FaSearch, FaPlus, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { id: "browse", label: "Browse", icon: <FaSearch /> },
  { id: "create", label: "Create Auction", icon: <FaPlus /> },
  { id: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

export default function Sidebar({ userName, profileError, activeView, setActiveView}) {
  const initials = (userName || "Guest User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <aside className="h-full border-b border-white/10 bg-[#1F2937]/90 p-6 backdrop-blur lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 text-2xl font-semibold text-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            {initials}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#F9FAFB]">{userName}</h2>
          <p className="mt-1 text-sm text-slate-400">Online bidder</p>
          {profileError && (
            <p className="mt-2 text-lg text-red-400">Unable to load profile details.</p>
          )}
        </div>

        <nav className="mt-10 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "border-[#22D3EE] bg-[#22D3EE]/15 text-[#22D3EE]"
                    : "border-transparent bg-[#111827] text-slate-300 hover:border-[#22D3EE]/40 hover:text-[#F9FAFB]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-[#22D3EE]/20 bg-[#111827] p-4 text-sm text-slate-300">
          <p className="font-medium text-[#F9FAFB]">Live auctions</p>
          <p className="mt-2 text-slate-400">Browse the hottest bids in real time.</p>
        </div>
      </div>
    </aside>
  );
}
