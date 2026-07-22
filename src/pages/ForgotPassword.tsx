import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuthStore } from '../store/authStore'

export default function ForgotPassword() {
  const { resetPassword, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const err = await resetPassword(email)
    if (err) {
      setError(err)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <Layout title="E-mail verstuurd" back backTo="/login">
        <div className="text-center py-10">
          <p className="text-base font-medium text-gray-900 mb-2">Controleer je inbox</p>
          <p className="text-sm text-gray-500">
            Er is een reset-link gestuurd naar <strong>{email}</strong>.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm font-medium text-gray-900 underline">
            Terug naar inloggen
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Wachtwoord vergeten" back backTo="/login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500">
          Voer je e-mailadres in. Je ontvangt een link om je wachtwoord opnieuw in te stellen.
        </p>
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
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Bezig…' : 'Reset-link versturen'}
        </button>
        <div className="flex justify-center pt-2">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition">
            Terug naar inloggen
          </Link>
        </div>
      </form>
    </Layout>
  )
}
