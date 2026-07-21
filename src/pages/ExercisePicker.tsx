import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, Plus, X, MoreVertical, Trash2 } from 'lucide-react'
import { useExerciseLibraryStore, allExercises } from '../store/exerciseLibraryStore'
import { MUSCLE_GROUPS } from '../data/exercises'
import type { MuscleGroup } from '../data/exercises'
import BottomSheet from '../components/BottomSheet'
import { db } from '../db/db'

type Tab = 'alphabetical' | 'muscleGroup' | 'recent'

interface CombinedExercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description?: string
}

type InfoSheet = { name: string; muscleGroup: string; description: string } | null

export default function ExercisePicker() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/'

  const { customExercises, loadCustomExercises, addCustomExercise, removeCustomExercise } = useExerciseLibraryStore()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('alphabetical')
  const [recentNames, setRecentNames] = useState<string[]>([])
  const [addSheet, setAddSheet] = useState(false)
  const [infoSheet, setInfoSheet] = useState<InfoSheet>(null)
  const [deleteSheet, setDeleteSheet] = useState<{ id: number; name: string } | null>(null)
  const [newName, setNewName] = useState('')
  const [newMuscleGroup, setNewMuscleGroup] = useState<MuscleGroup>('Borst')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadCustomExercises()
    loadRecent()
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [loadCustomExercises])

  async function loadRecent() {
    const sessionExs = await db.sessionExercises.toArray()
    const seen = new Set<string>()
    const names: string[] = []
    for (const ex of [...sessionExs].reverse()) {
      const n = ex.name.trim()
      if (n && !seen.has(n.toLowerCase())) {
        seen.add(n.toLowerCase())
        names.push(n)
      }
    }
    setRecentNames(names)
  }

  const exercises = useMemo(() => allExercises(customExercises) as CombinedExercise[], [customExercises])

  const filtered = useMemo(() => {
    if (!query.trim()) return exercises
    const q = query.toLowerCase()
    return exercises.filter((e) => e.name.toLowerCase().includes(q))
  }, [exercises, query])

  const alphabetical = useMemo(
    () => [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'nl')),
    [filtered],
  )

  const byMuscleGroup = useMemo(() => {
    const map = new Map<MuscleGroup, CombinedExercise[]>()
    MUSCLE_GROUPS.forEach((g) => map.set(g, []))
    filtered.forEach((e) => {
      const group = e.muscleGroup as MuscleGroup
      if (map.has(group)) map.get(group)!.push(e)
      else map.set(group, [e])
    })
    return map
  }, [filtered])

  const recentFiltered = useMemo(() => {
    if (!query.trim()) return recentNames
    const q = query.toLowerCase()
    return recentNames.filter((n) => n.toLowerCase().includes(q))
  }, [recentNames, query])

  function pick(name: string) {
    navigate(returnTo, { state: { pickedExercise: name } })
  }

  async function handleAddCustom() {
    if (!newName.trim()) return
    const item = await addCustomExercise(newName.trim(), newMuscleGroup)
    setAddSheet(false)
    setNewName('')
    pick(item.name)
  }

  const isEmpty =
    (tab === 'alphabetical' && alphabetical.length === 0) ||
    (tab === 'muscleGroup' && filtered.length === 0) ||
    (tab === 'recent' && recentFiltered.length === 0)

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 pt-10 pb-0 sm:px-8">
        <button
          onClick={() => navigate(returnTo)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">
          Oefening kiezen
        </h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek oefening…"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 -mx-1 pb-0">
          {(['alphabetical', 'muscleGroup', 'recent'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = {
              alphabetical: 'Alfabetisch',
              muscleGroup: 'Spiergroep',
              recent: 'Recent',
            }
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                  tab === t
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-32">
        {tab === 'recent' && recentFiltered.length === 0 && !query && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <p className="text-base font-medium text-gray-900">Nog niets gelogd</p>
            <p className="mt-1 text-sm text-gray-500">
              Hier verschijnen oefeningen die je eerder hebt gebruikt.
            </p>
          </div>
        )}

        {isEmpty && query && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <p className="text-base font-medium text-gray-900">Geen resultaten voor "{query}"</p>
            <p className="mt-1 text-sm text-gray-500 mb-4">
              Staat de oefening er niet bij? Voeg hem zelf toe.
            </p>
            <button
              onClick={() => { setNewName(query); setAddSheet(true) }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Eigen oefening toevoegen
            </button>
          </div>
        )}

        {tab === 'alphabetical' && alphabetical.length > 0 && (
          <ul className="divide-y divide-gray-100 bg-white mt-2 mx-4 rounded-2xl border border-gray-200 overflow-hidden">
            {alphabetical.map((ex) => (
              <ExerciseRow key={ex.id} exercise={ex} onPick={pick} onInfo={setInfoSheet} onDelete={setDeleteSheet} />
            ))}
          </ul>
        )}

        {tab === 'muscleGroup' && filtered.length > 0 && (
          <div className="mt-2 space-y-4 px-4">
            {MUSCLE_GROUPS.map((group) => {
              const items = byMuscleGroup.get(group) ?? []
              if (items.length === 0) return null
              const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name, 'nl'))
              return (
                <div key={group}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900 mb-2 px-1">
                    {group}
                  </p>
                  <ul className="rounded-2xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
                    {sorted.map((ex) => (
                      <ExerciseRow key={ex.id} exercise={ex} onPick={pick} onInfo={setInfoSheet} onDelete={setDeleteSheet} showMuscleGroup={false} />
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'recent' && recentFiltered.length > 0 && (
          <ul className="divide-y divide-gray-100 bg-white mt-2 mx-4 rounded-2xl border border-gray-200 overflow-hidden">
            {recentFiltered.map((name) => (
              <li key={name}>
                <button
                  onClick={() => pick(name)}
                  className="w-full text-left px-4 py-3.5 text-[15px] font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Eigen oefening toevoegen knop */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <button
          onClick={() => setAddSheet(true)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          Eigen oefening
        </button>
      </div>

      {/* Info sheet */}
      <BottomSheet open={infoSheet !== null} onClose={() => setInfoSheet(null)}>
        {infoSheet && (
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">{infoSheet.name}</h2>
              <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {infoSheet.muscleGroup}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 mb-5">{infoSheet.description}</p>
            <button
              onClick={() => { pick(infoSheet.name); setInfoSheet(null) }}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium transition hover:opacity-90"
            >
              Oefening toevoegen
            </button>
            <button onClick={() => setInfoSheet(null)} className="mt-2 w-full text-gray-500 py-2 text-sm">
              Sluiten
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Delete custom exercise sheet */}
      <BottomSheet open={deleteSheet !== null} onClose={() => setDeleteSheet(null)}>
        {deleteSheet && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-1">Oefening verwijderen</p>
            <p className="text-sm text-gray-500 mb-6">"{deleteSheet.name}" wordt uit je bibliotheek verwijderd.</p>
            <button
              onClick={async () => { await removeCustomExercise(deleteSheet.id); setDeleteSheet(null) }}
              className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3"
            >
              Verwijderen
            </button>
            <button onClick={() => setDeleteSheet(null)} className="w-full text-gray-500 py-2 text-sm">
              Annuleren
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Add custom exercise sheet */}
      <BottomSheet open={addSheet} onClose={() => setAddSheet(false)}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-4">Eigen oefening toevoegen</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Naam van de oefening"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spiergroep</label>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setNewMuscleGroup(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      newMuscleGroup === g
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleAddCustom}
            disabled={!newName.trim()}
            className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl font-medium disabled:opacity-40 transition hover:opacity-90"
          >
            Toevoegen
          </button>
          <button onClick={() => setAddSheet(false)} className="mt-2 w-full text-gray-500 py-2 text-sm">
            Annuleren
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

function ExerciseRow({
  exercise,
  onPick,
  onInfo,
  onDelete,
  showMuscleGroup = true,
}: {
  exercise: CombinedExercise
  onPick: (name: string) => void
  onInfo: (info: InfoSheet) => void
  onDelete: (item: { id: number; name: string }) => void
  showMuscleGroup?: boolean
}) {
  const isCustom = exercise.id.startsWith('custom-')
  const customId = isCustom ? parseInt(exercise.id.replace('custom-', '')) : null

  return (
    <li className="flex items-center">
      <button
        onClick={() => onPick(exercise.name)}
        className="flex-1 flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition min-w-0"
      >
        <span className="text-[15px] font-medium text-gray-900 truncate">{exercise.name}</span>
        {showMuscleGroup && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 shrink-0 ml-3">
            {exercise.muscleGroup}
          </span>
        )}
      </button>
      {exercise.description && (
        <button
          onClick={() => onInfo({ name: exercise.name, muscleGroup: exercise.muscleGroup, description: exercise.description! })}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 hover:text-gray-700 transition"
          aria-label="Uitleg"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      )}
      {isCustom && customId !== null && (
        <button
          onClick={() => onDelete({ id: customId, name: exercise.name })}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 hover:text-danger transition"
          aria-label="Verwijderen"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </li>
  )
}
