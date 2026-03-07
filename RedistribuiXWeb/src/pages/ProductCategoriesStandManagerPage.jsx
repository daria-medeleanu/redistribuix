import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import AddProductModal from '../components/AddProductModal'
import iphoneIcon from '../assets/icons/phone_case.png'
import screenProtectorIcon from '../assets/icons/screen_protector.png'
import cableIcon from '../assets/icons/usb.png'
import chargerIcon from '../assets/icons/phone-charger.png'
import boxIcon from '../assets/icons/box.png'

const API_BASE = 'http://localhost:5056/api/v1'

const getAuthUser = () => {
  try {
    const auth = window.localStorage.getItem('redistribuix_auth')
    return auth ? JSON.parse(auth) : null
  } catch {
    return null
  }
}

const CATEGORIES = [
  { id: 0, name: 'Case', icon: iphoneIcon, isImage: true },
  { id: 1, name: 'Screen Protector', icon: screenProtectorIcon, isImage: true },
  { id: 2, name: 'Cable', icon: cableIcon, isImage: true },
  { id: 3, name: 'Charger', icon: chargerIcon, isImage: true },
  { id: 'all', name: 'All Products', icon: boxIcon, isImage: true },
]

const getCategoryLabel = (categoryId) => {
  const category = CATEGORIES.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

const getCategoryIcon = (categoryId) => {
  const category = CATEGORIES.find(c => c.id === categoryId)
  return category ? category.icon : '📦'
}

export default function ProductCategoriesStandManagerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getAuthUser()

  const [activePage, setActivePage] = useState('products')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  useEffect(() => {
    if (selectedCategory !== null) {
      setActivePage(`product_${selectedCategory}`);
    } else {
      setActivePage('products');
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!user?.locationId) return
      
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE}/Product/by-location/${user?.locationId}`)
        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        const productsArray = Array.isArray(data) ? data : []
        setAllProducts(productsArray)

        if (location.state?.selectedCategory !== undefined && location.state?.selectedCategory !== null) {
          const categoryId = location.state.selectedCategory
          
          if (categoryId === 'all') {
            setProducts(productsArray)
          } else {
            const filteredProducts = productsArray.filter(
              p => (p.productCategory ?? p.category) === categoryId
            )
            setProducts(filteredProducts)
          }
          setSelectedCategory(categoryId)
        } else {
          setSelectedCategory(null)
          setProducts([])
        }
      } catch (err) {
        setError(err.message)
        setAllProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllProducts()
  }, [location.state, refreshTrigger, user?.locationId])

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId)
    setSearchTerm('')
    
    if (categoryId === 'all') {
      setProducts(allProducts)
    } else {
      const filteredProducts = allProducts.filter(
        p => (p.productCategory ?? p.category) === categoryId
      )
      setProducts(filteredProducts)
    }
  }

  const handleNavigate = (pageId) => {
    if (pageId === 'home') navigate('/home')
    else if (pageId === 'locations') navigate('/locations')
    else if (pageId === 'profile') navigate('/profile')
    else if (pageId === 'products') {
      navigate('/products', { state: { selectedCategory: null } })
    } 
    else if (pageId.startsWith('product_')) {
      const catIdRaw = pageId.split('_')[1];
      const catId = catIdRaw === 'all' ? 'all' : parseInt(catIdRaw, 10);
      navigate('/products', { state: { selectedCategory: catId } })
    }
  }

  const handleLogout = () => navigate('/auth')

  const filteredProducts = searchTerm
    ? products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />

      <div className="z-50 shrink-0">
        <SideMenu
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative pl-25">
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <section className="mx-auto max-w-7xl space-y-8">
            
            <header className="mb-7 flex flex-col items-center text-center">
              <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[000000] mb-1">
                My{' '}
                <em className="italic font-light text-[#4d4dff]">products</em>
              </h1>
              <p className="text-[0.9rem] text-[000000] max-w-md">
                Browse the products in your catalog by category and quickly spot what matters.
              </p>
            </header>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-center gap-3">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            {isLoading && selectedCategory === null && (
              <div className="flex items-center justify-center h-40 text-slate-500">Loading products...</div>
            )}

            {selectedCategory === null ? (
              <div className="flex flex-wrap items-center justify-center gap-8">
                {CATEGORIES.map(category => {
                  const count = category.id === 'all' 
                    ? allProducts.length 
                    : allProducts.filter(p => (p.productCategory ?? p.category) === category.id).length

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelectCategory(category.id)}
                      className="group relative flex flex-col items-center justify-center gap-3 h-48 w-48 rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-200 ease-out hover:border-[#4d4dff] hover:shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4d4dff]/50 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-18 h-18 rounded-full bg-slate-50 overflow-hidden transition-transform duration-200 group-hover:scale-105">
                        <img src={category.icon} alt={category.name} className="w-14 h-14 object-contain" />
                      </div>

                      <span className="text-sm font-semibold leading-tight text-center text-[#4b5563]">
                        {category.name}
                      </span>

                      {count > 0 && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full leading-none bg-[#dbdbff] text-[#4d4dff]">
                          {count} types
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => handleNavigate('products')}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    ← Back to Categories
                  </button>
                  <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                    {(() => {
                      const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory)

                      if (selectedCategoryData?.isImage) {
                        return (
                          <>
                            <img
                              src={selectedCategoryData.icon}
                              alt={selectedCategoryData.name}
                              className="w-10 h-10"
                            />
                            <span>{selectedCategoryData.name}</span>
                          </>
                        )
                      }

                      return (
                        <>
                          {getCategoryIcon(selectedCategory)} {getCategoryLabel(selectedCategory)}
                        </>
                      )
                    })()}
                  </h2>
                  <span className="ml-auto px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                    {filteredProducts.length} types
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                    <input
                      type="text"
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-[#4d4dff] focus:outline-none focus:ring-1 focus:ring-[#4d4dff]"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-slate-200 text-slate-500 bg-white">
                        <tr>
                          <th className="px-6 py-4 font-medium">Product Name</th>
                          <th className="px-6 py-4 font-medium">SKU</th>
                          <th className="px-6 py-4 font-medium text-right">Purchase Price</th>
                          <th className="px-6 py-4 font-medium text-right">Sale Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product, index) => (
                            <tr key={product.productId || index} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900">{product.name || 'Unknown'}</td>
                              <td className="px-6 py-4 text-slate-500">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                  {product.sku || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-slate-900 font-medium">
                               {(product.purchasePrice || 0).toFixed(2)} RON
                              </td>
                              <td className="px-6 py-4 text-right text-[#4d4dff] font-medium">
                               {(product.salePrice || 0).toFixed(2)} RON
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                              {searchTerm ? 'No products match your search.' : 'No products in this category.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}