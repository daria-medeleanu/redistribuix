import { useEffect, useState } from 'react'

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
    if (address && address.trim()) {
        const addressQuery = `${address}, ${locality}, ${county}, Romania`
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&addressdetails=1&limit=1`,
                { headers: { 'User-Agent': 'RedistribuiX/1.0' } }
            )
            const data = await response.json()
            if (data && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), isSpecific: true }
            }
        } catch (err) {
            console.log('Address not found, falling back to locality center')
        }
    }
    
    const localityQuery = `${locality}, ${county}, Romania`
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localityQuery)}&format=json&addressdetails=1&limit=1`,
        { headers: { 'User-Agent': 'RedistribuiX/1.0' } }
    )
    const data = await response.json()
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), isSpecific: false }
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

    const [standManagerData, setStandManagerData] = useState({
        addStandManager: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [existingLocations, setExistingLocations] = useState([])
    const [transportCosts, setTransportCosts] = useState({})

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [nameError, setNameError] = useState('')
    const [countyError, setCountyError] = useState('')
    const [localityError, setLocalityError] = useState('')
    const [standManagerErrors, setStandManagerErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' })

    useEffect(() => {
        if (!isOpen) return
        fetch(`${API_BASE}/Location`)
            .then((res) => res.json())
            .then((data) => {
                setExistingLocations(Array.isArray(data) ? data : [])
            })
            .catch(() => setExistingLocations([]))
    }, [isOpen])

    if (!isOpen) return null

    const validateName = (name) => name.trim().length > 0
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const validatePassword = (password) => password.length >= 6

    const parseLocationId = (raw) => {
        if (!raw) return null
        if (typeof raw === 'string') return raw.replace(/"/g, '')
        if (typeof raw === 'object' && raw.id) return String(raw.id)
        return String(raw).replace(/"/g, '')
    }

    const handleTransportCostChange = (destinationId, value) => {
        setTransportCosts((prev) => ({ ...prev, [String(destinationId)]: value }))
    }

    const handleStandManagerChange = (e) => {
        const { name, value, checked } = e.target
        if (name === 'addStandManager') {
            setStandManagerData(prev => ({ ...prev, addStandManager: checked }))
        } else if (['smName', 'smEmail', 'smPassword', 'smConfirmPassword'].includes(name)) {
            const fieldKey = name === 'smName' ? 'name' : name === 'smEmail' ? 'email' : name === 'smPassword' ? 'password' : 'confirmPassword'
            setStandManagerData(prev => ({ ...prev, [fieldKey]: value }))
            setStandManagerErrors(prev => ({ ...prev, [fieldKey]: '' }))
        }
    }

    const validateStandManager = () => {
        if (!standManagerData.addStandManager) return true
        let hasError = false
        const errors = {}

        if (!standManagerData.name.trim()) { errors.name = 'Name is required'; hasError = true }
        if (!validateEmail(standManagerData.email)) { errors.email = 'Valid email required'; hasError = true }
        if (!validatePassword(standManagerData.password)) { errors.password = 'Min 6 characters'; hasError = true }
        if (standManagerData.password !== standManagerData.confirmPassword) { errors.confirmPassword = 'Passwords mismatch'; hasError = true }

        setStandManagerErrors(errors)
        return !hasError
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target
        if (name === 'name') setNameError('')
        if (name === 'county') setCountyError('')
        if (name === 'locality') setLocalityError('')
        
        setFormData(prev => ({ ...prev, [name]: type === 'select-one' ? parseInt(value, 10) : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let hasError = false
        
        if (!validateName(formData.name)) { setNameError('Location name is required'); hasError = true }
        if (!formData.county.trim()) { setCountyError('County is required'); hasError = true }
        if (!formData.locality.trim()) { setLocalityError('Locality is required'); hasError = true }

        const hasInvalidTransportCost = Object.values(transportCosts).some(v => {
            if (v === '' || v == null) return false
            const num = Number(v)
            return Number.isNaN(num) || num < 0
        })

        if (hasInvalidTransportCost) {
            setSubmitError('Transport costs must be numeric values >= 0')
            hasError = true
        }

        if (!validateStandManager()) hasError = true
        if (hasError) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const { lat, lon } = await geocodeLocation(formData.county.trim(), formData.locality.trim(), formData.address.trim())
            
            const locationPayload = {
                Name: formData.name.trim(),
                Address: formData.address.trim() || null,
                County: formData.county.trim(),
                Locality: formData.locality.trim(),
                Latitude: lat,
                Longitude: lon,
                Profile: formData.profile,
                PurchasingPower: formData.purchasingPower
            }
            
            const locationResponse = await fetch(`${API_BASE}/Location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(locationPayload)
            })

            if (!locationResponse.ok) throw new Error(await locationResponse.text() || 'Failed to create location')

            const locationId = parseLocationId(await locationResponse.json())
            if (!locationId) throw new Error('Invalid location ID returned')

            const transportEntries = Object.entries(transportCosts)
                .filter(([, cost]) => cost !== '' && cost != null)
                .map(([destinationId, cost]) => ({
                    SourceLocationId: locationId,
                    DestinationLocationId: destinationId,
                    Cost: Number(cost)
                }))

            if (transportEntries.length > 0) {
                const transportResponses = await Promise.all(transportEntries.map(p =>
                    fetch(`${API_BASE}/TransportCost`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(p)
                    })
                ))
                if (transportResponses.some(r => !r.ok)) throw new Error('Failed to save transport costs')
            }

            if (standManagerData.addStandManager) {
                const smResponse = await fetch(`${API_BASE}/StandManager`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Name: standManagerData.name.trim(),
                        Email: standManagerData.email.trim(),
                        Password: standManagerData.password,
                        LocationId: locationId
                    })
                })
                if (!smResponse.ok) throw new Error(await smResponse.text() || 'Failed to create stand manager')
            }

            setFormData({ name: '', address: '', county: '', locality: '', profile: 1, purchasingPower: 1 })
            setStandManagerData({ addStandManager: false, name: '', email: '', password: '', confirmPassword: '' })
            setTransportCosts({})
            onSuccess()
            onClose()
        } catch (error) {
            setSubmitError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
                
                <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">Add New Location</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {submitError && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                            {submitError}
                        </div>
                    )}

                    <form id="addLocationForm" onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
                        
                        <div className="flex-1 space-y-5">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Location Details</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="ex: Mall Vitan"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
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
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="mt-1.5 text-xs text-slate-500">If left empty, map coordinates will default to the locality center.</p>
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
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${countyError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
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
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${localityError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
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
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        {PROFILE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Purchasing Power</label>
                                    <select
                                        name="purchasingPower"
                                        value={formData.purchasingPower}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        {PURCHASING_POWER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-5 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${standManagerData.addStandManager ? 'bg-[#4d4dff] border-[#4d4dff]' : 'border-slate-300 group-hover:border-[#4d4dff]'}`}>
                                        {standManagerData.addStandManager && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="addStandManager"
                                        checked={standManagerData.addStandManager}
                                        onChange={handleStandManagerChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Assign a Stand Manager</span>
                                </label>
                            </div>

                            {standManagerData.addStandManager && (
                                <div className="space-y-4 p-5 bg-slate-50/80 rounded-xl border border-slate-200">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="smName"
                                            value={standManagerData.name}
                                            onChange={handleStandManagerChange}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${standManagerErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                        />
                                        {standManagerErrors.name && <p className="mt-1 text-xs text-red-600">{standManagerErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="smEmail"
                                            value={standManagerData.email}
                                            onChange={handleStandManagerChange}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${standManagerErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                        />
                                        {standManagerErrors.email && <p className="mt-1 text-xs text-red-600">{standManagerErrors.email}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                name="smPassword"
                                                value={standManagerData.password}
                                                onChange={handleStandManagerChange}
                                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${standManagerErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                            />
                                            {standManagerErrors.password && <p className="mt-1 text-xs text-red-600">{standManagerErrors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Confirm</label>
                                            <input
                                                type="password"
                                                name="smConfirmPassword"
                                                value={standManagerData.confirmPassword}
                                                onChange={handleStandManagerChange}
                                                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${standManagerErrors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                            />
                                            {standManagerErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{standManagerErrors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block w-px bg-slate-200 shrink-0 mx-2"></div>

                        <div className="flex-1 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Transport Logistics</h3>
                            <p className="text-xs text-slate-500 mb-4">Set default one-way transport costs to existing locations. Leave blank if not applicable.</p>
                            
                            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col overflow-hidden min-h-[300px]">
                                <div className="grid grid-cols-[1fr_120px] gap-3 px-4 py-3 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                                    <span>Destination</span>
                                    <span className="text-right">Cost (RON)</span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {existingLocations.length > 0 ? existingLocations.map((loc) => {
                                        const destinationId = String(loc.locationId)
                                        return (
                                            <div key={destinationId} className="grid grid-cols-[1fr_120px] items-center gap-3 rounded-lg hover:bg-white p-2 transition-colors">
                                                <span className="text-[0.85rem] font-medium text-slate-700 truncate" title={loc.name}>
                                                    {loc.name}
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={transportCosts[destinationId] ?? ''}
                                                    onChange={(e) => handleTransportCostChange(destinationId, e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-right focus:border-[#4d4dff] focus:outline-none focus:ring-1 focus:ring-[#4d4dff] bg-white"
                                                />
                                            </div>
                                        )
                                    }) : (
                                        <div className="flex items-center justify-center h-full text-sm text-slate-400 italic">
                                            No other locations available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl shrink-0 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="addLocationForm"
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#4d4dff] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3d3dff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                        {isSubmitting ? 'Processing...' : 'Save Location'}
                    </button>
                </div>
            </div>
        </div>
    )
}