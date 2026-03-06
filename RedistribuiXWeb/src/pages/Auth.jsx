import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:5056/api/v1'

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error(error)
    return null
  }
}

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' })
  const [role, setRole] = useState('StandManager')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')

      if (mode !== 'login') {
        return
      }

      const targetRole = role || 'StandManager'
      const endpoint = `${API_BASE}/${targetRole}/login`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
          role: targetRole,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()

      const decodedToken = decodeToken(data.token)
      const userId = decodedToken?.unique_name
      const decodedRole = decodedToken?.role || targetRole

      let authPayload = {
        token: data.token,
        role: decodedRole,
        id: userId,
        email: formValues.email,
        decodedToken: decodedToken
      }

      if (decodedRole === 'Admin') {
        authPayload.name = decodedToken?.name || "Super Admin ML"
      } else {
        if (userId) {
          try {
            const managerResponse = await fetch(`${API_BASE}/StandManager/${userId}`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
              }
            })

            if (managerResponse.ok) {
              const managerData = await managerResponse.json()
              authPayload.locationId = managerData.locationId
              authPayload.name = managerData.name || "Manager Locatie"
            } else {
              authPayload.name = "Manager"
            }
          } catch (err) {
            authPayload.name = "Manager"
          }
        }
      }

      if (data?.token) {
        window.localStorage.setItem(
          'redistribuix_auth',
          JSON.stringify(authPayload)
        )
      }

      if (decodedRole === 'Admin') {
        navigate('/productsAdmin')
      } else if (decodedRole === 'StandManager' && authPayload.locationId) {
        navigate(`/locations/${authPayload.locationId}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Could not log in. Please check your email, password and role.')
    }
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f6f2] px-4 py-12 text-[#000000]">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#eddccf] bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-[#3e3e8a] transition hover:text-[#4d4dff]"
        >
          ← Back to dashboard
        </button>
        <div className="flex gap-2 rounded-2xl bg-[#ebebfb] p-0.1 text-sm font-semibold border border-[#4d4dff]/10">
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back to RedistribuiX
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Enter your credentials to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between rounded-2xl bg-[#f3f0ff] px-2 py-1 text-xs font-semibold text-[#3e3e8a]">
            <span className="px-2">Log in as</span>
            <div className="flex gap-1 rounded-2xl bg-white/60 p-1">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`rounded-2xl px-3 py-1 transition ${
                    role === 'Admin'
                      ? 'bg-white shadow-sm text-[#46190c]'
                      : 'text-[#3e3e8a] hover:text-[#4d4dff]'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('StandManager')}
                  className={`rounded-2xl px-3 py-1 transition ${
                    role === 'StandManager'
                      ? 'bg-white shadow-sm text-[#46190c]'
                      : 'text-[#3e3e8a] hover:text-[#4d4dff]'
                  }`}
                >
                  Stand manager
                </button>
              </div>
          </div>
          
          <label className="block text-sm font-semibold">
            <span>Email</span>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="you@team.com"
                className="mt-1 w-full rounded-2xl border border-[#3e3e8a] bg-[#ebebfb] px-4 py-2 text-base text-[#3e3e8a] placeholder:text-[#3e3e8a] focus:border-[#4d4dff] focus:outline-none"
                required
              />
          </label>

          <label className="block text-sm font-semibold">
            <span>Password</span>
              <input
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="at least 8 characters"
                className="mt-1 w-full rounded-2xl border border-[#3e3e8a] bg-[#ebebfb] px-4 py-2 text-base text-[#3e3e8a] placeholder:text-[#3e3e8a] focus:border-[#4d4dff] focus:outline-none"
                minLength={8}
                required
              />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#4d4dff] px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-[#4d4dff]/40 transition hover:bg-[#3e3e8a] active:bg-[#3e3e8a]"
          >
            {isSignUp ? 'Create account' : 'Log in'}
          </button>
          {!!error && (
            <p className="text-xs font-semibold text-red-600 pt-1">{error}</p>
          )}
        </form>

        <p className="text-center text-xs text-[#6b7280]">
          By continuing you agree to our privacy policy and acceptable use guidelines.
        </p>
      </div>
    </div>
  )
}

export default AuthPage