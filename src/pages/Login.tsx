import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const err = await signIn(email, password)
    if (err) {
      setError(err)
    } else {
      navigate('/')
    }
  }

  return (
    <Layout title="Inloggen" back backTo="/">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            autoFocus
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Bezig…' : 'Inloggen'}
        </button>
        <div className="flex flex-col items-center gap-2 pt-2">
          <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900 transition">
            Wachtwoord vergeten?
          </Link>
          <Link to="/register" className="text-sm text-gray-500 hover:text-gray-900 transition">
            Nog geen account? <span className="font-medium text-gray-900">Registreer</span>
          </Link>
        </div>
      </form>
    </Layout>
  )
}
