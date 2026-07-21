import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { db } from '../db/db'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'
import { BookOpen } from 'lucide-react'

const CATEGORIES = ['KRACHT', 'VOLUME', 'CARDIO', 'MOBILITEIT']

type ExistingExercise = { id: number; name: string }

export default function EditTemplate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const updateTemplate = useWorkoutStore((s) => s.updateTemplate)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
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
      setCategory(template.category ?? '')
      setExisting(exercises.map((ex) => ({ id: ex.id!, name: ex.name })))
      setLoading(false)
    })
  }, [id, navigate])

  // Add exercise returned from picker
  useEffect(() => {
    const state = location.state as { pickedExercise?: string } | null
    if (state?.pickedExercise && !loading) {
      setNewExercises((prev) => [...prev, state.pickedExercise!])
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.state, loading])

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
      await updateTemplate(Number(id), name.trim(), existing.map((ex) => ex.id), validNew, category || undefined)
      navigate('/')
    } catch (err) {
      setError('Opslaan mislukt. Probeer het opnieuw.')
      console.error(err)
    }
  }

  function openPicker() {
    navigate(`/exercise-picker?returnTo=/template/${id}/edit`)
  }

  if (loading) {
    return (
      <Layout title="Training bewerken" back backTo="/">
        <p className="text-center text-gray-400 mt-16">Laden…</p>
      </Layout>
    )
  }

  return (
    <Layout title="Training bewerken" back backTo="/">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorie <span className="text-gray-400 font-normal">(optioneel)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
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
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeExisting(ex.id)}
                  className="text-gray-400 hover:text-danger px-2 text-xl leading-none transition-colors"
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
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="text-gray-400 hover:text-danger px-2 text-xl leading-none transition-colors"
                  aria-label="Oefening verwijderen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}

          {/* Brede bibliotheekknop */}
          <button
            type="button"
            onClick={openPicker}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            <BookOpen className="h-4 w-4 text-gray-500" />
            Kies uit bibliotheek
          </button>

          <button type="button" onClick={addNew} className="mt-2 text-gray-900 text-sm font-medium">
            + Handmatig toevoegen
          </button>
        </div>

        <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium transition hover:opacity-90">
          Opslaan
        </button>
      </form>
    </Layout>
  )
}
