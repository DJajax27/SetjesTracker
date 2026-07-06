import { useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useGoalsStore } from '../store/goalsStore'

export default function Progress() {
  const { goals, loadGoals } = useGoalsStore()

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const archived = goals.filter(
    (g) => g.type === 'deadline' && g.completedDates.length > 0
  )

  return (
    <Layout title="Progressie">
      <div className="flex flex-col items-center mt-16 text-center px-4 mb-10">
        <p className="text-4xl mb-4">📈</p>
        <p className="text-gray-500 text-sm">Progressiegrafieken komen in Fase 4.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          Archief
        </h2>
        {archived.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-4">
            Nog geen behaalde doelen met einddatum.
          </p>
        ) : (
          <div className="space-y-3">
            {archived.map((goal) => {
              const achievedDate = goal.completedDates[goal.completedDates.length - 1]
              return (
                <div key={goal.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="3" fill="#22c55e" />
                        <polyline points="7 12 10.5 15.5 17 8.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{goal.name}</p>
                      {goal.description && (
                        <p className="text-sm text-gray-400 mt-0.5 truncate">{goal.description}</p>
                      )}
                      <div className="flex gap-3 mt-1 flex-wrap">
                        {goal.targetDate && (
                          <p className="text-xs text-gray-400">
                            Deadline: {new Date(goal.targetDate).toLocaleDateString('nl-NL')}
                          </p>
                        )}
                        <p className="text-xs text-green-600 font-medium">
                          Behaald op {new Date(achievedDate).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
