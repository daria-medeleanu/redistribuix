import { useNavigate, useParams, useLocation } from 'react-router-dom'
import SideMenu from '../components/SideMenu'

const PROFILE_LABELS = ['Student', 'Tourist', 'Business', 'Premium']
const PURCHASING_POWER_LABELS = ['Low', 'Medium', 'High']

const LocationDetailPage = () => {
  const navigate = useNavigate()
  const { locationId } = useParams()
  const location = useLocation()
  const locationData = location.state?.location

  const handleNavigate = (pageId) => {
    console.log('se apasa asta', pageId)
    if (pageId === 'products') {
      navigate('/products')
    }
    if (pageId === 'locations') {
      navigate('/locations')
    }
    if (pageId === 'profile') {
      navigate('/profile')
    }
    if (pageId === 'home') {
      navigate('/home')
    }
  }

  const handleLogout = () => {
    navigate('/auth')
  }

  if (!locationData) {
    return (
      <div className="min-h-screen bg-white text-[#4b5563] flex">
        <SideMenu
          activePage="locations"
          onNavigate={handleNavigate}
          userName="Alexia"
          onLogout={handleLogout}
          role="Admin"
        />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center max-w-[90%]">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">
              Location not found
            </h2>
            <button
              onClick={() => navigate('/locations')}
              className="mt-4 px-4 py-2 bg-[#4d4dff] text-white rounded-lg hover:bg-[#3d3ddd] transition"
            >
              ← Back to Locations
            </button>
          </div>
        </div>
      </div>
    )
  }

  const profileLabel = PROFILE_LABELS[locationData.profile] || 'Unknown'
  const purchasingLabel = PURCHASING_POWER_LABELS[locationData.purchasingPower] || 'Unknown'

  return (
    <div className="min-h-screen bg-white text-[#4b5563] flex">
      <SideMenu
        activePage="locations"
        onNavigate={handleNavigate}
        userName="Alexia"
        onLogout={handleLogout}
        role="Admin"
      />

      <div className="flex-1 flex flex-col px-10 py-10 ml-16 relative z-10">
        <div className="w-full max-w-[90%] mx-auto">
          <button
            onClick={() => navigate('/locations')}
            className="mb-6 flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#4d4dff] transition"
          >
            <span>←</span>
            <span>Back to all locations</span>
          </button>

          <header className="mb-8">
            <h1 className="text-4xl font-bold text-[#111827] mb-2">
              {locationData.name}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-[#e4e4ff] text-[#4d4dff] rounded-full font-medium">
                {profileLabel} Profile
              </span>
            <span className="px-3 py-1 bg-[#f3f4f6] text-[#6b7280] rounded-full font-medium">
              {purchasingLabel} Purchasing Power
            </span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Inventory Card */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e4e4ff] flex items-center justify-center text-xl">
                📦
              </div>
              <h2 className="text-lg font-semibold text-[#111827]">Inventory</h2>
            </div>
            <p className="text-sm text-[#6b7280]">
              View current stock levels and product performance at this location.
            </p>
            <button
              onClick={() => navigate(`/products?locationId=${locationId}&locationName=${locationData.name}`)}
              className="mt-4 w-full px-4 py-2 bg-[#4d4dff] text-white rounded-lg hover:bg-[#3d3ddd] transition text-sm font-medium"
            >
              View Products →
            </button>
          </div>

          {/* Sales Performance Card */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#dcfce7] flex items-center justify-center text-xl">
                📈
              </div>
              <h2 className="text-lg font-semibold text-[#111827]">Performance</h2>
            </div>
            <p className="text-sm text-[#6b7280]">
              Analytics and sales trends for this location.
            </p>
            <button
              disabled
              className="mt-4 w-full px-4 py-2 bg-[#f3f4f6] text-[#9ca3af] rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Redistribution Card */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#fef3c7] flex items-center justify-center text-xl">
                🔄
              </div>
              <h2 className="text-lg font-semibold text-[#111827]">Redistribution</h2>
            </div>
            <p className="text-sm text-[#6b7280]">
              Recommended stock transfers for this location.
            </p>
            <button
              disabled
              className="mt-4 w-full px-4 py-2 bg-[#f3f4f6] text-[#9ca3af] rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Location Details */}
        <div className="mt-8 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Location Details
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">
                Location ID
              </dt>
              <dd className="text-sm font-mono text-[#6b7280]">
                {locationData.locationId}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">
                Profile Type
              </dt>
              <dd className="text-sm text-[#111827]">
                {profileLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">
                Purchasing Power
              </dt>
              <dd className="text-sm text-[#111827]">
                {purchasingLabel}
              </dd>
            </div>
          </dl>
        </div>
        </div>
      </div>
    </div>
  )
}

export default LocationDetailPage
