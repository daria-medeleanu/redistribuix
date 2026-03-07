import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PROFILE_LABELS = ['University', 'Touristic', 'Transit', 'Mixed']
const PURCHASING_POWER_LABELS = ['Budget', 'Medium', 'Premium']

function LocationMarker({ location, onClick }) {
  // Check if location has valid coordinates
  if (!location.latitude || !location.longitude) {
    console.warn(`Location ${location.name} missing coordinates`)
    return null
  }

  const profileLabel = PROFILE_LABELS[location.profile] || 'Unknown'
  const purchasingLabel = PURCHASING_POWER_LABELS[location.purchasingPower] || 'Unknown'

  // Create custom icon
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4d4dff 0%, #7c7cff 100%);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(77, 77, 255, 0.4);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        position: relative;
        left: -20px;
        top: -20px;
      ">
        ${location.name[0]}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick(location)
      }}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
        <div style={{ padding: '4px 8px', minWidth: '120px' }}>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px', marginBottom: '4px' }}>
            {location.name}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {location.locality}, {location.county}
          </div>
        </div>
      </Tooltip>
      {/* <Popup closeButton={false}>
        <div style={{ padding: '8px', minWidth: '180px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827', fontSize: '16px' }}>
            {location.name}
          </h3>
          <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: 500 }}>Location:</span> {location.locality}, {location.county}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: 500 }}>Profile:</span> {profileLabel}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 500 }}>Purchasing Power:</span> {purchasingLabel}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
              Click marker to view details →
            </div>
          </div>
        </div>
      </Popup> */}
    </Marker>
  )
}

export default function MapComponent({ locationId }) {
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch locations from API
  useEffect(() => {
    async function fetchLocations() {
      try {
        const storedAuth = window.localStorage.getItem('redistribuix_auth')
        const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null
        const authHeaders = parsedAuth?.token
          ? { Authorization: `Bearer ${parsedAuth.token}` }
          : {}

        // If locationId is provided, fetch single location; otherwise fetch all
        const endpoint = locationId 
          ? `http://localhost:5056/api/v1/Location/${locationId}`
          : 'http://localhost:5056/api/v1/Location'

        const response = await fetch(endpoint, {
          headers: authHeaders
        })

        if (!response.ok) throw new Error('Failed to fetch locations')

        const data = await response.json()
        
        // If single location, wrap in array for consistent handling
        setLocations(locationId ? [data] : data)
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
    navigate(`/locations/${location.locationId}`, {
      state: { location }
    })
  }

  if (isLoading) {
    return (
      <div style={{ 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f9fafb',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
          <div>Loading locations...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca'
      }}>
        <div style={{ textAlign: 'center', color: '#dc2626' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div>Error loading map: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      height: '500px', 
      width: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <MapContainer
        center={[45.8, 25.5]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <LocationMarker
            key={location.locationId}
            location={location}
            onClick={handleMarkerClick}
          />
        ))}
      </MapContainer>
    </div>
  )
}