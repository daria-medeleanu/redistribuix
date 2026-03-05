import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Placeholder submit handler
    console.info(`${mode} attempted`, formValues)
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f6f2] px-4 py-12 text-[#46190c]">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#eddccf] bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-[#8a5a43] transition hover:text-[#4d4dff]"
        >
          ← Back to dashboard
        </button>
        <div className="flex gap-2 rounded-2xl bg-[#ebebfb] p-1 text-sm font-semibold">
          <button
            type="button"
            className={`flex-1 rounded-2xl px-4 py-2 transition ${
              mode === 'login' ? 'bg-white shadow-sm text-[#46190c]' : 'text-[#3e3e8a] hover:text-[#4d4dff]'
            }`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`flex-1 rounded-2xl px-4 py-2 transition ${
              mode === 'signup' ? 'bg-white shadow-sm text-[#46190c]' : 'text-[#3e3e8a] hover:text-[#4d4dff]'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            {isSignUp ? 'Create your workspace pass' : 'Welcome back to RedistribuiX'}
          </h1>
          <p className="mt-2 text-sm text-[#8a5a43]">
            {isSignUp ? 'Spin up a new account in seconds—no credit card required.' : 'Enter your credentials to continue.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="block text-sm font-semibold">
              <span>Full name</span>
              <input
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Avery Rivera"
                className="mt-1 w-full rounded-2xl border border-[#eddccf] bg-[#ebebfb] px-4 py-2 text-base placeholder:text-[#3e3e8a] focus:border-[#4d4dff] focus:outline-none"
                required
              />
            </label>
          )}

          <label className="block text-sm font-semibold">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="you@team.com"
              className="mt-1 w-full rounded-2xl border border-[#eddccf] bg-[#ebebfb] px-4 py-2 text-base placeholder:text-[#3e3e8a] focus:border-[#4d4dff] focus:outline-none"
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
              className="mt-1 w-full rounded-2xl border border-[#eddccf] bg-[#ebebfb] px-4 py-2 text-base placeholder:text-[#3e3e8a] focus:border-[#4d4dff] focus:outline-none"
              minLength={8}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#4d4dff] px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-[#4d4dff]/40 transition hover:bg-[#ff8e2a]"
            onClick={() => navigate('/home')}
          >
            {isSignUp ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-xs text-[#8a5a43]">
          By continuing you agree to our privacy policy and acceptable use guidelines.
        </p>
      </div>
    </div>
  )
}

export default AuthPage