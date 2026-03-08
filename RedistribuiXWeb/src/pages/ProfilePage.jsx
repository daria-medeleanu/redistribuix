import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import locationIcon from '../assets/icons/location.png';
import adminIcon from '../assets/icons/admin.png';
import standManagerIcon from '../assets/icons/stand-manager.png';

const API_BASE = 'http://localhost:5056/api/v1';

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const userRole = user?.role || (user?.locationId ? 'StandManager' : null);
  
  const [activePage, setActivePage] = useState('profile');
  const [locationData, setLocationData] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userRole === 'StandManager' && user?.locationId) {
      fetchLocationData();
    }
  }, [userRole, user?.locationId]);

  useEffect(() => {
    if (userRole === 'Admin') {
      fetchAllLocations();
    }
  }, [userRole]);

  const fetchLocationData = async () => {
    setIsLoadingLocation(true);
    try {
      const response = await fetch(`${API_BASE}/Location/${user.locationId}`);
      if (response.ok) {
        const data = await response.json();
        setLocationData(data);
      }
    } catch (err) {
      console.error('Failed to fetch location data:', err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const fetchAllLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const [locationsRes, stocksRes] = await Promise.all([
        fetch(`${API_BASE}/Location`),
        fetch(`${API_BASE}/StockVelocity`)
      ]);

      if (!locationsRes.ok || !stocksRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const locations = await locationsRes.json();
      const stocks = await stocksRes.json();

      const enrichedLocations = locations.map(loc => {
        const locationStocks = stocks.filter(s => s.locationId === loc.locationId);
        
        const totalStock = locationStocks.reduce((sum, item) => sum + item.currentQuantity, 0);
        const totalSales30Days = locationStocks.reduce((sum, item) => sum + item.salesLast30Days, 0);
        const uniqueProductsCount = locationStocks.length;

        return {
          ...loc,
          totalStock,
          totalSales30Days,
          uniqueProductsCount
        };
      });

      setAllLocations(enrichedLocations);
    } catch (err) {
      console.error('Failed to fetch all locations:', err);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);

    if (pageId === 'home') {
      navigate('/');
    } else if (pageId === 'locations') {
      navigate('/locations');
    } else if (pageId === 'products') {
      navigate('/products');
    } else if (pageId === 'profile') {
      navigate('/profile');
    } else if (pageId.startsWith('location_')) {
      const specificId = pageId.split('_')[1];
      navigate(`/locations/${specificId}`);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('redistribuix_auth');
    navigate('/auth');
  };

  const getProfileBadge = (profileValue) => {
    switch (profileValue) {
      case 0: return { text: 'University', classes: 'bg-emerald-100 text-emerald-700' };
      case 1: return { text: 'Touristic', classes: 'bg-amber-100 text-amber-700' };
      case 2: return { text: 'Transit', classes: 'bg-purple-100 text-purple-700' };
      case 3: return { text: 'Mixed', classes: 'bg-blue-100 text-blue-700' };
      default: return { text: 'Standard', classes: 'bg-slate-100 text-slate-700' };
    }
  };

  const getPurchasingPowerLabel = (powerValue) => {
    switch (powerValue) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      default: return 'Unknown';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="z-50 shrink-0">
        <SideMenu
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden pl-[64px]">
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <section className="mx-auto max-w-4xl space-y-8">
            
            <header className="mb-7 flex flex-col items-center text-center">
              <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#000000] mb-1">
                My{' '}
                <em className="italic font-light text-[#4d4dff]">Profile</em>
              </h1>
              <p className="text-[0.9rem] text-[#000000] max-w-md">
                View your account settings and preferences.
              </p>
            </header>

            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Header with Avatar */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-8 py-12 text-white">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur-sm border-4 border-white/30">
                    {getAvatarInitials(user.name || 'User')}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
                    <p className="mt-1 text-blue-100">{user.email}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                      <img 
                        src={userRole === 'Admin' ? adminIcon : standManagerIcon} 
                        alt={userRole === 'Admin' ? 'Administrator' : 'Stand Manager'}
                        className="w-4 h-4"
                      />
                      {userRole === 'Admin' ? 'Administrator' : 'Stand Manager'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Account Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Full Name
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {user.name || 'Not set'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Email Address
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {user.email || 'Not set'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        User Role
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {userRole || 'Unknown'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Account ID
                      </p>
                      <p className="text-xs font-mono text-slate-600 break-all">
                        {user.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Locations Overview for Admin */}
                {userRole === 'Admin' && (
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Locations Overview</h3>
                    {isLoadingLocations ? (
                      <div className="text-center text-slate-500 py-8">Loading locations...</div>
                    ) : allLocations.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {allLocations.map((loc) => {
                          const profileBadge = getProfileBadge(loc.profile);
                          
                          return (
                            <div 
                              key={loc.locationId} 
                              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500 hover:shadow-md cursor-pointer"
                              onClick={() => navigate(`/locations/${loc.locationId}`)}
                            >
                              <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-base font-bold text-slate-900 truncate pr-2" title={loc.name}>
                                    {loc.name}
                                  </h4>
                                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${profileBadge.classes}`}>
                                    {profileBadge.text}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                  Purchasing Power: <span className="text-slate-700 font-medium">{getPurchasingPowerLabel(loc.purchasingPower)}</span>
                                </div>
                              </div>

                              <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Total Stock
                                  </div>
                                  <div className="text-lg font-bold text-slate-900">
                                    {loc.totalStock}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Sales (30d)
                                  </div>
                                  <div className="text-lg font-bold text-blue-600">
                                    {loc.totalSales30Days}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  <div className="text-xs text-slate-500">
                                    {loc.uniqueProductsCount} products
                                  </div>
                                  <div className="text-xs text-blue-600 font-semibold group-hover:underline">
                                    View Details →
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
                        No locations found
                      </div>
                    )}
                  </div>
                )}

                {/* Location Info for Stand Managers */}
                {userRole === 'StandManager' && (
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Location Assignment</h3>
                    {isLoadingLocation ? (
                      <div className="text-center text-slate-500 py-4">Loading location...</div>
                    ) : locationData ? (
                      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{locationData.name}</h4>
                            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                              <img src={locationIcon} alt="Location" className="w-4 h-4" />
                              {locationData.address || 'Address not available'}
                            </p>
                          </div>
                          {locationData.profile !== undefined && (
                            <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getProfileBadge(locationData.profile).classes}`}>
                              {getProfileBadge(locationData.profile).text}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {locationData.purchasingPower !== undefined && (
                            <div className="rounded-lg bg-white border border-slate-200 p-3">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Purchasing Power
                              </p>
                              <p className="text-sm font-bold text-slate-900 mt-1">
                                {getPurchasingPowerLabel(locationData.purchasingPower)}
                              </p>
                            </div>
                          )}
                          <div className="rounded-lg bg-white border border-slate-200 p-3">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Location ID
                            </p>
                            <p className="text-xs font-mono text-slate-600 mt-1 break-all">
                              {locationData.locationId}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/locations/${locationData.locationId}`)}
                          className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          View Location Details
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                        <strong> No location assigned</strong>
                        <p className="mt-1 text-amber-600">Please contact an administrator to assign a location to your account.</p>
                      </div>
                    )}
                  </div>
                )}
                {userRole === 'Admin' && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-900">
                      <strong> Administrator Privileges</strong>
                      <br />
                      <span className="text-blue-700">
                        You have full access to all locations, products, and system features.
                      </span>
                    </p>
                  </div>
                )}
               
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="rounded-lg border-2 border-red-600 bg-white px-6 py-2 font-semibold text-red-600 transition-all hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>

             
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}