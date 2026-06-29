import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'
import type { TemplateExercise } from '../db/db'

function ExerciseCard({ exercise }: { exercise: TemplateExercise }) {
  const { sets, addSet, deleteSet } = useWorkoutStore()
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const exerciseSets = sets.filter((s) => s.exerciseId === exercise.id)

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = parseInt(reps)
    const w = parseFloat(weight)
    if (!r || !w) return
    await addSet(exercise.id!, r, w)
    setReps('')
    setWeight('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="font-semibold mb-3">{exercise.name}</h3>

      {exerciseSets.length > 0 && (
        <div className="mb-3 space-y-1">
          {exerciseSets.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-400 w-12">Set {i + 1}</span>
              <span className="flex-1">
                {s.reps} herh. × {s.weight} kg
              </span>
              <button onClick={() => deleteSet(s.id!)} className="text-red-400 text-xs ml-2">
                verwijder
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddSet} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Herhalingen</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="5"
            min="1"
            className="w-full border rounded-lg px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Gewicht (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="60"
            min="0"
            step="0.5"
            className="w-full border rounded-lg px-2 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap"
        >
          + Set
        </button>
      </form>
    </div>
  )
}

export default function SessionView() {
  const { id } = useParams<{ id: string }>()
  const { activeSession, activeTemplate, sessionExercises, loadSession } = useWorkoutStore()

  useEffect(() => {
    if (id) loadSession(Number(id))
  }, [id, loadSession])

  if (!activeSession) {
    return (
      <Layout title="Sessie laden…">
        <p className="text-center text-gray-400 mt-16">Even geduld…</p>
      </Layout>
    )
  }

  const subtitle = new Date(activeSession.date).toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <Layout title={activeTemplate?.name ?? '—'} subtitle={subtitle} back>
      <div className="space-y-4">
        {sessionExercises.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </Layout>
  )
}