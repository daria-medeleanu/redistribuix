import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Temporary coordinates - you should add these to your backend API response
const LOCATION_COORDINATES = {
  'Palas Mall': { lat: 47.1585, lng: 27.6014, city: 'Iași' },
  'Campus Universitar': { lat: 46.7704, lng: 23.5914, city: 'Cluj-Napoca' },
  'Aeroport Otopeni': { lat: 44.5711, lng: 26.0850, city: 'București' },
  'Centru Istoric': { lat: 44.4268, lng: 26.1025, city: 'București' },
  'Gara de Nord': { lat: 44.4478, lng: 26.0742, city: 'București' }
}

const PROFILE_LABELS = ['Student', 'Tourist', 'Business', 'Premium']
const PURCHASING_POWER_LABELS = ['Low', 'Medium', 'High']

// Custom marker component
function LocationMarker({ location, onClick }) {
  const coords = LOCATION_COORDINATES[location.name]
  if (!coords) return null

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
      position={[coords.lat, coords.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick(location)
      }}
    >
      <Popup closeButton={false}>
        <div style={{ padding: '8px', minWidth: '180px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827', fontSize: '16px' }}>
            {location.name}
          </h3>
          <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
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
      </Popup>
    </Marker>
  )
}

export default function MapComponent() {
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

        const response = await fetch('http://localhost:5056/api/v1/Location', {
          headers: authHeaders
        })

        if (!response.ok) throw new Error('Failed to fetch locations')

        const data = await response.json()
        setLocations(data)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching locations:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

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