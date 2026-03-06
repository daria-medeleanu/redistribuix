import { NAV_ITEMS, getInitials } from "../constants/constants";

const PRODUCT_CATEGORIES = ["Case", "ScreenProtector", "Cable", "Charger", "All"];

function formatCategoryLabel(name) {
  if (!name || name === "All") return "All products";
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default function SideMenu({ activePage, onNavigate, userName, onLogout, role }) {
  const initials = getInitials(userName);

  return (
    <aside
      className="group fixed top-0 left-0 z-40 flex h-screen w-[64px] flex-col border-r border-[#e5e7eb] bg-white text-[#4b5563] shadow-sm transition-[width] duration-300 ease-in-out hover:w-64"
    >
      <div className="flex h-[62px] items-center gap-3 border-b border-[#e5e7eb] px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4d4dff] text-white text-xs font-bold">
          R
        </div>
        <span className="pointer-events-none translate-x-[-8px] whitespace-nowrap text-sm font-semibold tracking-tight text-[#111827] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          RedistribuiX
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-2 py-3">
        <div className="h-0 overflow-hidden whitespace-nowrap px-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] opacity-0 transition-all duration-300 group-hover:h-5 group-hover:py-1 group-hover:opacity-100">
          Menu
        </div>
        {NAV_ITEMS.filter(item => {
          if (role === 'StandManager') {
            return item.id === 'products' || item.id === 'profile';
          }
          // Admin: show all
          return true;
        }).map((item) => {
          const isActive = activePage === item.id;
          return (
            <div key={item.id} className="flex flex-col">
              <button
                type="button"
                title={item.label}
                onClick={() => onNavigate(item.id)}
                className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                  isActive
                    ? "bg-[#e4e4ff] text-[#111827] font-medium"
                    : "bg-transparent text-[#6b7280] hover:bg-[#e4e4ff] hover:text-[#111827]"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className="z-10 flex h-full w-[60px] min-w-[50px] items-center justify-center text-[1.15rem]">
                  {item.icon}
                </span>
                <span className="pointer-events-none translate-x-[-6px] whitespace-nowrap text-[0.87rem] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
              {item.id === "products" && (
                <div className="pointer-events-none max-h-0 overflow-hidden pl-[60px] text-[0.85rem] text-[#4d4dff] opacity-0 transition-all duration-300 group-hover:max-h-40 group-hover:opacity-100 group-hover:pointer-events-auto">
                  <div className="mt-1 mb-2 h-px w-10 bg-[#eddccf]" />
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onNavigate("products")}
                      className="flex w-full items-center py-1.5 text-left font-medium hover:text-[#161643]"
                    >
                      <span className="truncate">{formatCategoryLabel(cat)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[#e5e7eb] px-2 py-3">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex h-12 min-h-[48px] items-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-left text-sm text-[#4b5563] transition-colors hover:bg-[#f3f4f6]"
        >
          <div className="flex h-full w-[60px] min-w-[50px] items-center justify-center">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#4d4dff] text-[0.76rem] font-semibold text-white">
              {initials}
            </div>
          </div>
          <div className="pointer-events-none translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <div className="text-[0.82rem] font-medium text-[#111827]">
              {userName || "User"}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Log out"
          className="flex h-[38px] min-h-[38px] w-full items-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-transparent text-[0.82rem] text-[#6b7280] transition-all hover:bg-[#f3f4f6] hover:text-[#111827]"
        >
          <span className="flex h-full w-[60px] min-w-[50px] items-center justify-center text-base">
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
