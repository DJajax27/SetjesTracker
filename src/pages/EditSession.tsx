import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db/db'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'

type EditSet = { id?: number; reps: string; weight: string }
type EditExercise = {
  exerciseId?: number
  sessionExerciseId?: number
  name: string
  sets: EditSet[]
  isNew: boolean
}

export default function EditSession() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { saveSessionEdits } = useWorkoutStore()

  const [exercises, setExercises] = useState<EditExercise[]>([])
  const [originalExerciseIds, setOriginalExerciseIds] = useState<number[]>([])
  const [originalSessionExIds, setOriginalSessionExIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const sessionId = Number(id)
    ;(async () => {
      const session = await db.sessions.get(sessionId)
      if (!session) { navigate('/history'); return }

      const sets = await db.sets.where('sessionId').equals(sessionId).toArray()
      const usedExerciseIds = [...new Set(sets.filter((s) => s.exerciseId).map((s) => s.exerciseId!))]
      const usedSessionExIds = [...new Set(sets.filter((s) => s.sessionExerciseId).map((s) => s.sessionExerciseId!))]

      const templateExercises = usedExerciseIds.length > 0
        ? await db.exercises.where('id').anyOf(usedExerciseIds).toArray()
        : []
      const sessionExercises = usedSessionExIds.length > 0
        ? await db.sessionExercises.where('id').anyOf(usedSessionExIds).toArray()
        : []

      const toEditSet = (s: typeof sets[0]): EditSet => ({
        id: s.id,
        reps: String(s.reps),
        weight: String(s.weight),
      })

      const editExercises: EditExercise[] = [
        ...templateExercises.map((ex) => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: sets.filter((s) => s.exerciseId === ex.id).map(toEditSet),
          isNew: false,
        })),
        ...sessionExercises.map((se) => ({
          sessionExerciseId: se.id,
          name: se.name,
          sets: sets.filter((s) => s.sessionExerciseId === se.id).map(toEditSet),
          isNew: false,
        })),
      ]

      setExercises(editExercises)
      setOriginalExerciseIds(usedExerciseIds)
      setOriginalSessionExIds(usedSessionExIds)
      setLoading(false)
    })()
  }, [id, navigate])

  const updateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight', value: string) => {
    setExercises((prev) =>
      prev.map((ex, ei) =>
        ei === exIdx
          ? { ...ex, sets: ex.sets.map((s, si) => (si === setIdx ? { ...s, [field]: value } : s)) }
          : ex
      )
    )
  }

  const removeSet = (exIdx: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, ei) => ei === exIdx ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIdx) } : ex)
    )
  }

  const addSet = (exIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, ei) => ei === exIdx ? { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] } : ex)
    )
  }

  const removeExercise = (exIdx: number) => {
    setExercises((prev) => prev.filter((_, ei) => ei !== exIdx))
  }

  const addExercise = () => {
    setExercises((prev) => [...prev, { name: '', sets: [{ reps: '', weight: '' }], isNew: true }])
  }

  const updateExerciseName = (exIdx: number, name: string) => {
    setExercises((prev) => prev.map((ex, ei) => ei === exIdx ? { ...ex, name } : ex))
  }

  const handleSave = async () => {
    const sessionId = Number(id)

    const currentExerciseIds = exercises.filter((ex) => ex.exerciseId).map((ex) => ex.exerciseId!)
    const currentSessionExIds = exercises.filter((ex) => ex.sessionExerciseId).map((ex) => ex.sessionExerciseId!)

    const deletedExerciseIds = originalExerciseIds.filter((id) => !currentExerciseIds.includes(id))
    const deletedSessionExerciseIds = originalSessionExIds.filter((id) => !currentSessionExIds.includes(id))

    const updatedSets: { id: number; reps: number; weight: number }[] = []
    const newSets: { exerciseId?: number; sessionExerciseId?: number; reps: number; weight: number }[] = []
    const newExercises: { name: string; sets: { reps: number; weight: number }[] }[] = []

    for (const ex of exercises.filter((ex) => !ex.isNew)) {
      for (const s of ex.sets) {
        const r = parseInt(s.reps), w = parseFloat(s.weight)
        if (!r || !w) continue
        if (s.id) {
          updatedSets.push({ id: s.id, reps: r, weight: w })
        } else {
          newSets.push({ exerciseId: ex.exerciseId, sessionExerciseId: ex.sessionExerciseId, reps: r, weight: w })
        }
      }
    }

    for (const ex of exercises.filter((ex) => ex.isNew)) {
      if (!ex.name.trim()) continue
      const validSets = ex.sets
        .map((s) => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) }))
        .filter((s) => s.reps > 0 && s.weight > 0)
      newExercises.push({ name: ex.name.trim(), sets: validSets })
    }

    await saveSessionEdits(sessionId, deletedExerciseIds, deletedSessionExerciseIds, updatedSets, newSets, newExercises)
    navigate('/history')
  }

  if (loading) {
    return (
      <Layout title="Sessie bewerken" back>
        <p className="text-center text-gray-400 mt-16">Laden…</p>
      </Layout>
    )
  }

  return (
    <Layout title="Sessie bewerken" back>
      <div className="space-y-5">
        {exercises.map((ex, exIdx) => (
          <div key={exIdx} className="bg-white rounded-xl shadow-sm border p-4">
            {ex.isNew ? (
              <input
                type="text"
                value={ex.name}
                onChange={(e) => updateExerciseName(exIdx, e.target.value)}
                placeholder="Naam oefening"
                className="w-full font-semibold text-base mb-3 border-b pb-1 focus:outline-none focus:border-accent"
              />
            ) : (
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">{ex.name}</p>
                <button
                  onClick={() => removeExercise(exIdx)}
                  className="text-danger text-sm"
                >
                  Oefening verwijderen
                </button>
              </div>
            )}

            <div className="space-y-2 mb-3">
              {ex.sets.map((s, setIdx) => (
                <div key={setIdx} className="flex items-end gap-2">
                  <span className="text-gray-400 text-sm w-10 pb-2 flex-shrink-0">Set {setIdx + 1}</span>
                  <div className="flex-1">
                    {setIdx === 0 && <label className="block text-xs text-gray-500 mb-1">Herh.</label>}
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                      placeholder="5"
                      min="1"
                      className="w-full border rounded-lg px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    {setIdx === 0 && <label className="block text-xs text-gray-500 mb-1">Gewicht (kg)</label>}
                    <input
                      type="number"
                      value={s.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                      placeholder="60"
                      min="0"
                      step="0.5"
                      className="w-full border rounded-lg px-2 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeSet(exIdx, setIdx)}
                    className="text-danger text-lg leading-none min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                    aria-label="Set verwijderen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(exIdx)}
              className="text-accent text-sm font-medium"
            >
              + Set toevoegen
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addExercise}
          className="w-full border border-dashed border-gray-300 text-gray-500 py-3 rounded-xl text-sm"
        >
          + Oefening toevoegen
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-base"
        >
          Opslaan
        </button>
      </div>
    </Layout>
  )
}
