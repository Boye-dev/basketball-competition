import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import api from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/admin/login', { email, password })
      localStorage.setItem('admin_token', data.data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-accent-yellow/10 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-accent-yellow" />
          </div>
          <h1 className="font-heading text-3xl font-black">Admin Login</h1>
          <p className="text-gray-400 mt-2">Basketball Competition Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@basketball.com"
              required
              className="w-full bg-navy-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-sky/50 focus:ring-1 focus:ring-accent-sky/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full bg-navy-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-sky/50 focus:ring-1 focus:ring-accent-sky/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-yellow text-navy-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-accent-yellow/20 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
