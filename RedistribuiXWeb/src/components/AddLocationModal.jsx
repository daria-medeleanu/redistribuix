import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5056/api/v1'

const INITIAL_FORM_STATE = {
    sku: '',
    name: '',
    category: 0,
    phoneModelId: '',
    salePrice: 1,
    purchasePrice: 1,
    currentQuantity: 0
}

export default function AddProductModal({ isOpen, onClose, onSuccess, locationId }) {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE)
    
    const [phoneModels, setPhoneModels] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [skuError, setSkuError] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetch(`${API_BASE}/PhoneModel`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setPhoneModels(data)
                    }
                })
                .catch(() => setPhoneModels([]))
        }
    }, [isOpen])

    if (!isOpen) return null

    const validateSku = (sku) => {
        const skuRegex = /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/
        return skuRegex.test(sku)
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target
        
        if (name === 'sku') {
            setSkuError('')
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }))
        } else if (name === 'category') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateSku(formData.sku)) {
            setSkuError('Format invalid. Exemplu acceptat: IP15-CS-LTH')
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        const payload = {
            sku: formData.sku,
            name: formData.name,
            category: formData.category,
            salePrice: formData.salePrice,
            purchasePrice: formData.purchasePrice
        }

        if (formData.phoneModelId && formData.phoneModelId.trim() !== '') {
            payload.phoneModelId = formData.phoneModelId
        }

        try {
            const response = await fetch(`${API_BASE}/Product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || 'Failed to create product')
            }

            const productId = await response.text()

            if (locationId && formData.currentQuantity >= 0) {
                const stockPayload = {
                    locationId: locationId,
                    productId: productId.replace(/"/g, ''),
                    currentQuantity: formData.currentQuantity,
                    salesLast30Days: 0,
                    salesLast100Days: 0,
                    lastInboundDate: new Date().toISOString(),
                    lastInventoryDate: new Date().toISOString()
                }

                const stockResponse = await fetch(`${API_BASE}/StockVelocity`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(stockPayload)
                })

                if (!stockResponse.ok) {
                    throw new Error('Product created but failed to add stock')
                }
            }

            setFormData(INITIAL_FORM_STATE)
            setSkuError('')
            onSuccess()
            onClose()
        } catch (error) {
            setSubmitError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {submitError && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                        <input 
                            required 
                            type="text" 
                            name="sku" 
                            placeholder="ex: IP15-CS-LTH"
                            value={formData.sku} 
                            onChange={handleChange} 
                            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                skuError 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                            }`} 
                        />
                        {skuError && <p className="mt-1 text-xs text-red-600">{skuError}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value={0}>Case</option>
                                <option value={1}>Screen Protector</option>
                                <option value={2}>Cable</option>
                                <option value={3}>Charger</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Model</label>
                            <select name="phoneModelId" value={formData.phoneModelId} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value="">Universal (None)</option>
                                {phoneModels.map(model => (
                                    <option key={model.modelId} value={model.modelId}>
                                        {model.modelName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
                            <input required type="number" step="0.01" min="0" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price</label>
                            <input required type="number" step="0.01" min="0" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>

                    {locationId && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock Quantity</label>
                            <input required type="number" min="0" name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#4d4dff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d3dff] disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}