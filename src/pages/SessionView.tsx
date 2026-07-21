import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Footer from '../components/layout/Footer'
import type { TemplateExercise } from '../db/db'
import { ArrowLeft } from 'lucide-react'

type CardState = 'idle' | 'active' | 'done'
type LocalSet = { reps: string; weight: string }
type ExerciseCardProps = { exercise: TemplateExercise }
type CardHandle = { flush: () => Promise<void> }

const ExerciseCard = forwardRef<CardHandle, ExerciseCardProps>(function ExerciseCard({ exercise }, ref) {
  const { sets, previousSetsByExercise, addSet } = useWorkoutStore()
  const [cardState, setCardState] = useState<CardState>('idle')
  const [localSets, setLocalSets] = useState<LocalSet[]>([])

  const exerciseSets = sets.filter((s) => s.exerciseId === exercise.id)
  const prevSets = previousSetsByExercise[exercise.id!]
  const isFirstTime = prevSets === undefined

  const saveLocalSets = async () => {
    const valid = localSets.filter((s) => parseInt(s.reps) > 0 && parseFloat(s.weight) > 0)
    for (const s of valid) {
      await addSet(exercise.id!, parseInt(s.reps), parseFloat(s.weight))
    }
  }

  useImperativeHandle(ref, () => ({
    flush: async () => {
      if (cardState !== 'active') return
      await saveLocalSets()
    },
  }))

  const handleStart = () => {
    const firstPrev = prevSets?.[0]
    setLocalSets([{ reps: firstPrev ? String(firstPrev.reps) : '', weight: firstPrev ? String(firstPrev.weight) : '' }])
    setCardState('active')
  }

  const handleAddSet = () => {
    const idx = localSets.length
    const nextPrev = prevSets?.[idx]
    setLocalSets((prev) => [
      ...prev,
      { reps: nextPrev ? String(nextPrev.reps) : '', weight: nextPrev ? String(nextPrev.weight) : '' },
    ])
  }

  const handleRemoveSet = (idx: number) => {
    setLocalSets((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleChange = (idx: number, field: 'reps' | 'weight', value: string) => {
    setLocalSets((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))
  }

  const handleFinish = async () => {
    await saveLocalSets()
    setCardState('done')
  }

  if (cardState === 'idle') {
    const prevSummary = isFirstTime
      ? 'Eerste keer'
      : prevSets.map((s) => `${s.reps}×${s.weight}`).join(' · ')
    return (
      <div className="rounded-2xl border border-border bg-surface-elevated p-4">
        <p className="font-medium text-foreground">{exercise.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">{prevSummary}</p>
        <button
          onClick={handleStart}
          className="w-full bg-foreground text-white py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
        >
          Starten
        </button>
      </div>
    )
  }

  if (cardState === 'done') {
    return (
      <div className="rounded-2xl border border-border bg-surface-elevated p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">{exercise.name}</p>
          <span className="text-xs text-muted-foreground">
            {exerciseSets.length > 0 ? `${exerciseSets.length} sets ✓` : 'Overgeslagen'}
          </span>
        </div>
        {exerciseSets.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {exerciseSets.map((s) => `${s.reps}×${s.weight} kg`).join(' · ')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-4">
      <h3 className="font-medium text-foreground mb-3">{exercise.name}</h3>
      {isFirstTime && <p className="text-xs text-muted-foreground mb-2">Eerste keer</p>}

      <div className="space-y-3 mb-3">
        {localSets.map((s, i) => (
          <div key={i}>
            <div className="flex items-end gap-2">
              <span className="text-muted-foreground text-sm w-10 pb-2 flex-shrink-0">Set {i + 1}</span>
              <div className="flex-1">
                {i === 0 && <label className="block text-xs text-muted-foreground mb-1">Herh.</label>}
                <input
                  type="number"
                  value={s.reps}
                  onChange={(e) => handleChange(i, 'reps', e.target.value)}
                  placeholder="5"
                  min="1"
                  className="w-full border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-surface-elevated"
                />
              </div>
              <div className="flex-1">
                {i === 0 && <label className="block text-xs text-muted-foreground mb-1">Gewicht (kg)</label>}
                <input
                  type="number"
                  value={s.weight}
                  onChange={(e) => handleChange(i, 'weight', e.target.value)}
                  placeholder="60"
                  min="0"
                  step="0.5"
                  className="w-full border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground bg-surface-elevated"
                />
              </div>
              <button
                onClick={() => handleRemoveSet(i)}
                className="text-muted-foreground hover:text-danger text-lg leading-none min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 transition-colors"
                aria-label="Set verwijderen"
              >
                ×
              </button>
            </div>
            {!isFirstTime && prevSets[i] && (
              <p className="text-xs text-muted-foreground mt-0.5 pl-12">
                vorige: {prevSets[i].reps} × {prevSets[i].weight} kg
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddSet}
        className="w-full border border-border text-foreground py-1.5 rounded-lg text-sm mb-3 hover:bg-muted transition-colors"
      >
        + Set
      </button>

      <button
        onClick={handleFinish}
        className="w-full border border-border text-muted-foreground py-2 rounded-lg text-sm hover:bg-muted transition-colors"
      >
        Oefening afronden
      </button>
    </div>
  )
})

export default function SessionView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeSession, activeTemplate, sessionExercises, loadSession, completeSession } =
    useWorkoutStore()
  const cardRefs = useRef<Array<CardHandle | null>>([])

  useEffect(() => {
    if (id) loadSession(Number(id))
  }, [id, loadSession])

  if (!activeSession) {
    return (
      <div className="min-h-dvh bg-[var(--color-bg)] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Even geduld…</p>
      </div>
    )
  }

  const subtitle = new Date(activeSession.date).toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const handleComplete = async () => {
    await Promise.all(cardRefs.current.map((r) => r?.flush()))
    await completeSession(activeSession.id!)
    navigate('/')
  }

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">

        {/* Header */}
        <header>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </button>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {subtitle}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {activeTemplate?.name ?? '—'}
          </h1>
        </header>

        {/* Section header */}
        <div className="mt-10 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Oefeningen
          </h2>
          <span className="text-xs text-muted-foreground">
            {sessionExercises.length} oefening{sessionExercises.length !== 1 ? 'en' : ''}
          </span>
        </div>

        {/* Exercise cards */}
        <div className="mt-4 space-y-3">
          {sessionExercises.map((ex, i) => (
            <ExerciseCard key={ex.id} ref={(el) => { cardRefs.current[i] = el }} exercise={ex} />
          ))}
        </div>

        {/* Save button */}
        <div className="mt-8">
          <button
            onClick={handleComplete}
            className="w-full bg-foreground text-white py-3 rounded-full font-medium text-sm transition hover:opacity-90"
          >
            Sessie opslaan
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
