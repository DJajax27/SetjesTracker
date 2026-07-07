import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Footer from '../components/layout/Footer'
import BottomSheet from '../components/BottomSheet'
import { db } from '../db/db'
import type { WorkoutSession } from '../db/db'
import { calcStreak, calcThisWeek, calcTotalTime } from '../utils/stats'
import '../components/layout/Layout.css'
import './Home.css'

const WEEKDAYS = ['ZONDAG', 'MAANDAG', 'DINSDAG', 'WOENSDAG', 'DONDERDAG', 'VRIJDAG', 'ZATERDAG']
const MONTHS = ['JANUARI', 'FEBRUARI', 'MAART', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AUGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER']

function formatHeroDate(): string {
  const d = new Date()
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function DumbbellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="4" height="4" rx="1" />
      <rect x="18" y="10" width="4" height="4" rx="1" />
      <rect x="7" y="8" width="3" height="8" rx="1" />
      <rect x="14" y="8" width="3" height="8" rx="1" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

type SheetView = 'menu' | 'rename' | 'confirm-delete'
type SheetState = { templateId: number; view: SheetView; draftName: string } | null

export default function Home() {
  const navigate = useNavigate()
  const { templates, loadTemplates, startSession, renameTemplate, deleteTemplate } = useWorkoutStore()
  const [sheet, setSheet] = useState<SheetState>(null)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [totalSets, setTotalSets] = useState(0)
  const [exerciseCounts, setExerciseCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

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
    <div className="layout">
      {/* Hero section */}
      <div className="home-hero">
        <div className="home-hero__top">
          <div>
            <p className="home-hero__date">{formatHeroDate()}</p>
            <h1 className="home-hero__title">Mijn trainingen</h1>
            <p className="home-hero__subtitle">Klaar voor je volgende sessie? Kies een training en ga los.</p>
          </div>
          <button className="home-hero__new-btn" onClick={() => navigate('/template/new')}>
            + Nieuw
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="layout-main space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🔥', label: 'STREAK', value: `${streak} dgn` },
            { icon: '📅', label: 'DEZE WEEK', value: `${thisWeek}x` },
            { icon: '⏱', label: 'TOTAAL', value: totalTime },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border text-center">
              <p className="text-base mb-0.5">{stat.icon}</p>
              <p className="text-[0.625rem] font-semibold text-gray-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-sm font-bold mt-0.5 text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Template list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jouw schema</p>
            <p className="text-xs text-gray-400">
              {templates.length} {templates.length === 1 ? 'training' : 'trainingen'}
            </p>
          </div>

          {templates.length === 0 ? (
            <p className="text-center text-gray-400 mt-12 text-sm">
              Nog geen trainingen. Maak er een aan!
            </p>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => {
                const count = exerciseCounts[template.id!] ?? 0
                const duration = count > 0 ? Math.max(15, Math.ceil(count * 8 / 5) * 5) : 15
                return (
                  <div key={template.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <DumbbellIcon />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 truncate">{template.name}</p>
                        {template.category && (
                          <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-accent-light text-accent shrink-0">
                            {template.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {count} oefening{count !== 1 ? 'en' : ''} · {duration} min
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openSheet(template.id!)}
                        className="text-gray-400 min-h-[44px] min-w-[36px] flex items-center justify-center"
                        aria-label="Instellingen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleStart(template.id!)}
                        className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

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
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <button onClick={handleRename} className="w-full bg-accent text-white py-3 rounded-xl font-medium mb-3">
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
            <button onClick={closeSheet} className="w-full bg-primary text-white py-3 rounded-xl font-medium">
              Nee
            </button>
          </div>
        )}
      </BottomSheet>

      <Footer />
    </div>
  )
}
