import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/Auth'
import DashboardPage from './pages/Dashboard'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/Products'
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
              <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
              <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
              {/* <Route path="/notes/new" element={<NoteEditorPage />} />
              <Route path="/notes/:noteId" element={<NoteEditorPage />} /> */}
              {/* <Route path="/archive" element={<ArchivePage />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>}/>
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </div>
      </div>
  )
}

export default App
