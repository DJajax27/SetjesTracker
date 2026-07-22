import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import { useAuthStore } from '../store/authStore'
import { pushAll, pullAll } from '../lib/sync'
import { User, LogIn, UserPlus, RefreshCw, LogOut, Trash2 } from 'lucide-react'

export default function Account() {
  const navigate = useNavigate()
  const { user, signOut, deleteAccount } = useAuthStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const handleSync = async () => {
    if (!user) return
    setSyncing(true)
    setSyncMsg('')
    try {
      await pushAll(user.id)
      await pullAll(user.id)
      setSyncMsg('Gesynchroniseerd!')
    } catch {
      setSyncMsg('Sync mislukt. Controleer je verbinding.')
    } finally {
      setSyncing(false)
    }
  }

  const handleDelete = async () => {
    const err = await deleteAccount()
    if (!err) navigate('/')
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">

        <header>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Jouw profiel
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Account
          </h1>
        </header>

        <div className="mt-12">
          {user ? (
            <div className="space-y-3">
              {/* Account info */}
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Ingelogd als</p>
                    <p className="truncate text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Sync */}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">Synchroniseren</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {syncMsg || 'Data naar cloud pushen en ophalen'}
                  </p>
                </div>
                <RefreshCw className={`h-4 w-4 text-gray-400 shrink-0 ${syncing ? 'animate-spin' : ''}`} />
              </button>

              {/* Logout */}
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50 active:scale-[0.99]"
              >
                <p className="text-sm font-medium text-gray-900">Uitloggen</p>
                <LogOut className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              {/* Delete account */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-between rounded-2xl border border-red-100 bg-white px-5 py-4 text-left transition hover:bg-red-50 active:scale-[0.99]"
                >
                  <p className="text-sm font-medium text-danger">Account verwijderen</p>
                  <Trash2 className="h-4 w-4 text-danger shrink-0" />
                </button>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Weet je het zeker?</p>
                  <p className="text-xs text-gray-500 mb-4">Je account en cloud-data worden permanent verwijderd. Lokale data blijft bewaard.</p>
                  <div className="flex gap-2">
                    <button onClick={handleDelete} className="flex-1 bg-danger text-white py-2 rounded-xl text-sm font-medium">
                      Verwijderen
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium">
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">Sync je data</p>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Maak een account aan om je trainingen in de cloud op te slaan en op meerdere apparaten te gebruiken.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50 active:scale-[0.99]"
              >
                <p className="text-sm font-medium text-gray-900">Inloggen</p>
                <LogIn className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              <button
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50 active:scale-[0.99]"
              >
                <p className="text-sm font-medium text-gray-900">Account aanmaken</p>
                <UserPlus className="h-4 w-4 text-gray-400 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
