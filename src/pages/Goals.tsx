import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import BottomSheet from '../components/BottomSheet'
import { useGoalsStore, isCompletedToday, thisWeekCompletions } from '../store/goalsStore'
import { Target, Plus, TrendingUp, Check, MoreVertical, Minus, Pencil } from 'lucide-react'
import type { Goal } from '../db/db'

type SheetView = 'menu' | 'confirm-delete'
type SheetState = { goalId: number; view: SheetView } | null
type ValueSheet = { goalId: number; draft: string } | null

function goalProgress(goal: Goal): number {
  if (goal.type === 'weekly') {
    const count = thisWeekCompletions(goal)
    return Math.min(Math.round((count / (goal.weeklyTarget ?? 1)) * 100), 100)
  }
  if (goal.type === 'deadline') {
    if (goal.targetValue && goal.targetValue > 0) {
      return Math.min(Math.round(((goal.currentValue ?? 0) / goal.targetValue) * 100), 100)
    }
    return goal.completedDates.length > 0 ? 100 : 0
  }
  if (goal.completedDates.length === 0) return 0
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recent = goal.completedDates.filter((d) => new Date(d) >= thirtyDaysAgo).length
  return Math.min(Math.round((recent / 30) * 100), 100)
}

function isGoalDone(goal: Goal): boolean {
  if (goal.type === 'weekly') return thisWeekCompletions(goal) >= (goal.weeklyTarget ?? 1)
  if (goal.type === 'deadline') {
    if (goal.targetValue && goal.targetValue > 0) return (goal.currentValue ?? 0) >= goal.targetValue
    return goal.completedDates.length > 0
  }
  return isCompletedToday(goal)
}

export default function Goals() {
  const navigate = useNavigate()
  const { goals, loadGoals, removeGoal, toggleGoalToday, incrementGoalToday, decrementGoalToday, updateGoalCurrentValue } = useGoalsStore()
  const [sheet, setSheet] = useState<SheetState>(null)
  const [valueSheet, setValueSheet] = useState<ValueSheet>(null)

  useEffect(() => { loadGoals() }, [loadGoals])

  const visible = goals.filter((g) => {
    if (g.type === 'deadline') {
      if (g.targetValue && g.targetValue > 0) return (g.currentValue ?? 0) < g.targetValue
      return g.completedDates.length === 0
    }
    return true
  })
  const sorted = [...visible].sort((a, b) => (isGoalDone(a) ? 1 : 0) - (isGoalDone(b) ? 1 : 0))

  const checkedToday = visible.filter((g) => isCompletedToday(g)).length
  const avgProgress = visible.length
    ? Math.round(visible.reduce((s, g) => s + goalProgress(g), 0) / visible.length)
    : 0

  const handleDelete = async () => {
    if (!sheet) return
    await removeGoal(sheet.goalId)
    setSheet(null)
  }

  const handleSaveValue = async () => {
    if (!valueSheet) return
    const parsed = parseFloat(valueSheet.draft)
    if (!isNaN(parsed) && parsed >= 0) await updateGoalCurrentValue(valueSheet.goalId, parsed)
    setValueSheet(null)
  }

  const valueSheetGoal = valueSheet ? goals.find((g) => g.id === valueSheet.goalId) : null

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-10 sm:px-8 sm:pt-14">

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Blijf op koers
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Doelen
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Kleine stappen, grote resultaten. Volg je persoonlijke doelen.
            </p>
          </div>
          <button
            onClick={() => navigate('/goals/new')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            Nieuw doel
          </button>
        </header>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-3 gap-3">
          <StatCard icon={<Target className="h-3.5 w-3.5" />} label="Actief" value={`${visible.length}`} unit="dln" />
          <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Voortgang" value={`${avgProgress}`} unit="%" />
          <StatCard icon={<Check className="h-3.5 w-3.5" />} label="Vandaag" value={`${checkedToday}`} unit="x" />
        </section>

        {/* Section header */}
        <div className="mt-12 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Jouw doelen
          </h2>
          <span className="text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'doel' : 'doelen'}
          </span>
        </div>

        {/* Goal list */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-foreground">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-medium text-foreground">Nog geen doelen</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Stel je eerste doel in met <span className="font-medium text-foreground">+ Nieuw doel</span>.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border bg-surface-elevated overflow-hidden">
            <ul>
              {sorted.map((goal, index) => {
                const done = isGoalDone(goal)
                const progress = goalProgress(goal)
                const weekCount = goal.type === 'weekly' ? thisWeekCompletions(goal) : 0
                const weekTarget = goal.weeklyTarget ?? 1
                const todayChecked = isCompletedToday(goal)

                return (
                  <li
                    key={goal.id}
                    className={`p-4 transition-opacity ${index > 0 ? 'border-t border-border' : ''} ${done && goal.type !== 'recurring' ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-4">

                      {/* Left action button — differs per type */}
                      {goal.type === 'recurring' && (
                        <button
                          onClick={() => toggleGoalToday(goal.id!)}
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition ${todayChecked ? 'bg-foreground text-white' : 'bg-surface text-foreground hover:bg-foreground hover:text-white'}`}
                          aria-label={todayChecked ? 'Uitvinken' : 'Afvinken'}
                        >
                          {todayChecked ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Target className="h-4 w-4" strokeWidth={2} />}
                        </button>
                      )}

                      {goal.type === 'weekly' && (
                        <button
                          onClick={() => { if (!done) incrementGoalToday(goal.id!) }}
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition ${weekCount > 0 ? 'bg-foreground text-white' : 'bg-surface text-foreground hover:bg-foreground hover:text-white'} ${done ? 'cursor-default' : ''}`}
                          aria-label="Afvinken"
                        >
                          {done
                            ? <Check className="h-4 w-4 stroke-[2.5]" />
                            : weekCount > 0
                              ? <span className="text-sm font-bold tabular-nums">{weekCount}</span>
                              : <Plus className="h-4 w-4" strokeWidth={2.5} />
                          }
                        </button>
                      )}

                      {goal.type === 'deadline' && (
                        <button
                          onClick={() => setValueSheet({ goalId: goal.id!, draft: String(goal.currentValue ?? 0) })}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-muted"
                          aria-label="Voortgang bewerken"
                        >
                          {(goal.currentValue ?? 0) > 0
                            ? <Pencil className="h-4 w-4" strokeWidth={2} />
                            : <Target className="h-4 w-4" strokeWidth={2} />
                          }
                        </button>
                      )}

                      {/* Goal info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`truncate text-[15px] font-medium ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {goal.name}
                          </h3>
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground shrink-0">
                            {goal.type === 'recurring' ? 'Dagelijks' : goal.type === 'weekly' ? 'Wekelijks' : 'Deadline'}
                          </span>
                        </div>

                        {/* Subline per type */}
                        {goal.type === 'weekly' && (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">{weekCount} van {weekTarget} deze week</span>
                            {weekCount > 0 && (
                              <button
                                onClick={() => decrementGoalToday(goal.id!)}
                                className="flex h-4 w-4 items-center justify-center rounded-full text-gray-900 hover:bg-gray-200 transition"
                                aria-label="Één check ongedaan maken"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}

                        {goal.type === 'deadline' && goal.targetValue && goal.targetValue > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {goal.currentValue ?? 0} van {goal.targetValue}{goal.unit ? ` ${goal.unit}` : ''}
                          </p>
                        )}
                        {goal.type === 'deadline' && goal.targetDate && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Einddatum: {new Date(goal.targetDate).toLocaleDateString('nl-NL')}
                          </p>
                        )}
                        {goal.type === 'recurring' && goal.description && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{goal.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => setSheet({ goalId: goal.id!, view: 'menu' })}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition shrink-0"
                        aria-label="Instellingen"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress bar — not shown for recurring goals */}
                    {goal.type !== 'recurring' && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-medium tabular-nums text-foreground">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Menu + delete sheet */}
      <BottomSheet open={sheet !== null} onClose={() => setSheet(null)}>
        {sheet?.view === 'menu' && (
          <div className="py-2">
            <button onClick={() => navigate(`/goals/${sheet.goalId}/edit`)} className="w-full text-left px-6 py-4 text-base text-gray-800 active:bg-gray-50">Doel wijzigen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={() => setSheet((s) => s ? { ...s, view: 'confirm-delete' } : s)} className="w-full text-left px-6 py-4 text-base text-danger active:bg-gray-50">Doel verwijderen</button>
            <div className="h-px bg-gray-100 mx-6" />
            <button onClick={() => setSheet(null)} className="w-full text-left px-6 py-4 text-base text-gray-500 active:bg-gray-50">Annuleren</button>
          </div>
        )}
        {sheet?.view === 'confirm-delete' && (
          <div className="px-6 py-5">
            <p className="text-base font-semibold mb-6">Weet je zeker dat je dit doel wilt verwijderen?</p>
            <button onClick={handleDelete} className="w-full bg-danger text-white py-3 rounded-xl font-medium mb-3">Doel verwijderen</button>
            <button onClick={() => setSheet(null)} className="w-full bg-foreground text-white py-3 rounded-xl font-medium">Nee</button>
          </div>
        )}
      </BottomSheet>

      {/* Value edit sheet (deadline goals) */}
      <BottomSheet open={valueSheet !== null} onClose={() => setValueSheet(null)}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold mb-1">Voortgang bijwerken</p>
          {valueSheetGoal?.unit && (
            <p className="text-sm text-muted-foreground mb-4">
              Doel: {valueSheetGoal.targetValue} {valueSheetGoal.unit}
            </p>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Huidige stand{valueSheetGoal?.unit ? ` (${valueSheetGoal.unit})` : ''}
          </label>
          <input
            type="number"
            value={valueSheet?.draft ?? ''}
            onChange={(e) => setValueSheet((s) => s ? { ...s, draft: e.target.value } : s)}
            min="0"
            step="any"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
            autoFocus
          />
          <button onClick={handleSaveValue} className="w-full bg-foreground text-white py-3 rounded-xl font-medium mb-3">
            Opslaan
          </button>
          <button onClick={() => setValueSheet(null)} className="w-full text-gray-500 py-2 text-sm">
            Annuleren
          </button>
        </div>
      </BottomSheet>

      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1 text-2xl font-semibold text-foreground">
        {value}
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
  )
}
