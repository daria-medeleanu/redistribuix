import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Tooltip, Popup, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PROFILE_LABELS = ['University', 'Touristic', 'Transit', 'Mixed']
const PURCHASING_POWER_LABELS = ['Budget', 'Medium', 'Premium']

const ROMANIA_CENTER = [45.9432, 24.9668]
const ROMANIA_ZOOM = 6.5

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

function LocationMarker({ location, onClick }) {
  if (!location.latitude || !location.longitude) return null

  const profileLabel = PROFILE_LABELS[location.profile] || 'Unknown'
  const purchasingLabel = PURCHASING_POWER_LABELS[location.purchasingPower] || 'Unknown'

  const getMarkerColor = (profile) => {
    switch (profile) {
      case 0: return '#10b981' // Emerald for University
      case 1: return '#f59e0b' // Amber for Touristic
      case 2: return '#8b5cf6' // Purple for Transit
      case 3: return '#4d4dff' // Blue for Mixed
      default: return '#64748b' 
    }
  }

  const markerColor = getMarkerColor(location.profile)

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #ffffff;
        border: 3px solid ${markerColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        left: -16px;
        top: -32px;
        cursor: pointer;
      ">
        <div style="
          transform: rotate(45deg);
          width: 12px;
          height: 12px;
          background: ${markerColor};
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
    tooltipAnchor: [0, -36]
  })

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
    >
      {/* Tooltip modificat pentru a include Orasul si Profilul */}
      <Tooltip direction="top" opacity={1} className="custom-leaflet-tooltip-small">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
            {location.name}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg style={{ width: '10px', height: '10px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location.locality}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: markerColor, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            • {profileLabel}
          </span>
        </div>
      </Tooltip>

      {/* Popup-ul ramane neschimbat, cu butonul de navigare */}
      <Popup closeButton={false} className="custom-leaflet-popup">
        <div style={{ minWidth: '190px' }}>
          <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '16px', marginBottom: '4px' }}>
            {location.name}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location.locality}, {location.county}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
              {profileLabel}
            </span>
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
              {purchasingLabel}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              onClick(location)
            }}
            className="w-full bg-[#4d4dff] hover:bg-[#3d3dff] text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            View Inventory
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </Popup>
    </Marker>
  )
}

export default function MapComponent({ locationId }) {
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [mapCenter, setMapCenter] = useState(ROMANIA_CENTER)
  const [mapZoom, setMapZoom] = useState(ROMANIA_ZOOM)
  
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchLocations() {
      try {
        const storedAuth = window.localStorage.getItem('redistribuix_auth')
        const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null
        const authHeaders = parsedAuth?.token ? { Authorization: `Bearer ${parsedAuth.token}` } : {}

        const endpoint = locationId 
          ? `http://localhost:5056/api/v1/Location/${locationId}`
          : 'http://localhost:5056/api/v1/Location'

        const response = await fetch(endpoint, { headers: authHeaders })
        if (!response.ok) throw new Error('Failed to fetch locations')

        const data = await response.json()
        const locArray = locationId ? [data] : data
        
        setLocations(locArray)
        
        if (locationId && locArray[0]?.latitude) {
          setMapCenter([locArray[0].latitude, locArray[0].longitude])
          setMapZoom(14)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching locations:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [locationId])

  const handleMarkerClick = (location) => {
    navigate(`/locations/${location.locationId}`, { state: { location } })
  }

  const handleResetView = () => {
    setMapCenter([...ROMANIA_CENTER])
    setMapZoom(ROMANIA_ZOOM)
  }

  const filteredLocations = activeFilter === 'All' 
    ? locations 
    : locations.filter(loc => loc.profile === parseInt(activeFilter))

  const stats = {
    total: locations.length,
    university: locations.filter(l => l.profile === 0).length,
    touristic: locations.filter(l => l.profile === 1).length,
    transit: locations.filter(l => l.profile === 2).length,
    mixed: locations.filter(l => l.profile === 3).length,
  }

  if (isLoading) {
    return (
      <div className="h-[500px] w-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#4d4dff] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium">Loading network map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-red-50 rounded-2xl border border-red-100">
        <div className="text-center text-red-500">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="font-bold">Map Unavailable</div>
          <div className="text-sm opacity-80 mt-1">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      
      {!locationId && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 w-48">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Network Stats</h3>
          <div className="text-3xl font-black text-slate-800 mb-4">{stats.total} <span className="text-sm font-medium text-slate-500">locations</span></div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600 font-medium">University</span>
              </div>
              <span className="font-bold text-slate-800">{stats.university}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-slate-600 font-medium">Touristic</span>
              </div>
              <span className="font-bold text-slate-800">{stats.touristic}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                <span className="text-slate-600 font-medium">Transit</span>
              </div>
              <span className="font-bold text-slate-800">{stats.transit}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4d4dff]"></div>
                <span className="text-slate-600 font-medium">Mixed</span>
              </div>
              <span className="font-bold text-slate-800">{stats.mixed}</span>
            </div>
          </div>
        </div>
      )}

      {!locationId && (
        <div className="absolute top-4 right-4 z-[1000] flex flex-wrap justify-end gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/50 max-w-[60%]">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === 'All' ? 'bg-slate-800 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('0')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === '0' ? 'bg-emerald-500 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            Univ
          </button>
          <button 
            onClick={() => setActiveFilter('1')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === '1' ? 'bg-amber-500 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            Touristic
          </button>
          <button 
            onClick={() => setActiveFilter('2')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === '2' ? 'bg-purple-500 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            Transit
          </button>
          <button 
            onClick={() => setActiveFilter('3')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === '3' ? 'bg-[#4d4dff] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
          >
            Mixed
          </button>
        </div>
      )}

      <button 
        onClick={handleResetView}
        title="Recenter Map"
        className="absolute bottom-6 left-4 z-[1000] bg-white text-slate-700 p-3 rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 hover:text-[#4d4dff] transition-all flex items-center justify-center group"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

      <MapContainer
        center={ROMANIA_CENTER}
        zoom={ROMANIA_ZOOM}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />
        
        {filteredLocations.map((location) => (
          <LocationMarker
            key={location.locationId}
            location={location}
            onClick={handleMarkerClick}
          />
        ))}
      </MapContainer>
      
      <style>{`
        .custom-leaflet-tooltip-small {
          background: white !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
        }
        .custom-leaflet-tooltip-small::before { border-top-color: white !important; }
        
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #f1f5f9;
          padding: 0;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 16px;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
        }
        
        .custom-marker:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </div>
  )
}