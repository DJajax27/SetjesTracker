import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db/db'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'

type ExistingExercise = { id: number; name: string }

export default function EditTemplate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateTemplate = useWorkoutStore((s) => s.updateTemplate)

  const [name, setName] = useState('')
  const [existing, setExisting] = useState<ExistingExercise[]>([])
  const [newExercises, setNewExercises] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const templateId = Number(id)
    Promise.all([
      db.templates.get(templateId),
      db.exercises.where('templateId').equals(templateId).sortBy('order'),
    ]).then(([template, exercises]) => {
      if (!template) { navigate('/'); return }
      setName(template.name)
      setExisting(exercises.map((ex) => ({ id: ex.id!, name: ex.name })))
      setLoading(false)
    })
  }, [id, navigate])

  const removeExisting = (exId: number) =>
    setExisting((prev) => prev.filter((ex) => ex.id !== exId))

  const addNew = () => setNewExercises((prev) => [...prev, ''])

  const updateNew = (i: number, value: string) => {
    setError('')
    setNewExercises((prev) => prev.map((ex, idx) => (idx === i ? value : ex)))
  }

  const removeNew = (i: number) =>
    setNewExercises((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validNew = newExercises.filter((n) => n.trim() !== '')
    if (existing.length + validNew.length === 0) {
      setError('Voeg minimaal één oefening toe.')
      return
    }
    try {
      await updateTemplate(Number(id), name.trim(), existing.map((ex) => ex.id), validNew)
      navigate('/')
    } catch (err) {
      setError('Opslaan mislukt. Probeer het opnieuw.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Layout title="Training bewerken" back>
        <p className="text-center text-gray-400 mt-16">Laden…</p>
      </Layout>
    )
  }

  return (
    <Layout title="Training bewerken" back>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Oefeningen</label>
          <div className="space-y-2">
            {existing.map((ex) => (
              <div key={ex.id} className="flex gap-2">
                <input
                  type="text"
                  value={ex.name}
                  readOnly
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeExisting(ex.id)}
                  className="text-red-400 px-2 text-xl leading-none"
                  aria-label="Oefening verwijderen"
                >
                  ×
                </button>
              </div>
            ))}
            {newExercises.map((ex, i) => (
              <div key={`new-${i}`} className="flex gap-2">
                <input
                  type="text"
                  value={ex}
                  onChange={(e) => updateNew(i, e.target.value)}
                  placeholder={`Oefening ${existing.length + i + 1}`}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="text-red-400 px-2 text-xl leading-none"
                  aria-label="Oefening verwijderen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={addNew}
            className="mt-3 text-blue-600 text-sm font-medium"
          >
            + Oefening toevoegen
          </button>
        </div>

        <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-medium">
          Opslaan
        </button>
      </form>
    </Layout>
  )
}
