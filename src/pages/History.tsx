import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'
import BottomSheet from '../components/BottomSheet'

type SheetView = 'menu' | 'rename' | 'confirm-delete'
type SheetState = { sessionId: number; view: SheetView; draftName: string } | null

export default function History() {
  const navigate = useNavigate()
  const { history, loadHistory, deleteSession, renameSession } = useWorkoutStore()
  const [sheet, setSheet] = useState<SheetState>(null)

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const openSheet = (sessionId: number, displayName: string) =>
    setSheet({ sessionId, view: 'menu', draftName: displayName })

  const closeSheet = () => setSheet(null)

  const handleRename = async () => {
    if (!sheet || !sheet.draftName.trim()) return
    await renameSession(sheet.sessionId, sheet.draftName.trim())
    closeSheet()
  }

  const handleDelete = async () => {
    if (!sheet) return
    await deleteSession(sheet.sessionId)
    closeSheet()
  }

  return (
    <Layout title="Geschiedenis">
      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">Nog geen sessies gedaan.</p>
        ) : (
          history.map((session) => {
            const displayName = session.customName ?? session.templateName
            return (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border flex items-center"
              >
                <Link to={`/session/${session.id}`} className="flex-1 min-w-0 p-4">
                  <p className="font-semibold truncate">{displayName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(session.date).toLocaleDateString('nl-NL', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
                <button
                  onClick={() => openSheet(session.id!, displayName)}
                  className="text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 mr-2"
                  aria-label="Instellingen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>

      <BottomSheet open={sheet !== null} onClose={closeSheet}>
        {sheet?.view === 'menu' && (
          <div className="py-2">
            <button
              onClick={() => navigate(`/session/${sheet.sessionId}/edit`)}
              className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50"
            >
              Training aanpassen
            </button>
            <button
              onClick={() => setSheet((s) => s ? { ...s, view: 'rename' } : s)}
              className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50"
            >
              Naam wijzigen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={() => setSheet((s) => s ? { ...s, view: 'confirm-delete' } : s)}
              className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50"
            >
              Sessie verwijderen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={closeSheet}
              className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50"
            >
              Annuleren
            </button>
          </div>
        )}

        {sheet?.view === 'rename' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-4">Naam wijzigen</p>
            <input
              type="text"
              value={sheet.draftName}
              onChange={(e) => setSheet((s) => s ? { ...s, draftName: e.target.value } : s)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <button
              onClick={handleRename}
              className="w-full bg-accent text-white py-3 rounded-xl font-medium mb-3"
            >
              Opslaan
            </button>
            <button onClick={closeSheet} className="w-full text-gray-500 py-2 text-sm">
              Annuleren
            </button>
          </div>
        )}

        {sheet?.view === 'confirm-delete' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-6">
              Weet je zeker dat je dit wilt verwijderen?
            </p>
            <button
              onClick={handleDelete}
              className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3"
            >
              Sessie verwijderen
            </button>
            <button
              onClick={closeSheet}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium"
            >
              Nee
            </button>
          </div>
        )}
      </BottomSheet>
    </Layout>
  )
}
