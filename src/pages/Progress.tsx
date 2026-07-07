import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import BottomSheet from '../components/BottomSheet'
import { useWorkoutStore } from '../store/workoutStore'
import { useGoalsStore } from '../store/goalsStore'

type Panel =
  | { kind: 'history' }
  | { kind: 'archive' }
  | { kind: 'session-opts'; id: number; name: string }
  | { kind: 'session-rename'; id: number; draft: string }
  | { kind: 'session-del'; id: number }
  | { kind: 'archive-del'; id: number }
  | null

export default function Progress() {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<Panel>(null)

  const { history, loadHistory, deleteSession, renameSession } = useWorkoutStore()
  const { goals, loadGoals, removeGoal } = useGoalsStore()

  useEffect(() => {
    loadHistory()
    loadGoals()
  }, [loadHistory, loadGoals])

  const archived = goals.filter(
    (g) => g.type === 'deadline' && g.completedDates.length > 0
  )

  const handleRename = async () => {
    if (panel?.kind !== 'session-rename' || !panel.draft.trim()) return
    await renameSession(panel.id, panel.draft.trim())
    setPanel({ kind: 'history' })
  }

  const handleDeleteSession = async () => {
    if (panel?.kind !== 'session-del') return
    await deleteSession(panel.id)
    setPanel({ kind: 'history' })
  }

  const handleDeleteArchive = async () => {
    if (panel?.kind !== 'archive-del') return
    await removeGoal(panel.id)
    setPanel({ kind: 'archive' })
  }

  return (
    <Layout title="Progressie" mainClassName="flex flex-col">
      {/* Placeholder */}
      <div className="flex flex-col items-center mt-16 text-center px-4 flex-1">
        <p className="text-4xl mb-4">📈</p>
        <p className="text-gray-500 text-sm">Progressiegrafieken komen in Fase 5.</p>
      </div>

      {/* Bottom buttons */}
      <div className="flex gap-3 pt-8 pb-2">
        <button
          onClick={() => setPanel({ kind: 'history' })}
          className="flex-1 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 shadow-sm active:bg-gray-50"
        >
          Trainings geschiedenis
        </button>
        <button
          onClick={() => setPanel({ kind: 'archive' })}
          className="flex-1 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 shadow-sm active:bg-gray-50"
        >
          Doelen archief
        </button>
      </div>

      {/* History panel */}
      <BottomSheet open={panel?.kind === 'history'} onClose={() => setPanel(null)}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-base font-semibold">Trainings geschiedenis</p>
          <button
            onClick={() => setPanel(null)}
            className="text-gray-400 text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-3 space-y-2">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">Nog geen sessies gedaan.</p>
          ) : (
            history.map((session) => {
              const displayName = session.customName ?? session.templateName
              return (
                <div key={session.id} className="bg-gray-50 rounded-xl flex items-center">
                  <button
                    onClick={() => { setPanel(null); navigate(`/session/${session.id}`) }}
                    className="flex-1 min-w-0 px-4 py-3 text-left"
                  >
                    <p className="font-semibold truncate text-sm">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(session.date).toLocaleDateString('nl-NL', {
                        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </button>
                  <button
                    onClick={() => setPanel({ kind: 'session-opts', id: session.id!, name: displayName })}
                    className="text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 mr-1"
                    aria-label="Opties"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </BottomSheet>

      {/* Archive panel */}
      <BottomSheet open={panel?.kind === 'archive'} onClose={() => setPanel(null)}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-base font-semibold">Doelen archief</p>
          <button
            onClick={() => setPanel(null)}
            className="text-gray-400 text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-3 space-y-2">
          {archived.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">Nog geen behaalde doelen met einddatum.</p>
          ) : (
            archived.map((goal) => {
              const achievedDate = goal.completedDates[goal.completedDates.length - 1]
              return (
                <div key={goal.id} className="bg-gray-50 rounded-xl p-3 flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="3" fill="#22c55e" />
                      <polyline points="7 12 10.5 15.5 17 8.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm">{goal.name}</p>
                    {goal.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{goal.description}</p>
                    )}
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {goal.targetDate && (
                        <p className="text-xs text-gray-400">
                          Deadline: {new Date(goal.targetDate).toLocaleDateString('nl-NL')}
                        </p>
                      )}
                      <p className="text-xs text-green-600 font-medium">
                        Behaald op {new Date(achievedDate).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPanel({ kind: 'archive-del', id: goal.id! })}
                    className="text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 -mr-1"
                    aria-label="Verwijderen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </BottomSheet>

      {/* Session options */}
      <BottomSheet open={panel?.kind === 'session-opts'} onClose={() => setPanel({ kind: 'history' })}>
        {panel?.kind === 'session-opts' && (
          <div className="py-2">
            <button
              onClick={() => { setPanel(null); navigate(`/session/${panel.id}/edit`) }}
              className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50"
            >
              Training aanpassen
            </button>
            <button
              onClick={() => setPanel({ kind: 'session-rename', id: panel.id, draft: panel.name })}
              className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50"
            >
              Naam wijzigen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={() => setPanel({ kind: 'session-del', id: panel.id })}
              className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50"
            >
              Sessie verwijderen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={() => setPanel({ kind: 'history' })}
              className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50"
            >
              Annuleren
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Session rename */}
      <BottomSheet open={panel?.kind === 'session-rename'} onClose={() => setPanel({ kind: 'history' })}>
        {panel?.kind === 'session-rename' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-4">Naam wijzigen</p>
            <input
              type="text"
              value={panel.draft}
              onChange={(e) => setPanel({ kind: 'session-rename', id: panel.id, draft: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <button onClick={handleRename} className="w-full bg-accent text-white py-3 rounded-xl font-medium mb-3">
              Opslaan
            </button>
            <button onClick={() => setPanel({ kind: 'history' })} className="w-full text-gray-500 py-2 text-sm">
              Annuleren
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Session delete confirm */}
      <BottomSheet open={panel?.kind === 'session-del'} onClose={() => setPanel({ kind: 'history' })}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-6">Weet je zeker dat je deze sessie wilt verwijderen?</p>
          <button onClick={handleDeleteSession} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">
            Sessie verwijderen
          </button>
          <button onClick={() => setPanel({ kind: 'history' })} className="w-full bg-primary text-white py-3 rounded-xl font-medium">
            Nee
          </button>
        </div>
      </BottomSheet>

      {/* Archive delete confirm */}
      <BottomSheet open={panel?.kind === 'archive-del'} onClose={() => setPanel({ kind: 'archive' })}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-6">
            Weet je zeker dat je dit doel uit het archief wilt verwijderen?
          </p>
          <button onClick={handleDeleteArchive} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">
            Verwijderen
          </button>
          <button onClick={() => setPanel({ kind: 'archive' })} className="w-full bg-primary text-white py-3 rounded-xl font-medium">
            Nee
          </button>
        </div>
      </BottomSheet>
    </Layout>
  )
}
