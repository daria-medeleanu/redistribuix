import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SideMenu from '../components/SideMenu'

function formatLabel(name) {
  if (!name) return ''
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function getCategoryLabel(product, categories) {
  if (!product) return ''
  const value = product.category
  if (typeof value === 'string') return formatLabel(value)
  if (typeof value === 'number' && Array.isArray(categories) && categories[value])
    return formatLabel(categories[value])
  return ''
}

const CATEGORY_ICONS = {
  ScreenProtector: '🛡️',
  PhoneCase: '📱',
  Charger: '⚡',
  Cable: '🔌',
  Headphones: '🎧',
  All: '✦',
}

function getCategoryIcon(name) {
  return CATEGORY_ICONS[name] ?? '◈'
}

function CategoryCard({ name, count, active, onClick }) {
  const isAll = name === 'All'
  const label = isAll ? 'All products' : formatLabel(name)
  const icon = getCategoryIcon(name)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col items-center justify-center gap-2
        h-28 w-28 md:h-35 md:w-40 rounded-full border
        transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4d4dff]/50
        ${active
          ? 'border-[#4d4dff]/70 bg-gradient-to-b from-[#eeeeff] to-[#e4e4ff] shadow-lg shadow-[#4d4dff]/20 -translate-y-0.5'
          : 'border-[#eddccf] bg-white hover:border-[#c8b8ff]/60 hover:bg-[#faf9ff] hover:shadow-md hover:shadow-[#4d4dff]/15 hover:-translate-y-0.5'
        }
      `}
    >
      {/* Active indicator dot */}
      {active && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#4d4dff]" />
      )}

      {/* Icon */}
      <span className={`text-2xl transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>

      {/* Label */}
    <span className={`text-xs font-semibold leading-tight text-center whitespace-nowrap
    ${active ? 'text-[#111827]' : 'text-[#4b5563]'}`}>
        {label}
      </span>

      {/* Count badge */}
      {count > 0 && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full leading-none
          ${active
            ? 'bg-[#4d4dff] text-white'
            : 'bg-[#f5ece4] text-[#c0391b]'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

function ProductCard({ product, categories, index }) {
  const catLabel = getCategoryLabel(product, categories)
  const price = product.salePrice?.toFixed
    ? product.salePrice.toFixed(2)
    : product.salePrice

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl border border-[#eddccf] overflow-hidden
        transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#46190c]/8 hover:border-[#d4b0a0]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4d4dff] via-[#a6a6ff] to-[#dbdbff]
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Category tag */}
           {catLabel && (
             <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#6b7280]">
               {catLabel}
             </span>
           )}

        {/* Name */}
        <h3 className="font-semibold text-[14.5px] leading-snug text-[#000000] flex-1">
          {product.name}
        </h3>

        {/* SKU */}
           <p className="text-[11px] text-[#9ca3af] font-mono tracking-wide mt-1">
          {product.sku}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#dbdbff] bg-[#dbdbff]/10">
        <span className="text-[17px] font-bold text-[#161643] tracking-tight tabular-nums">
          {price}
          <span className="text-[11px] font-normal text-[#a090b0] ml-1">RON</span>
        </span>
        <span className="text-[10px] font-semibold text-[#b07050] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View →
        </span>
      </div>
    </article>
  )
}

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const initialLocationId = searchParams.get('locationId')
  const initialLocationName = searchParams.get('locationName')

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [stockVelocities, setStockVelocities] = useState([])
  const [selectedLocationId] = useState(initialLocationId)
  const [selectedLocationName] = useState(initialLocationName)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setHasError(false)
        const storedAuth = window.localStorage.getItem('redistribuix_auth')
        const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null
        const authHeaders = parsedAuth?.token
          ? { Authorization: `Bearer ${parsedAuth.token}` }
          : undefined

        const [catResponse, prodResponse, stockResponse] = await Promise.all([
          fetch('/api/v1/Product/categories', authHeaders ? { headers: authHeaders } : undefined),
          fetch('/api/v1/Product', authHeaders ? { headers: authHeaders } : undefined),
          fetch('/api/v1/StockVelocity', authHeaders ? { headers: authHeaders } : undefined),
        ])
        if (!catResponse.ok || !prodResponse.ok || !stockResponse.ok)
          throw new Error('Failed to fetch categories, products or stock')
        const catData = await catResponse.json()
        const prodData = await prodResponse.json()
        const stockData = await stockResponse.json()
        setCategories(Array.isArray(catData) ? catData : [])
        setProducts(Array.isArray(prodData) ? prodData : [])
        setStockVelocities(Array.isArray(stockData) ? stockData : [])
      } catch (error) {
        console.error('Error loading data', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const displayedCategories = [...categories, 'All']

  const countFor = (name) => {
    if (name === 'All') return products.length
    return products.filter((p) => {
      const v = p.category
      if (typeof v === 'string') return v === name
      if (typeof v === 'number') return v === categories.indexOf(name)
      return false
    }).length
  }

  // If we came from a specific location (via query string),
  // treat "no category selected" as "All" for that location.
  const effectiveCategory = selectedCategory == null && selectedLocationId ? 'All' : selectedCategory

  const categoryFilteredProducts =
    effectiveCategory == null
      ? []
      : effectiveCategory === 'All'
      ? products
      : products.filter((product) => {
          const value = product.category
          if (typeof value === 'string') return value === effectiveCategory
          if (typeof value === 'number') {
            const idx = categories.indexOf(effectiveCategory)
            return idx !== -1 && value === idx
          }
          return false
        })

  // Show only products with stock (CurrentQuantity > 0), for selected category
  let filteredProducts = categoryFilteredProducts
  if (stockVelocities.length > 0) {
    const stockProductIds = new Set(
      stockVelocities
        .filter((sv) => sv.currentQuantity > 0)
        .map((sv) => sv.productId)
    )
    filteredProducts = categoryFilteredProducts.filter((p) => stockProductIds.has(p.productId))
  }

  return (
	<div className="min-h-screen bg-white text-[#4b5563] flex pl-16">
      <SideMenu
        activePage="products"
        onNavigate={() => {}}
        userName="Alexia"
        onLogout={() => {}}
      />

      <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto">

        {/* ── Page header ── */}
        <header className="mb-7 flex flex-col items-center text-center">
          <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#2e0e04] mb-1">
            My{' '}
            <em className="italic font-light text-[#4d4dff]">products</em>
          </h1>
          <p className="text-[0.9rem] text-[#8a5a43] max-w-md">
            Browse the products in your catalog by category and quickly spot what matters.
          </p>
        </header>

        {isLoading && (
          <div className="flex items-center gap-3 text-sm text-[#8a5a43] py-4">
            <svg className="w-4 h-4 animate-spin text-[#c0391b]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading categories and products from backend…
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 max-w-sm">
            <span className="text-base">⚠️</span>
            Could not load categories or products. Please try again later.
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {/* ── Category cards ── */}
            <div className="flex flex-wrap items-center justify-center gap-12 mb-12">
              {displayedCategories.map((name) => (
                <CategoryCard
                  key={name}
                  name={name}
                  count={countFor(name)}
                  active={selectedCategory === name}
                  onClick={() => setSelectedCategory(name)}
                />
              ))}
            </div>

            {/* ── Products area ── */}
            {selectedCategory == null ? (
              <div className="flex flex-col items-center justify-center flex-1 py-24 gap-4 opacity-40 select-none">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#c0a090] flex items-center justify-center text-xl text-[#8a5a43]">
                  ✦
                </div>
                <p className="text-sm text-[#8a5a43]">Select a category above to explore products</p>
              </div>
            ) : (
              <section>
                {/* Section label */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#b07050]">
                      {selectedCategory === 'All'
                        ? `All ${products.length} products`
                        : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} · ${formatLabel(selectedCategory)}`}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#e6d0c2] to-transparent" />
                </div>

                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-[#a07060] py-8">
                    No products found for this category.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, i) => (
                      <ProductCard
                        key={product.productId}
                        product={product}
                        categories={categories}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsPage