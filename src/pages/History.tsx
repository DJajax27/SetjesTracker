import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'
import BottomSheet from '../components/BottomSheet'
import { MoreVertical } from 'lucide-react'

type SheetView = 'menu' | 'rename' | 'confirm-delete'
type SheetState = { sessionId: number; view: SheetView; draftName: string } | null

export default function History() {
  const navigate = useNavigate()
  const { history, loadHistory, deleteSession, renameSession } = useWorkoutStore()
  const [sheet, setSheet] = useState<SheetState>(null)

  useEffect(() => { loadHistory() }, [loadHistory])

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
      {history.length === 0 ? (
        <p className="text-center text-gray-400 mt-16 text-sm">Nog geen sessies gedaan.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {history.map((session) => {
            const displayName = session.customName ?? session.templateName
            return (
              <li key={session.id} className="flex items-center">
                <Link to={`/session/${session.id}`} className="flex-1 min-w-0 py-4">
                  <p className="text-[15px] font-medium text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(session.date).toLocaleDateString('nl-NL', {
                      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </Link>
                <button
                  onClick={() => openSheet(session.id!, displayName)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition flex-shrink-0 mr-1"
                  aria-label="Instellingen"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <BottomSheet open={sheet !== null} onClose={closeSheet}>
        {sheet?.view === 'menu' && (
          <div className="py-2">
            <button onClick={() => navigate(`/session/${sheet.sessionId}/edit`)} className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50">Training aanpassen</button>
            <button onClick={() => setSheet((s) => s ? { ...s, view: 'rename' } : s)} className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50">Naam wijzigen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={() => setSheet((s) => s ? { ...s, view: 'confirm-delete' } : s)} className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50">Sessie verwijderen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={closeSheet} className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50">Annuleren</button>
          </div>
        )}

        {sheet?.view === 'rename' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-4">Naam wijzigen</p>
            <input
              type="text"
              value={sheet.draftName}
              onChange={(e) => setSheet((s) => s ? { ...s, draftName: e.target.value } : s)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
              autoFocus
            />
            <button onClick={handleRename} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-3">Opslaan</button>
            <button onClick={closeSheet} className="w-full text-gray-500 py-2 text-sm">Annuleren</button>
          </div>
        )}

        {sheet?.view === 'confirm-delete' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-6">Weet je zeker dat je dit wilt verwijderen?</p>
            <button onClick={handleDelete} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">Sessie verwijderen</button>
            <button onClick={closeSheet} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium">Nee</button>
          </div>
        )}
      </BottomSheet>
    </Layout>
  )
}
