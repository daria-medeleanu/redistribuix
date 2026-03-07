import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import AddLocationModal from '../components/AddLocationModal';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE = 'http://localhost:5056/api/v1'

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

export default function LocationsPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const userRole = user?.role || (user?.locationId ? 'StandManager' : null);
  
  const [activePage, setActivePage] = useState('locations');
  const [locationsData, setLocationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'StandManager') {
      if (user.locationId) {
        navigate(`/locations/${user.locationId}`);
      } else {
        navigate('/');
      }
    }
  }, [user, userRole, navigate]);

  useEffect(() => {
    if (userRole !== 'Admin') return;

    const fetchAllData = async () => {
      try {
        const [locationsRes, stocksRes] = await Promise.all([
          fetch(`${API_BASE}/Location`),
          fetch(`${API_BASE}/StockVelocity`)
        ]);

        if (!locationsRes.ok || !stocksRes.ok) {
          throw new Error('Failed to fetch data from one of the APIs.');
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
            uniqueProductsCount,
            stocks: locationStocks 
          };
        });

        setLocationsData(enrichedLocations);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [refreshTrigger, userRole]);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);

    if (pageId === 'home') {
        navigate('/home');
    } else if (pageId === 'locations') {
        navigate('/locations');
    } else if(pageId === 'products') {
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

  const handleDeleteLocation = (locationId, locationName) => {
    setLocationToDelete({ id: locationId, name: locationName });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      const response = await fetch(`${API_BASE}/Location/${locationToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      setRefreshTrigger(prev => prev + 1);
      setIsConfirmOpen(false);
      setLocationToDelete(null);
    } catch (err) {
      setError(err.message);
      setIsConfirmOpen(false);
      setLocationToDelete(null);
    }
  };

  if (!user || userRole !== 'Admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Delete Location"
        message={`Are you sure you want to delete "${locationToDelete?.name}"? This action cannot be undone and all associated data will be lost.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setLocationToDelete(null);
        }}
        isDangerous={true}
      />

      <div className="z-50 shrink-0">
        <SideMenu
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden pl-[64px]">
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <section className="mx-auto max-w-7xl space-y-8">
            
            <header className="mb-7 flex flex-col items-center text-center">
              <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#000000] mb-1">
                Locations{' '}
                <em className="italic font-light text-[#4d4dff]">Performance</em>
              </h1>
              <p className="text-[0.9rem] text-[#000000] max-w-md">
                Monitor stock levels and sales velocity per location.
              </p>
            </header>

            {error && (
               <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-center gap-3">
                 <span className="text-lg">⚠️</span> C# Backend Error: {error}
               </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-slate-500">Loading complex data...</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {locationsData.map((loc) => {
                  const profileBadge = getProfileBadge(loc.profile);
                  
                  return (
                    <div 
                      key={loc.locationId} 
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#4d4dff] hover:shadow-md"
                    >
                      <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-slate-900 truncate pr-2" title={loc.name}>{loc.name}</h3>
                          <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${profileBadge.classes}`}>
                            {profileBadge.text}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          Purchasing Power: <span className="text-slate-700">{getPurchasingPowerLabel(loc.purchasingPower)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-5">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Stock</p>
                          <p className="text-2xl font-bold text-slate-900">{loc.totalStock}</p>
                          <p className="text-xs text-slate-400">across {loc.uniqueProductsCount} products</p>
                        </div>
                        
                        <div className="space-y-1 border-l border-slate-100 pl-4">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sales (30 Days)</p>
                          <p className="text-2xl font-bold text-blue-600">{loc.totalSales30Days}</p>
                          <p className="text-xs text-slate-400">sales velocity</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 mt-auto flex items-center gap-2 group/buttons">
                        <button 
                          onClick={() => navigate(`/locations/${loc.locationId}`)}
                          className="flex-1 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:scale-105 origin-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc.locationId, loc.name)}
                          title="Delete location"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:scale-110 group-hover/buttons:bg-red-50"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </section>
        </main>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          title="Add Location"
          className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#4d4dff] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#3d3dff] hover:shadow-xl focus:outline-none md:bottom-10 md:right-10"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
