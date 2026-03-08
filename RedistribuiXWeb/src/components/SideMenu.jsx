import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants/constants";
import boxIcon from "../assets/icons/box.png";
import locationIcon from "../assets/icons/location.png";
import userIcon from "../assets/icons/user.png";
import courierIcon from "../assets/icons/courier.png";
import logoRedistribuiX from '../assets/redistribuix-logo.png'
import logoWriting from '../assets/redistribuix-writing.png'
import salesLogIcon from "../assets/icons/sales-log.png"; // Am adăugat un icon placeholder, asigură-te că există sau folosește un emoji

const PRODUCT_CATEGORIES = ["Case", "ScreenProtector", "Cable", "Charger", "All"];

const CATEGORY_ID_MAP = {
  "Case": 0,
  "ScreenProtector": 1,
  "Cable": 2,
  "Charger": 3,
  "All": 'all'
};

function formatCategoryLabel(name) {
  if (!name || name === "All") return "All products";
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function getAuthUser() {
  try {
    const authString = 
      window.localStorage.getItem('redistribuix_auth') || 
      window.localStorage.getItem('user') || 
      window.localStorage.getItem('userData');
      
    if (!authString) return null;

    const userData = JSON.parse(authString);
    
    return userData.user ? userData.user : userData;
  } catch (err) {
    console.error('Failed to parse auth data:', err);
    return null;
  }
}

function getAvatarInitials(name) {
  if (!name) return "U"; 
  const nameParts = name.trim().split(/\s+/); 
  
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  } else {
    return name.substring(0, 2).toUpperCase(); 
  }
}

export default function SideMenu({ activePage, onNavigate, onLogout }) {
  const navigate = useNavigate();
  
  const user = getAuthUser();
  
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const initials = getAvatarInitials(userName);
  
  const userRole = user?.role || (user?.locationId ? 'StandManager' : 'Admin');
  
  const [locations, setLocations] = useState([]);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);

  useEffect(() => {
    if (userRole !== 'Admin') return;

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5056/api/v1/Location');
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [userRole]);

  function handleMenuClick(itemId) {
    if (itemId === 'home') {
      navigate('/home');
      onNavigate('home');
    } else if (itemId === 'products') {
      if (userRole === 'Admin') {
        navigate('/productsAdmin');
        onNavigate('productsAdmin');
      } else {
        navigate('/products', { state: { selectedCategory: null } });
        onNavigate('products');
      }
    } else if (itemId === 'locations') {
      navigate('/locations');
      onNavigate('locations');
    } else if (itemId === 'profile') {
      navigate('/profile');
      onNavigate('profile');
    } else if (itemId === 'suggestedTransfers') {
      navigate('/suggestedTransfer');
      onNavigate('suggestedTransfers');
    } else if (itemId === 'daily_sales') {
      navigate('/daily-sales');
      onNavigate('daily_sales');
    } else {
      onNavigate(itemId);
    }
  }

  function handleTransferClick(type) {
    if (type === 'new') {
      navigate('/suggestedTransfer');
      onNavigate('suggestedTransfers');
    } else if (type === 'completed') {
      navigate('/completedTransfers');
      onNavigate('completedTransfers');
    }
  }

  function handleLocationClick(locationId) {
    navigate(`/locations/${locationId}`);
    onNavigate(`location_${locationId}`);
  }

  function handleMyLocationClick() {
    if (user?.locationId) {
      navigate(`/locations/${user.locationId}`);
      onNavigate(`location_${user.locationId}`);
    }
  }

  function handleCategoryClick(categoryName) {
    if (userRole === 'Admin') {
      const adminState = {
        selectedCategory: categoryName === 'All' ? 'All' : categoryName,
      };
      navigate('/productsAdmin', { state: adminState });
      onNavigate('products');
    } else {
      const categoryId = CATEGORY_ID_MAP[categoryName];
      if (categoryId === 'all') {
        navigate('/products', { state: { selectedCategory: 'all' } });
        onNavigate('product_all');
      } else {
        navigate('/products', { state: { selectedCategory: categoryId } });
        onNavigate(`product_${categoryId}`);
      }
    }
  }

  return (
    <aside
      className="group fixed top-0 left-0 z-40 flex h-screen w-[64px] flex-col border-r border-[#e5e7eb] bg-white text-[#4b5563] shadow-sm transition-[width] duration-300 ease-in-out hover:w-64 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => handleMenuClick("home")}
        className="flex h-[62px] items-center gap-3 border-b border-[#e5e7eb] px-4 cursor-pointer hover:bg-[#f9fafb] transition-colors"
      >
        <img
          src={logoRedistribuiX}
          alt="RedistribuiX Logo"
          className="h-10 w-10 min-w-[40px] shrink-0 object-contain"
        />
        <img
          src={logoWriting}
          alt="RedistribuiX"
          className="h-8 pointer-events-none -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </button>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3 pb-6 custom-scrollbar">
        <div className="h-0 overflow-hidden whitespace-nowrap px-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] opacity-0 transition-all duration-300 group-hover:h-5 group-hover:py-1 group-hover:opacity-100 shrink-0">
          Menu
        </div>
        
        {NAV_ITEMS.filter(item => {
          if (user?.role === 'StandManager') {
            return item.id === 'products' || item.id === 'profile' || item.id === 'daily_sales';
          }
          // Pentru Admin și alte roluri, exclude daily_sales
          return item.id !== 'daily_sales';
        }).map((item) => {
          let isActive = activePage === item.id;
          if (item.id === 'locations') isActive = activePage === 'locations' || activePage.startsWith('location_');
          if (item.id === 'products') isActive = activePage === 'products' || activePage.startsWith('product_');
          
          const hasSubmenu = (item.id === 'locations' && user?.role === 'Admin') || item.id === 'products';
          const isDropdownOpen = hoveredDropdown === item.id;

          return (
            <div 
              key={item.id} 
              className="flex flex-col shrink-0"
              onMouseEnter={() => hasSubmenu && setHoveredDropdown(item.id)}
              onMouseLeave={() => hasSubmenu && setHoveredDropdown(null)}
            >
              <button
                type="button"
                title={item.label}
                onClick={() => handleMenuClick(item.id)}
                className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                  isActive
                    ? "bg-[#e4e4ff] text-[#111827] font-medium"
                    : "bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className="z-10 flex h-full w-[60px] min-w-[60px] items-center justify-center text-[1.15rem]">
                  {getMenuIconById(item.id) ? (
                    <img
                      src={getMenuIconById(item.id)}
                      alt={item.label}
                      className="h-5 w-5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                  ) : null}
                  <span style={{ display: getMenuIconById(item.id) ? 'none' : 'block' }}>{item.icon}</span>
                </span>
                
                <div className="pointer-events-none flex flex-1 items-center justify-between pr-3 translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <span>{item.label}</span>
                  {hasSubmenu && (
                    <svg 
                      className={`h-4 w-4 text-[#9ca3af] transition-transform duration-300 ease-in-out ${isDropdownOpen ? "rotate-180 text-[#4d4dff]" : "rotate-0"}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              
              {hasSubmenu && (
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isDropdownOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}>
                  <div className="overflow-hidden">
                    <div className="ml-[30px] mt-1 mb-2 flex flex-col gap-1 border-l-2 border-[#e5e7eb] pl-3 py-1">
                      
                      {item.id === "locations" && (
                        locations.length > 0 ? (
                          locations.map((loc) => (
                            <button
                              key={loc.locationId}
                              type="button"
                              onClick={() => handleLocationClick(loc.locationId)}
                              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                                activePage === `location_${loc.locationId}`
                                  ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                                  : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                              }`}
                            >
                              <span className="truncate">{loc.name}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-[0.75rem] italic text-[#9ca3af]">Loading...</div>
                        )
                      )}

                      {item.id === "products" && (
                        PRODUCT_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryClick(cat)}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                              activePage === `product_${CATEGORY_ID_MAP[cat]}` || (cat === 'All' && activePage === 'product_all')
                                ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                                : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                            }`}
                          >
                            <span className="truncate">{formatCategoryLabel(cat)}</span>
                          </button>
                        ))
                      )}

                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {user?.role === 'StandManager' && (
          <div className="flex flex-col shrink-0">
            <button
              type="button"
              title="My Location"
              onClick={handleMyLocationClick}
              className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                activePage === `location_${user?.locationId}`
                  ? "bg-[#e4e4ff] text-[#111827] font-medium"
                  : "bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                  activePage === `location_${user?.locationId}` ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="z-10 flex h-full w-[60px] min-w-[60px] items-center justify-center text-[1.15rem]">
                <img
                  src={locationIcon}
                  alt="My Location"
                  className="h-5 w-5 object-contain"
                />
              </span>
              <span className="pointer-events-none translate-x-[-6px] whitespace-nowrap text-[0.87rem] font-medium opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                My Location
              </span>
            </button>
          </div>
        )}

        {user?.role === 'Admin' && (
          <div 
            className="flex flex-col shrink-0"
            onMouseEnter={() => setHoveredDropdown('suggestedTransfers')}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button
              type="button"
              title="Transfers"
              onClick={() => handleMenuClick('suggestedTransfers')}
              className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                activePage === 'suggestedTransfers' || activePage === 'completedTransfers'
                  ? "bg-[#e4e4ff] text-[#111827] font-medium"
                  : "bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                  activePage === 'suggestedTransfers' || activePage === 'completedTransfers' ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="z-10 flex h-full w-[60px] min-w-[60px] items-center justify-center text-[1.15rem]">
                <img
                  src={courierIcon}
                  alt="Transfers"
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div className="pointer-events-none flex flex-1 items-center justify-between pr-3 translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span>Transfers</span>
                <svg 
                  className={`h-4 w-4 text-[#9ca3af] transition-transform duration-300 ease-in-out ${hoveredDropdown === 'suggestedTransfers' ? "rotate-180 text-[#4d4dff]" : "rotate-0"}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              hoveredDropdown === 'suggestedTransfers' ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}>
              <div className="overflow-hidden">
                <div className="ml-[30px] mt-1 mb-2 flex flex-col gap-1 border-l-2 border-[#e5e7eb] pl-3 py-1">
                  <button
                    type="button"
                    onClick={() => handleTransferClick('new')}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                      activePage === 'suggestedTransfers'
                        ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                        : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    }`}
                  >
                    <span className="truncate">New Transfers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransferClick('completed')}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                      activePage === 'completedTransfers'
                        ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                        : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    }`}
                  >
                    <span className="truncate">Completed Transfers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {user?.role === 'StandManager' && (
          <div 
            className="flex flex-col shrink-0"
            onMouseEnter={() => setHoveredDropdown('suggestedTransfers')}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button
              type="button"
              title="Transfers"
              onClick={() => handleMenuClick('suggestedTransfers')}
              className={`relative flex h-11 w-full min-h-[44px] items-center overflow-hidden rounded-xl px-0 text-left text-[0.87rem] font-normal transition-colors ${
                activePage === 'suggestedTransfers' || activePage === 'completedTransfers'
                  ? "bg-[#e4e4ff] text-[#111827] font-medium"
                  : "bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-md bg-[#4d4dff] transition-opacity ${
                  activePage === 'suggestedTransfers' || activePage === 'completedTransfers' ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="z-10 flex h-full w-[60px] min-w-[60px] items-center justify-center text-[1.15rem]">
                <img
                  src={courierIcon}
                  alt="Transfers"
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div className="pointer-events-none flex flex-1 items-center justify-between pr-3 translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span>Transfers</span>
                <svg 
                  className={`h-4 w-4 text-[#9ca3af] transition-transform duration-300 ease-in-out ${hoveredDropdown === 'suggestedTransfers' ? "rotate-180 text-[#4d4dff]" : "rotate-0"}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              hoveredDropdown === 'suggestedTransfers' ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}>
              <div className="overflow-hidden">
                <div className="ml-[30px] mt-1 mb-2 flex flex-col gap-1 border-l-2 border-[#e5e7eb] pl-3 py-1">
                  <button
                    type="button"
                    onClick={() => handleTransferClick('new')}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                      activePage === 'suggestedTransfers'
                        ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                        : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    }`}
                  >
                    <span className="truncate">New Transfers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransferClick('completed')}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[0.8rem] transition-all duration-200 ${
                      activePage === 'completedTransfers'
                        ? "bg-[#eef0ff] font-medium text-[#4d4dff]"
                        : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    }`}
                  >
                    <span className="truncate">Completed Transfers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[#e5e7eb] px-2 py-3 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex cursor-pointer h-12 min-h-[48px] items-center overflow-hidden rounded-xl  border border-transparent bg-transparent text-left text-sm text-[#4b5563] transition-all hover:bg-[#e9e2fe] hover:text-[#8d8b91]"
        >
          <div className="flex h-full w-[60px] min-w-[60px] items-center justify-center">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#4d4dff] text-[0.76rem] font-semibold text-white tracking-wider">
              {initials}
            </div>
          </div>
          <div className="pointer-events-none translate-x-[-6px] whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <div className="text-[0.82rem] font-medium text-[#111827]">
              {userName}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Log out"
          className="flex h-[38px] cursror-pointer min-h-[38px] w-full items-center overflow-hidden rounded-xl border border-transparent bg-transparent text-[0.82rem] text-[#6b7280] transition-all hover:bg-[#fee2e2] hover:text-[#ef4444]"
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

function getMenuIconById(itemId) {
  if (itemId === "products") return boxIcon;
  if (itemId === "locations") return locationIcon;
  if (itemId === "profile") return userIcon;
  if (itemId === "daily_sales") return salesLogIcon; // Folosește variabila importată
  return null;
}