import { useEffect, useState, useMemo, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideMenu from '../components/SideMenu';

const API_BASE = 'http://localhost:5056/api/v1';

const getAuthUser = () => {
  try {
    const auth = window.localStorage.getItem('redistribuix_auth');
    return auth ? JSON.parse(auth) : null;
  } catch {
    return null;
  }
};

const DaySalesGroup = memo(({ day, dateKey, itemsCount, targetLocationId, productMap, isToday }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [details, setDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const fetchDetails = async () => {
        if (details || isLoadingDetails) return;
        setIsLoadingDetails(true);
        try {
            const locParam = targetLocationId ? `/${targetLocationId}` : '';
            const res = await fetch(`${API_BASE}/DailySale/by-date${locParam}?date=${dateKey}`);
            if (res.ok) {
                const data = await res.json();
                setDetails(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    useEffect(() => {
        if (isToday) {
            fetchDetails();
        }
    }, [isToday]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        fetchDetails();
    };

    const isOpen = isHovered || isToday;

    return (
        <div 
            className="flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full px-6 py-3.5 hover:bg-white transition-colors flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3 ml-8 border-l-[3px] border-transparent group-hover:border-[#4d4dff] pl-3 transition-colors">
                    <span className="font-medium text-[#4b5563] text-[0.9rem]">
                        {day} {isToday && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Today</span>}
                    </span>
                </div>
                <span className="text-[0.75rem] text-[#9ca3af] font-medium">
                    {itemsCount} items
                </span>
            </div>

            <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-6 pb-4 pt-1 ml-[46px] space-y-2">
                        {isLoadingDetails && !details ? (
                            <div className="flex justify-center p-2">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#4d4dff]"></div>
                            </div>
                        ) : details?.length > 0 ? (
                            details.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-[#4d4dff]/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[0.75rem] font-bold text-[#9ca3af] tabular-nums w-12 text-right">
                                            {new Date(sale.saleDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                        <span className="text-[0.9rem] font-medium text-[#111827]">
                                            {productMap[String(sale.productId).toLowerCase()] || 'Unknown Product'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center bg-[#eef0ff] h-7 min-w-[28px] px-2 rounded-lg text-[#4d4dff] font-bold text-[0.8rem]">
                                        +{sale.quantitySold}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-400 text-center py-2 italic">
                                No details available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function DailySalesPage() {
    const navigate = useNavigate();
    const { locationId } = useParams();
    const user = getAuthUser();
    
    const [summary, setSummary] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedMonths, setExpandedMonths] = useState({});

    const targetLocationId = locationId || (user?.role !== 'Admin' ? user?.locationId : null);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        if (!targetLocationId && user.role !== 'Admin') {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const locParam = targetLocationId ? `/${targetLocationId}` : '';
                const [summaryRes, prodRes] = await Promise.all([
                    fetch(`${API_BASE}/DailySale/summary${locParam}`), 
                    fetch(`${API_BASE}/Product`)
                ]);

                if (!summaryRes.ok) throw new Error('Failed to fetch sales summary.');
                if (!prodRes.ok) throw new Error('Failed to fetch products.');

                const summaryData = await summaryRes.json();
                const productsData = await prodRes.json();

                setSummary(Array.isArray(summaryData) ? summaryData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, navigate, targetLocationId]);

    const productMap = useMemo(() => {
        const map = {};
        products.forEach(p => {
            map[String(p.productId).toLowerCase()] = p.name;
        });
        return map;
    }, [products]);

    const { groupedSummaryByYear, sortedYears } = useMemo(() => {
        if (!summary.length) return { groupedSummaryByYear: {}, sortedYears: [] };

        const grouped = {};
        const sortedSummary = [...summary].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

        sortedSummary.forEach(item => {
            const date = new Date(item.saleDate);
            const year = date.getFullYear();
            const monthKey = date.toLocaleDateString('en-US', { month: 'long' });
            
            const dayKey = date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit'
            });

            const isoDateKey = date.toISOString().split('T')[0];
            
            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][monthKey]) grouped[year][monthKey] = {};
            
            grouped[year][monthKey][dayKey] = {
                dateKey: isoDateKey,
                itemsCount: item.itemsCount
            };
        });

        const years = Object.keys(grouped).sort((a, b) => b - a);
        return { groupedSummaryByYear: grouped, sortedYears: years };
    }, [summary]);

    const toggleMonth = (year, month) => {
        const key = `${year}-${month}`;
        setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNavigate = (pageId) => {
        if (pageId === 'home') navigate('/');
        else if (pageId === 'locations') navigate('/locations');
        else if (pageId === 'profile') navigate('/profile');
        else if (pageId === 'products') navigate('/products');
        else if (pageId === 'daily_sales') navigate('/daily-sales');
        else if (pageId.startsWith('location_')) {
            navigate(`/locations/${pageId.split('_')[1]}`);
        }
    };

    const todayIsoString = new Date().toISOString().split('T')[0];

    return (
        <div className="flex min-h-screen bg-[#fafafa] text-[#4b5563]">
            <div className="z-50 shrink-0">
                <SideMenu
                    activePage="daily_sales"
                    onNavigate={handleNavigate}
                    onLogout={() => navigate('/auth')}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden relative pl-[64px]">
                <main className="flex-1 overflow-y-auto px-8 py-10">
                    <section className="mx-auto max-w-4xl space-y-10">
                        
                        <header className="flex flex-col items-center text-center pb-4">
                            <h1 className="font-serif text-[2.2rem] font-bold text-[#111827] tracking-tight mb-2">
                                Sales <em className="italic font-light text-[#4d4dff]">Log</em>
                            </h1>
                            <p className="text-[0.95rem] text-[#6b7280] max-w-md">
                                {targetLocationId ? 'Review recent daily transactions for this location.' : 'Review your historical daily transactions.'}
                            </p>
                        </header>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-center">
                                ⚠️ Error: {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#4d4dff]"></div>
                                </div>
                            ) : sortedYears.length > 0 ? (
                                sortedYears.map((year) => (
                                    <div key={year} className="space-y-4">
                                        <h2 className="text-xl font-extrabold text-[#111827] border-b-2 border-slate-100 pb-2 ml-1">
                                            {year}
                                        </h2>
                                        
                                        <div className="grid gap-4">
                                            {Object.keys(groupedSummaryByYear[year])
                                                .sort((a, b) => new Date(`${b} 1, 2000`) - new Date(`${a} 1, 2000`))
                                                .map((month) => {
                                                    const monthKey = `${year}-${month}`;
                                                    
                                                    const daysInMonth = groupedSummaryByYear[year][month];
                                                    
                                                    let totalSalesInMonth = 0;
                                                    let hasToday = false;
                                                    for(let day in daysInMonth) {
                                                        totalSalesInMonth += daysInMonth[day].itemsCount;
                                                        if (daysInMonth[day].dateKey === todayIsoString) hasToday = true;
                                                    }

                                                    const isMonthExpanded = expandedMonths[monthKey] !== undefined ? expandedMonths[monthKey] : hasToday;

                                                    return (
                                                        <div key={monthKey} className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden transition-all duration-300 transform-gpu">
                                                            
                                                            <button
                                                                onClick={() => toggleMonth(year, month)}
                                                                className="w-full px-6 py-4 hover:bg-[#f9fafb] transition-colors flex items-center justify-between text-left group cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <svg
                                                                        className={`h-5 w-5 text-[#9ca3af] transition-transform duration-300 ${isMonthExpanded ? 'rotate-180 text-[#4d4dff]' : ''}`}
                                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                    <span className="text-[1.1rem] font-semibold text-[#111827] group-hover:text-[#4d4dff] transition-colors">
                                                                        {month}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[0.75rem] bg-[#f3f4f6] text-[#4b5563] group-hover:bg-[#eef0ff] group-hover:text-[#4d4dff] px-3 py-1 rounded-lg font-bold transition-colors">
                                                                    {totalSalesInMonth} {totalSalesInMonth === 1 ? 'sale' : 'sales'}
                                                                </span>
                                                            </button>

                                                            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isMonthExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                                <div className="overflow-hidden">
                                                                    <div className="bg-[#fafafa] border-t border-slate-100 divide-y divide-slate-100">
                                                                        {Object.keys(daysInMonth)
                                                                            .sort((a, b) => parseInt(b.match(/\d+/)[0]) - parseInt(a.match(/\d+/)[0]))
                                                                            .map((day) => {
                                                                                const dayData = daysInMonth[day];
                                                                                const isToday = dayData.dateKey === todayIsoString;

                                                                                return (
                                                                                    <DaySalesGroup 
                                                                                        key={`${year}-${month}-${day}`}
                                                                                        day={day}
                                                                                        dateKey={dayData.dateKey}
                                                                                        itemsCount={dayData.itemsCount}
                                                                                        targetLocationId={targetLocationId}
                                                                                        productMap={productMap}
                                                                                        isToday={isToday}
                                                                                    />
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                                    <div className="text-5xl mb-4 opacity-50">📋</div>
                                    <p className="text-[1.1rem] font-bold text-[#111827] mb-1">No Sales Yet</p>
                                    <p className="text-[0.9rem] text-[#6b7280]">Daily sales will appear here organized by date.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}