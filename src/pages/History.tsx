import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Layout from '../components/layout/Layout'

export default function History() {
  const { history, loadHistory } = useWorkoutStore()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return (
    <Layout title="Geschiedenis">
      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">Nog geen sessies gedaan.</p>
        ) : (
          history.map((session) => (
            <Link
              key={session.id}
              to={`/session/${session.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border"
            >
              <p className="font-semibold">{session.templateName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(session.date).toLocaleDateString('nl-NL', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))
        )}
      </div>
    </Layout>
  )
}