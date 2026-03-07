import { useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'

const LocationsPage = () => {
  const navigate = useNavigate()

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
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">
            Locations
          </h1>
          <p className="mt-2 text-sm text-[#8a5a43] max-w-2xl">
            Locations page content
          </p>
        </header>
      </div>
    </div>
  )
}

export default LocationsPage
