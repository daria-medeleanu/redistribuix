import logoRedistribuiX from '../assets/redistribuix_logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dashboardLinks = [
  { href: '#features', label: 'Feature' },
  { href: '#discover', label: 'Discover' },
]

function Navbar({ isHome = false }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <div className="flex w-full  flex-col md:flex-row gap-4 bg-white px-5 py-1 text-[#46190c]">
      <div className="flex w-full md:w-fit items-center justify-between md:justify-center">
        <div className="flex items-center gap-2.5">
          <img
            src={logoRedistribuiX}
            className="h-25"
          />
          <div>
            <p className="text-[12px] uppercase text-[#4d4dff]">RedistribuiX</p>
            <p className="text-[16px] font-semibold">Stock cockpit</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eddccf] text-[#8a5a43] transition hover:border-[#4d4dff] hover:text-[#4d4dff] md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <div
        className={`${isMenuOpen ? 'flex' : 'hidden'} w-full flex-col border-t border-[#f4e7df] pt-3 md:flex md:flex-row md:items-center md:justify-end  md:border-0 md:pt-0`}
      >
        {!isHome && (
          <nav className="flex w-full flex-col gap-2 text-[14px] font-semibold text-[#8a5a43] md:flex-row md:justify-center md:gap-3">
            {dashboardLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="w-full rounded-2xl px-4 py-3 text-center transition hover:text-[#4d4dff] md:w-fit"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex w-full flex-col gap-2 text-sm font-semibold  md:flex-row md:max-w-fit">
          {isHome ? (
            <button
              className="w-full cursor-pointer rounded-2xl bg-[#4d4dff] px-4 py-2 text-center text-white md:shadow-md shadow-[#4d4dff]/40 transition hover:bg-[#3b3bd9]"
              onClick={() => navigate('/')}
            >
              Sign out
            </button>
          ) : (
            <>
              <button
                className="w-full cursor-pointer rounded-2xl border border-[#eddccf] px-4 py-2 text-center text-[#8a5a43] transition hover:border-[#4d4dff] hover:text-[#4d4dff] md:min-w-fit"
                onClick={() => navigate('/auth')}
              >
                Log in
              </button>
              <button
                className="w-full cursor-pointer rounded-2xl bg-[#4d4dff] px-4 py-2 text-center text-white shadow-md shadow-[#4d4dff]/40 transition hover:bg-[#6161ff] md:min-w-fit"
                onClick={() => navigate('/auth')}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar