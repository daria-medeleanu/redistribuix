import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { useProductsData } from '../hooks/useProductsData'
import { formatLabel } from '../utils/productHelpers'

function ProductsPage() {
  const {
    categories,
    products,
    filteredProducts,
    stockByProductId,
    selectedCategory,
    setSelectedCategory,
    displayedCategories,
    isLoading,
    hasError,
    getCountForCategory,
  } = useProductsData()

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 pl-16">
      <SideMenu
        activePage="products"
        onNavigate={handleNavigate}
        userName="Alexia"
        onLogout={handleLogout}
        role="Admin"
      />

      <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto ml-16 relative z-10">

        <header className="mb-7 flex flex-col items-center text-center">
          <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#2e0e04] mb-1">
            My{' '}
            <em className="italic font-light text-[#4d4dff]">products</em>
          </h1>
          <p className="text-[0.9rem] text-[#000000] max-w-md">
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
            <div className="flex flex-wrap items-center justify-center gap-12 mb-12">
              {displayedCategories.map((name) => (
                <CategoryCard
                  key={name}
                  name={name}
                  count={getCountForCategory(name)}
                  active={selectedCategory === name}
                  onClick={() => setSelectedCategory(name)}
                />
              ))}
            </div>

            {selectedCategory == null ? (
              <EmptyPrompt />
            ) : (
              <ProductsSection
                selectedCategory={selectedCategory}
                products={products}
                filteredProducts={filteredProducts}
                categories={categories}
                stockByProductId={stockByProductId}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 gap-4 opacity-40 select-none">
      <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#4d4dff] flex items-center justify-center text-xl text-[#4d4dff]">
        ✦
      </div>
      <p className="text-sm text-[#3e3e8a]">Select a category above to explore products</p>
    </div>
  )
}

function ProductsSection({ selectedCategory, products, filteredProducts, categories, stockByProductId }) {
  const sectionLabel =
    selectedCategory === 'All'
      ? `All ${products.length} products`
      : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} · ${formatLabel(selectedCategory)}`

  return (
    <section>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#3e3e8a]">
          {sectionLabel}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#a6a6ff] to-transparent" />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-sm text-[#a07060] py-8">No products found for this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.productId}
              product={product}
              categories={categories}
              index={i}
              stockQuantity={stockByProductId[product.productId] ?? 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductsPage