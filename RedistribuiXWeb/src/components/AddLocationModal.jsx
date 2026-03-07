import { useState } from 'react'

const API_BASE = 'http://localhost:5056/api/v1'

const PROFILE_OPTIONS = [
    { value: 0, label: 'University' },
    { value: 1, label: 'Touristic' },
    { value: 2, label: 'Transit' },
    { value: 3, label: 'Mixed' }
]

const PURCHASING_POWER_OPTIONS = [
    { value: 0, label: 'Budget' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Premium' }
]

const geocodeLocation = async (county, locality, address = '') => {
    // Try with specific address first if provided
    if (address && address.trim()) {
        const addressQuery = `${address}, ${locality}, ${county}, Romania`
        
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&addressdetails=1&limit=1`,
                {
                    headers: {
                        'User-Agent': 'RedistribuiX/1.0'
                    }
                }
            )
            
            const data = await response.json()
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    isSpecific: true
                }
            }
        } catch (err) {
            console.log('Address not found, falling back to locality center')
        }
    }
    
    // Fallback to locality center
    const localityQuery = `${locality}, ${county}, Romania`
    
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localityQuery)}&format=json&addressdetails=1&limit=1`,
        {
            headers: {
                'User-Agent': 'RedistribuiX/1.0'
            }
        }
    )
    
    const data = await response.json()
    
    if (data && data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            isSpecific: false
        }
    }
    
    throw new Error('No coordinates found for this location')
}

export default function AddLocationModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        county: '',
        locality: '',
        profile: 1,
        purchasingPower: 1
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [nameError, setNameError] = useState('')
    const [countyError, setCountyError] = useState('')
    const [localityError, setLocalityError] = useState('')

    if (!isOpen) return null

    const validateName = (name) => name.trim().length > 0

    const handleChange = (e) => {
        const { name, value, type } = e.target

        if (name === 'name') {
            setNameError('')
            setFormData(prev => ({ ...prev, [name]: value }))
        } else if (name === 'address') {
            setFormData(prev => ({ ...prev, [name]: value }))
        } else if (name === 'county') {
            setCountyError('')
            setFormData(prev => ({ ...prev, [name]: value }))
        } else if (name === 'locality') {
            setLocalityError('')
            setFormData(prev => ({ ...prev, [name]: value }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'select-one' ? parseInt(value, 10) : value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate all fields
        let hasError = false
        
        if (!validateName(formData.name)) {
            setNameError('Location name is required')
            hasError = true
        }
        
        if (!formData.county.trim()) {
            setCountyError('County is required')
            hasError = true
        }
        
        if (!formData.locality.trim()) {
            setLocalityError('Locality is required')
            hasError = true
        }
        
        if (hasError) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            // Get coordinates from geocoding
            const { lat, lon, isSpecific } = await geocodeLocation(
                formData.county.trim(), 
                formData.locality.trim(),
                formData.address.trim()
            )
            
            const payload = {
                Name: formData.name.trim(),
                Address: formData.address.trim() || null,
                County: formData.county.trim(),
                Locality: formData.locality.trim(),
                Latitude: lat,
                Longitude: lon,
                Profile: formData.profile,
                PurchasingPower: formData.purchasingPower
            }
            console.log(payload, isSpecific ? '(specific address)' : '(locality center)');
            const response = await fetch(`${API_BASE}/Location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || 'Failed to create location')
            }

            setFormData({ name: '', address: '', county: '', locality: '', profile: 1, purchasingPower: 1 })
            setNameError('')
            setCountyError('')
            setLocalityError('')
            onSuccess()
            onClose()
        } catch (error) {
            setSubmitError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Add New Location</h2>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            placeholder="ex: Mall Vitan"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                nameError
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                        />
                        {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Street Address <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="ex: Strada Palat 1"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">If not provided, location will use locality center</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">County</label>
                            <input
                                required
                                type="text"
                                name="county"
                                placeholder="ex: Iași"
                                value={formData.county}
                                onChange={handleChange}
                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                    countyError
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                            />
                            {countyError && <p className="mt-1 text-xs text-red-600">{countyError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
                            <input
                                required
                                type="text"
                                name="locality"
                                placeholder="ex: Iași"
                                value={formData.locality}
                                onChange={handleChange}
                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                    localityError
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                            />
                            {localityError && <p className="mt-1 text-xs text-red-600">{localityError}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Profile</label>
                            <select
                                name="profile"
                                value={formData.profile}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                {PROFILE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Purchasing Power</label>
                            <select
                                name="purchasingPower"
                                value={formData.purchasingPower}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                {PURCHASING_POWER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-[#4d4dff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d3dff] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Location'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
