import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  buildStockByProductId,
  filterProductsByCategory,
  countForCategory,
} from '../utils/productHelpers'

function getAuthHeaders() {
  try {
    const stored = window.localStorage.getItem('redistribuix_auth')
    const parsed = stored ? JSON.parse(stored) : null
    return parsed?.token ? { Authorization: `Bearer ${parsed.token}` } : undefined
  } catch {
    return undefined
  }
}

export function useProductsData() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const initialLocationId = searchParams.get('locationId')
  const initialLocationName = searchParams.get('locationName')
  const initialStateCategory = location.state?.selectedCategory

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [stockVelocities, setStockVelocities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialStateCategory === 'all') return 'All'
    return initialStateCategory ?? null
  })

  useEffect(() => {
    if (location.state && typeof location.state.selectedCategory !== 'undefined') {
      const incoming = location.state.selectedCategory
      setSelectedCategory(incoming === 'all' ? 'All' : incoming)
    }
  }, [location.state])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const headers = getAuthHeaders()
      const opts = headers ? { headers } : undefined

      const [catRes, prodRes, stockRes] = await Promise.all([
        fetch('http://localhost:5056/api/v1/Product/categories', opts),
        fetch('http://localhost:5056/api/v1/Product', opts),
        fetch('http://localhost:5056/api/v1/StockVelocity', opts),
      ])

      if (!catRes.ok || !prodRes.ok || !stockRes.ok) throw new Error('Failed to fetch data')

      const [catData, prodData, stockData] = await Promise.all([
        catRes.json(),
        prodRes.json(),
        stockRes.json(),
      ])

      setCategories(Array.isArray(catData) ? catData : [])
      setProducts(Array.isArray(prodData) ? prodData : [])
      setStockVelocities(Array.isArray(stockData) ? stockData : [])
    } catch (error) {
      console.error('Error loading products data:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const displayedCategories = [...categories, 'All']

  const effectiveCategory =
    selectedCategory == null && initialLocationId ? 'All' : selectedCategory

  const filteredProducts = filterProductsByCategory(products, categories, effectiveCategory)
  const stockByProductId = buildStockByProductId(stockVelocities)

  const getCountForCategory = (name) => countForCategory(name, products, categories)

  return {
    categories,
    products,
    filteredProducts,
    stockByProductId,
    selectedCategory,
    setSelectedCategory,
    displayedCategories,
    isLoading,
    hasError,
    selectedLocationId: initialLocationId,
    selectedLocationName: initialLocationName,
    getCountForCategory,
    reload: loadData,
  }
}