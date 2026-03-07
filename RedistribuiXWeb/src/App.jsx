import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/Auth'
import DashboardPage from './pages/Dashboard'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/Products'
import SingleLocationPage from './pages/SingleLocationPage'
import ProductCategoriesStandManagerPage from './pages/ProductCategoriesStandManagerPage'
import LocationsPage from "./pages/LocationsPage";
import './App.css'

function RequireAuth({ children }) {
  const storedAuth = window.localStorage.getItem('redistribuix_auth')
  const auth = storedAuth ? JSON.parse(storedAuth) : null

  if (!auth?.token) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function App() {

  return (
	  <div className="min-h-screen bg-white text-[#4b5563]">
          {/* <header className="space-y-4">
            <Navbar />
            <div className="h-px w-full bg-[#eddccf]" />
          </header> */}

          <div className="">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
              <Route path="/products" element={<RequireAuth><ProductCategoriesStandManagerPage /></RequireAuth>} />
              <Route path="/locations" element={<RequireAuth><LocationsPage /></RequireAuth>} />
              <Route path="/locations/:id" element={<RequireAuth><SingleLocationPage /></RequireAuth>} />
              <Route path="/auth" element={<AuthPage />} />
              {/* Add profile, etc routes as needed */}
            </Routes>
          </div>
      </div>
  )
}

export default App