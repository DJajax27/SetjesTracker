import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.')
      return
    }
    const { error: err, needsConfirmation } = await signUp(email, password)
    if (err) {
      setError(err)
    } else if (needsConfirmation) {
      setSuccess(true)
    } else {
      navigate('/')
    }
  }

  if (success) {
    return (
      <Layout title="Account aangemaakt" back backTo="/login">
        <div className="text-center py-10">
          <p className="text-base font-medium text-gray-900 mb-2">Bevestig je e-mail</p>
          <p className="text-sm text-gray-500">
            Er is een bevestigingslink gestuurd naar <strong>{email}</strong>. Klik op de link om je account te activeren.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm font-medium text-gray-900 underline">
            Terug naar inloggen
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Account aanmaken" back backTo="/login">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord bevestigen</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? 'Bezig…' : 'Account aanmaken'}
        </button>
        <div className="flex justify-center pt-2">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition">
            Al een account? <span className="font-medium text-gray-900">Inloggen</span>
          </Link>
        </div>
      </form>
    </Layout>
  )
}
