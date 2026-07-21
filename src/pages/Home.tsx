import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Footer from '../components/layout/Footer'
import BottomSheet from '../components/BottomSheet'
import { db } from '../db/db'
import type { WorkoutSession } from '../db/db'
import { calcStreak, calcThisWeek, calcTotalTime } from '../utils/stats'
import { Flame, Calendar, Clock, Dumbbell, Plus, ChevronRight, MoreVertical } from 'lucide-react'

const WEEKDAYS = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

function formatHeroDate(): string {
  const d = new Date()
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

type SheetView = 'menu' | 'rename' | 'confirm-delete'
type SheetState = { templateId: number; view: SheetView; draftName: string } | null

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-3 py-3.5">
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { templates, loadTemplates, startSession, renameTemplate, deleteTemplate } = useWorkoutStore()
  const [sheet, setSheet] = useState<SheetState>(null)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [totalSets, setTotalSets] = useState(0)
  const [exerciseCounts, setExerciseCounts] = useState<Record<number, number>>({})

  useEffect(() => { loadTemplates() }, [loadTemplates])

  useEffect(() => {
    async function loadStats() {
      const completed = await db.sessions.filter((s) => !!s.completedAt).toArray()
      setSessions(completed)
      const ids = completed.map((s) => s.id!)
      const count = ids.length > 0 ? await db.sets.where('sessionId').anyOf(ids).count() : 0
      setTotalSets(count)
    }
    loadStats()
  }, [])

  useEffect(() => {
    async function loadCounts() {
      const exs = await db.exercises.toArray()
      const counts: Record<number, number> = {}
      for (const ex of exs) {
        counts[ex.templateId] = (counts[ex.templateId] ?? 0) + 1
      }
      setExerciseCounts(counts)
    }
    loadCounts()
  }, [templates])

  const streak = calcStreak(sessions)
  const thisWeek = calcThisWeek(sessions)
  const totalTime = calcTotalTime(totalSets)

  const openSheet = (templateId: number) => {
    const t = templates.find((t) => t.id === templateId)
    setSheet({ templateId, view: 'menu', draftName: t?.name ?? '' })
  }
  const closeSheet = () => setSheet(null)

  const handleStart = async (templateId: number) => {
    const sessionId = await startSession(templateId)
    navigate(`/session/${sessionId}`)
  }

  const handleRename = async () => {
    if (!sheet || !sheet.draftName.trim()) return
    await renameTemplate(sheet.templateId, sheet.draftName.trim())
    closeSheet()
  }

  const handleDelete = async () => {
    if (!sheet) return
    await deleteTemplate(sheet.templateId)
    closeSheet()
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
              {formatHeroDate()}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Mijn trainingen
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              Klaar voor je volgende sessie? Kies een training en ga los.
            </p>
          </div>
          <button
            onClick={() => navigate('/template/new')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            Nieuw
          </button>
        </header>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-3 gap-3">
          <StatCard icon={<Flame className="h-3.5 w-3.5" />} label="Streak" value={`${streak} dgn`} />
          <StatCard icon={<Calendar className="h-3.5 w-3.5" />} label="Week" value={`${thisWeek}x`} />
          <StatCard icon={<Clock className="h-3.5 w-3.5" />} label="Totaal" value={totalTime} />
        </section>

        {/* List header */}
        <div className="mt-12 flex items-baseline justify-between border-b border-gray-300 pb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Jouw schema
          </h2>
          <span className="text-xs text-gray-400">
            {templates.length} {templates.length === 1 ? 'training' : 'trainingen'}
          </span>
        </div>

        {/* Training list */}
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600">
              <Dumbbell className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="text-base font-medium text-gray-900">Nog geen trainingen</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Voeg je eerste training toe met de knop{' '}
              <span className="font-medium text-gray-900">+ Nieuw</span>.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {templates.map((template) => {
              const count = exerciseCounts[template.id!] ?? 0
              const duration = count > 0 ? Math.max(15, Math.ceil(count * 8 / 5) * 5) : 15
              return (
                <li key={template.id} className="flex items-center gap-4 py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                    <Dumbbell className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="truncate text-[15px] font-medium text-gray-900">
                        {template.name}
                      </h3>
                      {template.category && (
                        <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {count} oefening{count !== 1 ? 'en' : ''} · {duration} min
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openSheet(template.id!)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                      aria-label="Instellingen"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStart(template.id!)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white hover:border-gray-900"
                    >
                      Start
                      <ChevronRight className="-mr-0.5 h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Bottom sheet */}
      <BottomSheet open={sheet !== null} onClose={closeSheet}>
        {sheet?.view === 'menu' && (
          <div className="py-2">
            <button
              onClick={() => navigate(`/template/${sheet.templateId}/edit`)}
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
              Training verwijderen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={closeSheet} className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50">
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
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
              autoFocus
            />
            <button onClick={handleRename} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-3">
              Opslaan
            </button>
            <button onClick={closeSheet} className="w-full text-gray-500 py-2 text-sm">
              Annuleren
            </button>
          </div>
        )}

        {sheet?.view === 'confirm-delete' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-6">Weet je zeker dat je dit wilt verwijderen?</p>
            <button onClick={handleDelete} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">
              Training verwijderen
            </button>
            <button onClick={closeSheet} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium">
              Nee
            </button>
          </div>
        )}
      </BottomSheet>

      <Footer />
    </div>
  )
}
