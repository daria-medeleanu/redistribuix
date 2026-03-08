import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import ConfirmationModal from '../components/ConfirmationModal'
import MLStatusCell from '../components/MLStatusCell'
import AddDailySaleModal from '../components/AddDailySaleModal'
import * as XLSX from 'xlsx'

const API_BASE = 'http://localhost:5056/api/v1'
const ITEMS_PER_PAGE = 10

const getAuthUser = () => {
  try {
    const auth = window.localStorage.getItem('redistribuix_auth')
    return auth ? JSON.parse(auth) : null
  } catch {
    return null
  }
}

const PROFILE_BADGES = {
    0: { text: 'University', classes: 'bg-emerald-100 text-emerald-700' },
    1: { text: 'Touristic', classes: 'bg-amber-100 text-amber-700' },
    2: { text: 'Transit', classes: 'bg-purple-100 text-purple-700' },
    3: { text: 'Mixed', classes: 'bg-blue-100 text-blue-700' }
}

const CATEGORY_LABELS = {
    0: 'Case',
    1: 'Screen Protector',
    2: 'Cable',
    3: 'Charger'
}

const PURCHASING_POWER_LABELS = {
    0: 'Low',
    1: 'Medium',
    2: 'High'
}

const STOCK_DEFAULTS = {
    currentQuantity: 0,
    salesLast30Days: 0,
    salesLast100Days: 0,
    remainingStockDays: 0,
    stockConfidence: 0
}

const EXCEL_COLUMNS = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 }
]

const getProfileBadge = (profileValue) => PROFILE_BADGES[profileValue] || { text: 'Standard', classes: 'bg-slate-100 text-slate-700' }
const getPurchasingPowerLabel = (powerValue) => PURCHASING_POWER_LABELS[powerValue] || 'Unknown'
const getCategoryLabel = (categoryValue) => CATEGORY_LABELS[categoryValue] || 'Universal'

const safeString = (val) => {
    if (val === null || val === undefined) return ""
    if (typeof val === 'object') return val.name || JSON.stringify(val)
    return String(val)
}

const getHealthConfig = (stockDetails) => {
    if (stockDetails.currentQuantity === 0) {
        return {
            label: 'STOCKOUT',
            classes: 'inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700 ring-2 ring-inset ring-red-600/20 shadow-sm'
        }
    }
    if (stockDetails.salesLast30Days === 0) {
        return {
            label: 'New',
            classes: 'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20'
        }
    }
    if (stockDetails.remainingStockDays < 14) {
        return {
            label: 'LOW STOCK',
            classes: 'inline-flex items-center rounded-md bg-yellow-50 px-3 py-1.5 text-sm font-bold text-yellow-800 ring-2 ring-inset ring-yellow-600/30 shadow-sm'
        }
    }
    return {
        label: 'HEALTHY',
        classes: 'inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700 ring-2 ring-inset ring-green-600/30 shadow-sm'
    }
}

export default function SingleLocationPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = getAuthUser()
    const [activePage, setActivePage] = useState(`location_${id}`)
    
    const [location, setLocation] = useState(null)
    const [inventory, setInventory] = useState([])
    const [stats, setStats] = useState({ totalStock: 0, totalSales30d: 0, itemsAtRisk: 0, itemsStockout: 0 })
    
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    
    const [mlLoadingProducts, setMlLoadingProducts] = useState(new Set())
    const [saleProduct, setSaleProduct] = useState(null)
    const [lastSoldProduct, setLastSoldProduct] = useState(null)
    const [showSaleConfirm, setShowSaleConfirm] = useState(false)

    useEffect(() => {
        setCurrentPage(1)
        setActivePage(`location_${id}`)
        setSearchTerm("")

        let isCancelled = false

        const fetchLocationDetails = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const [locRes, prodRes, stockRes] = await Promise.all([
                    fetch(`${API_BASE}/Location`),
                    fetch(`${API_BASE}/Product/by-location/${id}`),
                    fetch(`${API_BASE}/StockVelocity`)
                ])

                if (!locRes.ok || !stockRes.ok) throw new Error('Failed to fetch data from backend.')

                const [allLocations, allStocks] = await Promise.all([locRes.json(), stockRes.json()])
                const rawProducts = prodRes.ok ? await prodRes.json().catch(() => []) : []
                const products = Array.isArray(rawProducts) ? rawProducts : []

                const currentLocation = allLocations.find((loc) => String(loc.locationId) === String(id))
                if (!currentLocation) {
                    throw new Error('Location not found in database.')
                }

                const locationStocks = (Array.isArray(allStocks) ? allStocks : []).filter((stock) => String(stock.locationId) === String(id))

                let totalStock = 0
                let totalSales30d = 0
                let itemsAtRisk = 0
                let itemsStockout = 0

                const enrichedInventory = products.map((product) => {
                    const stockDetails = locationStocks.find((stock) => String(stock.productId) === String(product?.productId)) || STOCK_DEFAULTS

                    totalStock += stockDetails.currentQuantity || 0
                    totalSales30d += stockDetails.salesLast30Days || 0
                    
                    const isStockout = stockDetails.currentQuantity === 0
                    const isLowStock = stockDetails.currentQuantity > 0 && 
                                      stockDetails.salesLast30Days > 0 && 
                                      stockDetails.remainingStockDays < 14
                    
                    if (isStockout) {
                        itemsStockout++
                    } else if (isLowStock) {
                        itemsAtRisk++
                    }

                    return {
                        ...product,
                        categoryLabel: getCategoryLabel(product.productCategory ?? product.category),
                        stockDetails,
                        mlStatus: null,
                        mlForecast: null,
                        mlDailyRate: null,
                        mlDaysOfStock: null
                    }
                })

                if (isCancelled) return
                setLocation(currentLocation)
                setInventory(enrichedInventory)
                setStats({ totalStock, totalSales30d, itemsAtRisk, itemsStockout })
            } catch (err) {
                if (!isCancelled) setError(err.message)
            } finally {
                if (!isCancelled) setIsLoading(false)
            }
        }

        if (id) {
            fetchLocationDetails()
        } else {
            setError("No Location ID provided.")
            setIsLoading(false)
        }
        
        return () => { isCancelled = true }
    }, [id, refreshTrigger])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    const handleNavigate = (pageId) => {
        setActivePage(pageId)
        if (pageId === 'home') navigate('/')
        else if (pageId === 'locations') navigate('/locations')
        else if (pageId === 'profile') navigate('/profile')
        else if (pageId === 'products') navigate('/products')
        else if (pageId.startsWith('location_')) {
            navigate(`/locations/${pageId.split('_')[1]}`)
        }
    }

    const handleDeleteProduct = (productId, productName) => {
        setProductToDelete({ id: productId, name: productName })
        setIsConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!productToDelete) return

        try {
            const response = await fetch(`${API_BASE}/Product/${productToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                throw new Error('Failed to delete product')
            }

            setRefreshTrigger(prev => prev + 1)
            setIsConfirmOpen(false)
            setProductToDelete(null)
        } catch (err) {
            setError(err.message)
            setIsConfirmOpen(false)
            setProductToDelete(null)
        }
    }

    const handleTestML = async (productId) => {
        setMlLoadingProducts(prev => new Set([...prev, productId]))

        try {
            const mlRes = await fetch(
                `http://localhost:5056/api/TestMl/test-100-days?locationId=${id}&productId=${productId}`
            )
            
            if (mlRes.ok) {
                const mlData = await mlRes.json()
                
                setInventory(prev => prev.map(item => {
                    if (item.productId === productId) {
                        return {
                            ...item,
                            mlStatus: mlData.stockStatus || null,
                            mlForecast: mlData.forecast100Days || null,
                            mlDailyRate: mlData.predictedDailySales || null,
                            mlDaysOfStock: mlData.daysOfStockMl || null
                        }
                    }
                    return item
                }))
            } else {
                setInventory(prev => prev.map(item => {
                    if (item.productId === productId) {
                        return {
                            ...item,
                            mlStatus: 'ERROR',
                            mlForecast: null,
                            mlDailyRate: null,
                            mlDaysOfStock: null
                        }
                    }
                    return item
                }))
            }
        } catch (err) {
            setInventory(prev => prev.map(item => {
                if (item.productId === productId) {
                    return {
                        ...item,
                        mlStatus: 'ERROR',
                        mlForecast: null,
                        mlDailyRate: null,
                        mlDaysOfStock: null
                    }
                }
                return item
            }))
        } finally {
            setMlLoadingProducts(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
            })
        }
    }

    const safeSearchTerm = safeString(searchTerm).toLowerCase()
    const filteredInventory = useMemo(
        () => (Array.isArray(inventory) ? inventory : []).filter((item) => {
            if (!item) return false
            const matchName = safeString(item.name).toLowerCase().includes(safeSearchTerm)
            const matchCategory = safeString(item.categoryLabel).toLowerCase().includes(safeSearchTerm)
            return matchName || matchCategory
        }),
        [inventory, safeSearchTerm]
    )

    const totalPages = Math.max(1, Math.ceil(filteredInventory.length / ITEMS_PER_PAGE))
    const currentInventoryItems = filteredInventory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleExportData = () => {
        const exportData = filteredInventory.map(item => ({
            'Product Name': safeString(item.name),
            'Category': item.categoryLabel,
            'SKU': safeString(item.sku),
            'Current Stock': item.stockDetails.currentQuantity,
            'Sales (30 Days)': item.stockDetails.salesLast30Days,
            'Sales (100 Days)': item.stockDetails.salesLast100Days,
            'Stock Days Left': item.stockDetails.remainingStockDays,
            'Purchase Price': item.purchasePrice || 0,
            'Sale Price': item.salePrice || 0,
            'Status': item.stockDetails.currentQuantity === 0 ? 'Stockout' : 
                     item.stockDetails.remainingStockDays < 14 ? 'Low Stock' : 'Healthy'
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        worksheet['!cols'] = EXCEL_COLUMNS

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory')
        const fileName = `${safeString(location?.name).replace(/\s+/g, '_')}_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`
        XLSX.writeFile(workbook, fileName)
    }

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

    if (!user) {
        navigate('/auth')
        return null
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <div className="z-50 shrink-0">
                    <SideMenu activePage={activePage} onNavigate={handleNavigate} onLogout={() => navigate('/auth')} />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm max-w-md text-center">
                        <div className="text-3xl mb-3">⚠️</div>
                        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
                        <p className="mb-6 font-medium">{error}</p>
                        <button onClick={() => navigate(user?.role === 'Admin' ? '/locations' : '/')} className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                            Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#4d4dff]"></div>
                    <p className="font-medium">Loading location data...</p>
                </div>
            </div>
        )
    }

    if (!location) return null

    const profileBadge = getProfileBadge(location?.profile)

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <AddDailySaleModal 
                isOpen={!!saleProduct}
                onClose={() => setSaleProduct(null)}
                onSuccess={() => {
                    setLastSoldProduct(saleProduct?.name);
                    setSaleProduct(null);
                    setShowSaleConfirm(true);
                }}
                product={saleProduct}
                locationId={id}
            />

            
            <ConfirmationModal
                isOpen={showSaleConfirm}
                title="Sale Recorded Successfully"
                message={`The sale for ${lastSoldProduct} has been recorded.`}
                confirmText="View in Sales Log"
                cancelText="Close"
                onConfirm={() => {
                    setShowSaleConfirm(false);
                    setLastSoldProduct(null);
                    navigate(`/daily-sales/${id}`);
                }}
                onCancel={() => {
                    setShowSaleConfirm(false);
                    setLastSoldProduct(null);
                }}
                isDangerous={false}
            />
            
            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsConfirmOpen(false)
                    setProductToDelete(null)
                }}
                isDangerous={true}
            />

            <div className="z-50 shrink-0">
                <SideMenu
                    activePage={activePage}
                    onNavigate={handleNavigate}
                    onLogout={() => navigate('/auth')}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden relative pl-[64px]">
                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
                    <section className="mx-auto max-w-7xl space-y-8">
                        
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{safeString(location?.name) || 'Unknown Location'}</h1>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${profileBadge.classes}`}>
                                        {profileBadge.text}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-4">
                                    <span>ID: <span className="font-mono text-slate-400">{String(location?.locationId || '').substring(0,8)}...</span></span>
                                    <span>•</span>
                                    <span>Purchasing Power: <span className="font-medium text-slate-700">{getPurchasingPowerLabel(location?.purchasingPower)}</span></span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button onClick={handleExportData} className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Data
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Products</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{inventory.length}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Units in Stock</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{stats.totalStock}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sales (Last 30 Days)</div>
                                <div className="mt-2 text-2xl font-bold text-[#4d4dff]">{stats.totalSales30d}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Low Stock Items</div>
                                <div className="mt-2 text-2xl font-bold text-yellow-600">{stats.itemsAtRisk}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stockout Items</div>
                                <div className="mt-2 text-2xl font-bold text-red-600">{stats.itemsStockout}</div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-base font-semibold text-slate-900">Detailed Inventory</h2>
                                
                                <input 
                                    type="text" 
                                    placeholder="Search by name or category..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 w-64 rounded-lg border border-slate-200 px-3 text-sm focus:border-[#4d4dff] focus:outline-none focus:ring-1 focus:ring-[#4d4dff]"
                                />
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-slate-200 text-slate-500 bg-white">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Product Name</th>
                                            <th className="px-6 py-4 font-medium">Category</th>
                                            <th className="px-6 py-4 font-medium text-right">Current Stock</th>
                                            <th className="px-6 py-4 font-medium text-right">30d Sales</th>
                                            <th className="px-6 py-4 font-medium text-right">Stock Days Left</th>
                                            <th className="px-6 py-4 font-medium text-center">Health</th>
                                            <th className="px-6 py-4 font-medium text-center">Forecast (100d)</th>
                                            {(user?.role === 'Admin' || user?.role === 'StandManager') && (
                                                <th className="px-6 py-4 font-medium text-center">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentInventoryItems.length > 0 ? (
                                            currentInventoryItems.map((item, index) => (
                                                <tr key={item.productId || index} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{safeString(item.name) || 'Unknown Product'}</td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                            {item.categoryLabel}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                                        {item.stockDetails.currentQuantity}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[#4d4dff] font-medium">
                                                        {item.stockDetails.salesLast30Days}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-500">
                                                        {item.stockDetails.salesLast30Days === 0 ? (
                                                            <span className="text-slate-400 italic">New product</span>
                                                        ) : (
                                                            `${item.stockDetails.remainingStockDays} days`
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={getHealthConfig(item.stockDetails).classes}>{getHealthConfig(item.stockDetails).label}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <MLStatusCell 
                                                            item={item}
                                                            isLoading={mlLoadingProducts.has(item.productId)}
                                                            onTestML={() => handleTestML(item.productId)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {user?.role === 'StandManager' && (
                                                                <button
                                                                    onClick={() => setSaleProduct(item)}
                                                                    title="Record Sale"
                                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 bg-emerald-50 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-700 hover:scale-110"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            {user?.role === 'Admin' && (
                                                                <button
                                                                    onClick={() => handleDeleteProduct(item.productId, item.name)}
                                                                    title="Delete product"
                                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:scale-110"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                                                    {searchTerm ? 'No products match your search.' : 'No products found in this location.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
                                    <button 
                                        onClick={goToPrevPage} 
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                            currentPage === 1 
                                                ? 'text-slate-400 cursor-not-allowed' 
                                                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    <span className="text-sm text-slate-500">
                                        Page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
                                    </span>

                                    <button 
                                        onClick={goToNextPage} 
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                            currentPage === totalPages 
                                                ? 'text-slate-400 cursor-not-allowed' 
                                                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

            </div>
        </div>
    )
}