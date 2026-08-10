const navItems = [
  { id: "browse", label: "Browse" },
  { id: "create", label: "Create Auction" },
  { id: "logout", label: "Logout" },
];

export default function Sidebar({ userName, profileError, activeView, setActiveView, handleLogout}) {
  const initials = (userName || "Guest User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <aside className="h-full border-b border-white/10 bg-[#1F2937]/90 p-6 backdrop-blur lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col items-center text-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 text-4xl font-semibold text-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            {initials}
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-[#F9FAFB]">{userName}</h2>
          <p className="mt-2 text-base text-slate-400">Online bidder</p>
          {profileError && (
            <p className="mt-3 text-lg text-red-400">Unable to load profile details.</p>
          )}
        </div>

        <nav className="mt-12 flex w-full flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                    if (item.id === "logout") {
                        handleLogout();
                        return;
                    }

                    setActiveView(item.id);
                }}
                className={`w-full max-w-[240px] rounded-2xl border px-6 py-5 text-center text-lg font-semibold transition ${
                  isActive
                    ? "border-[#22D3EE] bg-[#22D3EE]/15 text-[#22D3EE]"
                    : "border-transparent bg-[#111827] text-slate-300 hover:border-[#22D3EE]/40 hover:text-[#F9FAFB]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
