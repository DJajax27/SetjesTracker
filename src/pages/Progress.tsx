import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import BottomSheet from '../components/BottomSheet'
import { useWorkoutStore } from '../store/workoutStore'
import { useGoalsStore } from '../store/goalsStore'
import { Activity, Clock, TrendingUp, History, Archive, MoreVertical } from 'lucide-react'

type Panel =
  | { kind: 'history' }
  | { kind: 'archive' }
  | { kind: 'session-opts'; id: number; name: string }
  | { kind: 'session-rename'; id: number; draft: string }
  | { kind: 'session-del'; id: number }
  | { kind: 'archive-del'; id: number }
  | null

const DAYS = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z']

export default function Progress() {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<Panel>(null)

  const { history, loadHistory, deleteSession, renameSession } = useWorkoutStore()
  const { goals, loadGoals, removeGoal } = useGoalsStore()

  useEffect(() => {
    loadHistory()
    loadGoals()
  }, [loadHistory, loadGoals])

  const archived = goals.filter((g) => g.type === 'deadline' && g.completedDates.length > 0)

  // Sessions per day of last 7 days (Mon–Sun)
  const weekSessions = Array(7).fill(0)
  const today = new Date()
  history.forEach((s) => {
    const d = new Date(s.date)
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
    if (diff >= 0 && diff < 7) {
      const dayIndex = (d.getDay() + 6) % 7 // 0=Mon, 6=Sun
      weekSessions[dayIndex]++
    }
  })
  const maxSessions = Math.max(...weekSessions, 1)

  const totalSessions = history.length
  const totalHours = Math.floor(totalSessions * 0.75)

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
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">

        {/* Header */}
        <header>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Deze week
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Progressie
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Overzicht van je activiteit en persoonlijke records.
          </p>
        </header>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-3 gap-3">
          <StatCard icon={<Activity className="h-3.5 w-3.5" />} label="Sessies" value={`${totalSessions}`} unit="x" />
          <StatCard icon={<Clock className="h-3.5 w-3.5" />} label="Tijd" value={`${totalHours}`} unit="u" />
          <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Deze week" value={`${weekSessions.reduce((a, b) => a + b, 0)}`} unit="x" />
        </section>

        {/* Bar chart */}
        <SectionHeader label="Weekoverzicht" count="Sessies per dag" />
        <div className="mt-4 rounded-2xl border border-border bg-surface-elevated p-5">
          <div className="flex h-40 items-end justify-between gap-2">
            {weekSessions.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-md bg-foreground transition-all"
                    style={{
                      height: `${(v / maxSessions) * 100}%`,
                      minHeight: v ? 6 : 2,
                      opacity: v ? 0.85 : 0.12,
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {DAYS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* History + archive buttons */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setPanel({ kind: 'history' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-foreground hover:text-white hover:border-foreground"
          >
            <History className="h-3.5 w-3.5" />
            Trainingsgeschiedenis
          </button>
          <button
            onClick={() => setPanel({ kind: 'archive' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-foreground hover:text-white hover:border-foreground"
          >
            <Archive className="h-3.5 w-3.5" />
            Doelen archief
          </button>
        </div>
      </div>

      {/* History panel */}
      <BottomSheet open={panel?.kind === 'history'} onClose={() => setPanel(null)}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-base font-semibold">Trainings geschiedenis</p>
          <button onClick={() => setPanel(null)} className="text-gray-400 text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center">×</button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">Nog geen sessies gedaan.</p>
          ) : (
            <ul className="divide-y divide-gray-100 px-2">
              {history.map((session) => {
                const displayName = session.customName ?? session.templateName
                return (
                  <li key={session.id} className="flex items-center">
                    <button
                      onClick={() => { setPanel(null); navigate(`/session/${session.id}`) }}
                      className="flex-1 min-w-0 px-3 py-3.5 text-left"
                    >
                      <p className="text-[15px] font-medium text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(session.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </button>
                    <button
                      onClick={() => setPanel({ kind: 'session-opts', id: session.id!, name: displayName })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 shrink-0 mr-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </BottomSheet>

      {/* Archive panel */}
      <BottomSheet open={panel?.kind === 'archive'} onClose={() => setPanel(null)}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-base font-semibold">Doelen archief</p>
          <button onClick={() => setPanel(null)} className="text-gray-400 text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center">×</button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {archived.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">Nog geen behaalde doelen met einddatum.</p>
          ) : (
            <ul className="divide-y divide-gray-100 px-2">
              {archived.map((goal) => {
                const achievedDate = goal.completedDates[goal.completedDates.length - 1]
                return (
                  <li key={goal.id} className="flex items-center gap-3 py-3.5 px-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                        <polyline points="7 12 10.5 15.5 17 8.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-foreground truncate">{goal.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Behaald op {new Date(achievedDate).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <button
                      onClick={() => setPanel({ kind: 'archive-del', id: goal.id! })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </BottomSheet>

      {/* Session options */}
      <BottomSheet open={panel?.kind === 'session-opts'} onClose={() => setPanel({ kind: 'history' })}>
        {panel?.kind === 'session-opts' && (
          <div className="py-2">
            <button onClick={() => { setPanel(null); navigate(`/session/${panel.id}/edit`) }} className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50">Training aanpassen</button>
            <button onClick={() => setPanel({ kind: 'session-rename', id: panel.id, draft: panel.name })} className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50">Naam wijzigen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={() => setPanel({ kind: 'session-del', id: panel.id })} className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50">Sessie verwijderen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={() => setPanel({ kind: 'history' })} className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50">Annuleren</button>
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
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
              autoFocus
            />
            <button onClick={handleRename} className="w-full bg-foreground text-white py-3 rounded-xl font-medium mb-3">Opslaan</button>
            <button onClick={() => setPanel({ kind: 'history' })} className="w-full text-gray-500 py-2 text-sm">Annuleren</button>
          </div>
        )}
      </BottomSheet>

      {/* Session delete */}
      <BottomSheet open={panel?.kind === 'session-del'} onClose={() => setPanel({ kind: 'history' })}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-6">Weet je zeker dat je deze sessie wilt verwijderen?</p>
          <button onClick={handleDeleteSession} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">Sessie verwijderen</button>
          <button onClick={() => setPanel({ kind: 'history' })} className="w-full bg-foreground text-white py-3 rounded-xl font-medium">Nee</button>
        </div>
      </BottomSheet>

      {/* Archive delete */}
      <BottomSheet open={panel?.kind === 'archive-del'} onClose={() => setPanel({ kind: 'archive' })}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-6">Weet je zeker dat je dit doel uit het archief wilt verwijderen?</p>
          <button onClick={handleDeleteArchive} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">Verwijderen</button>
          <button onClick={() => setPanel({ kind: 'archive' })} className="w-full bg-foreground text-white py-3 rounded-xl font-medium">Nee</button>
        </div>
      </BottomSheet>

      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1 text-2xl font-semibold text-foreground">
        {value}
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
  )
}

function SectionHeader({ label, count }: { label: string; count: string }) {
  return (
    <div className="mt-12 flex items-baseline justify-between border-b border-border pb-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</h2>
      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  )
}
