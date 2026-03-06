export function formatLabel(name) {
  if (!name) return ''
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function getCategoryLabel(product, categories) {
  if (!product) return ''
  const value = product.category
  if (typeof value === 'string') return formatLabel(value)
  if (typeof value === 'number' && Array.isArray(categories) && categories[value])
    return formatLabel(categories[value])
  return ''
}

export const CATEGORY_ICONS_MAP = {
  ScreenProtector: 'screen_protector',
  PhoneCase: 'phone_case',
  Charger: 'phone-charger',
  Cable: 'usb',
  All: 'box',
}

export function getCategoryIcon(name, icons) {
  return icons[name] ?? icons['All']
}

export function buildStockByProductId(stockVelocities) {
  return stockVelocities.reduce((acc, sv) => {
    if (!sv || typeof sv.productId === 'undefined') return acc
    const qty = typeof sv.currentQuantity === 'number' ? sv.currentQuantity : 0
    acc[sv.productId] = (acc[sv.productId] ?? 0) + qty
    return acc
  }, {})
}

export function filterProductsByCategory(products, categories, selectedCategory) {
  if (selectedCategory == null) return []
  if (selectedCategory === 'All') return products

  return products.filter((product) => {
    const value = product.category
    if (typeof value === 'string') return value === selectedCategory
    if (typeof value === 'number') {
      const idx = categories.indexOf(selectedCategory)
      return idx !== -1 && value === idx
    }
    return false
  })
}


export function countForCategory(name, products, categories) {
  if (name === 'All') return products.length
  return products.filter((p) => {
    const v = p.category
    if (typeof v === 'string') return v === name
    if (typeof v === 'number') return v === categories.indexOf(name)
    return false
  }).length
}