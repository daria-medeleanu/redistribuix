import { getCategoryLabel } from '../utils/productHelpers'

function ProductCard({ product, categories, index, stockQuantity }) {
  const catLabel = getCategoryLabel(product, categories)
  const price = product.salePrice?.toFixed
    ? product.salePrice.toFixed(2)
    : product.salePrice
  const quantity = typeof stockQuantity === 'number' ? stockQuantity : 0

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden
        transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#46190c]/8 hover:border-[#4d4dff]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#4d4dff] via-[#a6a6ff] to-[#dbdbff]
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col gap-2 flex-1">
        {catLabel && (
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#6b7280]">
            {catLabel}
          </span>
        )}

        <h3 className="font-semibold text-[14.5px] leading-snug text-[#000000] flex-1">
          {product.name}
        </h3>

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
        <span
          className={`text-[11px] font-medium ${
            quantity > 0 ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {quantity > 0 ? `${quantity} in stock` : 'Out of stock'}
        </span>
      </div>
    </article>
  )
}

export default ProductCard