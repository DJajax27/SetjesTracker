import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import BottomSheet from '../components/BottomSheet'
import { useGoalsStore, isCompletedToday } from '../store/goalsStore'

type SheetView = 'menu' | 'confirm-delete'
type SheetState = { goalId: number; view: SheetView } | null

function CheckboxIcon({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="var(--color-accent)" />
        <polyline points="7 12 10.5 15.5 17 8.5" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

export default function Goals() {
  const navigate = useNavigate()
  const { goals, loadGoals, removeGoal, toggleGoalToday } = useGoalsStore()
  const [sheet, setSheet] = useState<SheetState>(null)

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const visible = goals.filter((g) => !(g.type === 'deadline' && g.completedDates.length > 0))
  const sorted = [...visible].sort((a, b) => (isCompletedToday(a) ? 1 : 0) - (isCompletedToday(b) ? 1 : 0))

  const handleDelete = async () => {
    if (!sheet) return
    await removeGoal(sheet.goalId)
    setSheet(null)
  }

  const actions = (
    <button
      onClick={() => navigate('/goals/new')}
      className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      + Nieuw
    </button>
  )

  return (
    <Layout title="Doelen" actions={actions}>
      {visible.length === 0 ? (
        <div className="flex flex-col items-center mt-20 text-center px-4">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-gray-500 text-sm mb-6">Nog geen doelen. Maak er een aan!</p>
          <button
            onClick={() => navigate('/goals/new')}
            className="bg-accent text-white px-6 py-3 rounded-xl text-sm font-medium"
          >
            Nieuw doel
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((goal) => {
            const done = isCompletedToday(goal)
            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-opacity ${done ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleGoalToday(goal.id!)}
                    className="mt-0.5 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
                    aria-label={done ? 'Uitvinken' : 'Afvinken'}
                  >
                    <CheckboxIcon checked={done} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold truncate ${done ? 'line-through text-gray-400' : ''}`}>
                        {goal.name}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                        {goal.type === 'recurring' ? 'Dagelijks' : 'Deadline'}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-400 mt-0.5 truncate">{goal.description}</p>
                    )}
                    {goal.type === 'deadline' && goal.targetDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Einddatum: {new Date(goal.targetDate).toLocaleDateString('nl-NL')}
                      </p>
                    )}
                    {goal.notifyEnabled && (
                      <p className="text-xs text-gray-400 mt-1">🔔 {goal.notifyTime ?? '08:00'}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setSheet({ goalId: goal.id!, view: 'menu' })}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 shrink-0 -mr-2"
                    aria-label="Instellingen"
                  >
                    <DotsIcon />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BottomSheet open={sheet !== null} onClose={() => setSheet(null)}>
        {sheet?.view === 'menu' && (
          <div className="py-2">
            <button
              onClick={() => navigate(`/goals/${sheet.goalId}/edit`)}
              className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50"
            >
              Doel wijzigen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={() => setSheet((s) => s ? { ...s, view: 'confirm-delete' } : s)}
              className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50"
            >
              Doel verwijderen
            </button>
            <div className="h-px bg-gray-100 mx-6" />
            <button
              onClick={() => setSheet(null)}
              className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50"
            >
              Annuleren
            </button>
          </div>
        )}

        {sheet?.view === 'confirm-delete' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-6">
              Weet je zeker dat je dit doel wilt verwijderen?
            </p>
            <button
              onClick={handleDelete}
              className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3"
            >
              Doel verwijderen
            </button>
            <button
              onClick={() => setSheet(null)}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium"
            >
              Nee
            </button>
          </div>
        )}
      </BottomSheet>
    </Layout>
  )
}
