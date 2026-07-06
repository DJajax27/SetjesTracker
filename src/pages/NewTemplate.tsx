import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'

const CATEGORIES = ['KRACHT', 'VOLUME', 'CARDIO', 'MOBILITEIT']

export default function NewTemplate() {
  const navigate = useNavigate()
  const createTemplate = useWorkoutStore((s) => s.createTemplate)
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState<string[]>([''])
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  const addExerciseField = () => setExercises((prev) => [...prev, ''])

  const updateExercise = (index: number, value: string) => {
    setError('')
    setExercises((prev) => prev.map((e, i) => (i === index ? value : e)))
  }

  const removeExercise = (index: number) =>
    setExercises((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validExercises = exercises.filter((e) => e.trim() !== '')
    if (validExercises.length === 0) {
      setError('Voeg minimaal één oefening toe.')
      return
    }
    try {
      await createTemplate(name.trim(), validExercises, category || undefined)
      navigate('/')
    } catch (err) {
      setError('Opslaan mislukt. Probeer het opnieuw.')
      console.error(err)
    }
  }

  return (
    <Layout title="Nieuwe training" back>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bijv. Rug & Biceps"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categorie <span className="text-gray-400 font-normal">(optioneel)</span></label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === cat
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-gray-600 border-gray-200'
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
            {exercises.map((ex, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={ex}
                  onChange={(e) => updateExercise(i, e.target.value)}
                  placeholder={`Oefening ${i + 1}`}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="text-red-400 px-2 text-xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={addExerciseField}
            className="mt-3 text-accent text-sm font-medium"
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
