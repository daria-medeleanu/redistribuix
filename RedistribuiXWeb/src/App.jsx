import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/Auth'
import DashboardPage from './pages/Dashboard'
import HomePage from './pages/HomePage'
import './App.css'

function App() {

  return (
      <div className="min-h-screen bg-[#f9f6f2] text-[#46190c]">
          {/* <header className="space-y-4">
            <Navbar />
            <div className="h-px w-full bg-[#eddccf]" />
          </header> */}

          <div className="">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/home" element={<HomePage />} />
              {/* <Route path="/notes/new" element={<NoteEditorPage />} />
              <Route path="/notes/:noteId" element={<NoteEditorPage />} /> */}
              {/* <Route path="/archive" element={<ArchivePage />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              <Route path="/auth" element={<AuthPage />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </div>
      </div>
  )
}

export default App
