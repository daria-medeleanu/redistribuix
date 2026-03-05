import { NAV_ITEMS, getInitials } from "../constants/constants";

export default function SideMenu({ activePage, onNavigate, userName, onLogout }) {
  const initials = getInitials(userName);

  return (
    <aside
      className="group flex h-screen w-[64px] flex-col border-r border-[#eddccf] bg-[#fdf4ec] text-[#8a5a43] shadow-sm transition-[width] duration-300 ease-in-out hover:w-64"
    >
      <div className="flex h-[62px] items-center gap-3 border-b border-[#eddccf] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4d4dff] text-white text-xs font-bold">
          R
        </div>
        <span className="pointer-events-none translate-x-[-8px] whitespace-nowrap text-sm font-semibold tracking-tight text-[#46190c] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          RedistribuiX
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-2 py-3">
        <div className="h-0 overflow-hidden whitespace-nowrap px-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#b58a70] opacity-0 transition-all duration-300 group-hover:h-5 group-hover:py-1 group-hover:opacity-100">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onNavigate(item.id)}
              className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                isActive
          ? "bg-[#4d4dff]/10 text-[#46190c] font-medium"
          : "bg-transparent text-[#8a5a43] hover:bg-[#e4e4ff] hover:text-[#46190c]"
              }`}
            >
              <span
				className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />

              <span
                className="z-10 flex h-full w-[60px] min-w-[60px] items-center justify-center text-[1.15rem]"
              >
                {item.icon}
              </span>

              <span className="pointer-events-none translate-x-[-6px] whitespace-nowrap text-[0.87rem] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[#eddccf] px-2 py-3">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex h-12 min-h-[48px] items-center overflow-hidden rounded-xl border border-[#eddccf] bg-white/60 text-left text-sm text-[#8a5a43] transition-colors hover:bg-white"
        >
          <div className="flex h-full w-[60px] min-w-[60px] items-center justify-center">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#4d4dff] text-[0.76rem] font-semibold text-white">
              {initials}
            </div>
          </div>
          <div className="pointer-events-none translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <div className="text-[0.82rem] font-medium text-[#46190c]">
              {userName || "User"}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Log out"
          className="flex h-[38px] min-h-[38px] w-full items-center overflow-hidden rounded-xl border border-[#eddccf] bg-transparent text-[0.82rem] text-[#b58a70] transition-all hover:bg-[#f9e7d7] hover:text-[#46190c]"
        >
          <span className="flex h-full w-[60px] min-w-[60px] items-center justify-center text-base">
            🚪
          </span>
          <span className="pointer-events-none translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
}
