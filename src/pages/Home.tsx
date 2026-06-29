import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'

export default function Home() {
  const navigate = useNavigate()
  const { templates, loadTemplates, startSession } = useWorkoutStore()

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleStart = async (templateId: number) => {
    const sessionId = await startSession(templateId)
    navigate(`/session/${sessionId}`)
  }

  const actions = (
    <Link
      to="/template/new"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      + Nieuw
    </Link>
  )

  return (
    <Layout title="Mijn trainingen" actions={actions}>
      <div className="space-y-3">
        {templates.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">
            Nog geen trainingen. Maak er een aan!
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between"
            >
              <p className="font-semibold">{template.name}</p>
              <button
                onClick={() => handleStart(template.id!)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
              >
                Start
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  )
}