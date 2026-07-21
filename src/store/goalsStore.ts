import { create } from 'zustand'
import { db, type Goal } from '../db/db'

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function isCompletedToday(goal: Goal): boolean {
  return goal.completedDates.includes(toDateKey(new Date()))
}

function getWeekStart(): Date {
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // 0=Mon…6=Sun
  const start = new Date(now)
  start.setDate(now.getDate() - dayOfWeek)
  start.setHours(0, 0, 0, 0)
  return start
}

export function thisWeekCompletions(goal: Goal): number {
  const weekStart = getWeekStart()
  return goal.completedDates.filter((d) => new Date(d) >= weekStart).length
}

interface GoalsStore {
  goals: Goal[]
  loadGoals: () => Promise<void>
  createGoal: (data: Omit<Goal, 'id' | 'completedDates'>) => Promise<void>
  updateGoal: (id: number, data: Omit<Goal, 'id' | 'completedDates'>) => Promise<void>
  removeGoal: (id: number) => Promise<void>
  toggleGoalToday: (id: number) => Promise<void>
  incrementGoalToday: (id: number) => Promise<void>
  decrementGoalToday: (id: number) => Promise<void>
  updateGoalCurrentValue: (id: number, value: number) => Promise<void>
}

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  goals: [],

  loadGoals: async () => {
    const goals = await db.goals.toArray()
    set({ goals })
  },

  createGoal: async (data) => {
    const id = (await db.goals.add({ ...data, completedDates: [] })) as number
    const goal = await db.goals.get(id)
    if (goal) set((s) => ({ goals: [...s.goals, goal] }))
  },

  updateGoal: async (id, data) => {
    await db.goals.update(id, data)
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }))
  },

  removeGoal: async (id) => {
    await db.goals.delete(id)
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }))
  },

  toggleGoalToday: async (id) => {
    const today = toDateKey(new Date())
    const goal = get().goals.find((g) => g.id === id)
    if (!goal) return
    const completedDates = goal.completedDates.includes(today)
      ? goal.completedDates.filter((d) => d !== today)
      : [...goal.completedDates, today]
    await db.goals.update(id, { completedDates })
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, completedDates } : g)),
    }))
  },

  incrementGoalToday: async (id) => {
    const today = toDateKey(new Date())
    const goal = get().goals.find((g) => g.id === id)
    if (!goal) return
    const completedDates = [...goal.completedDates, today]
    await db.goals.update(id, { completedDates })
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, completedDates } : g)),
    }))
  },

  decrementGoalToday: async (id) => {
    const today = toDateKey(new Date())
    const goal = get().goals.find((g) => g.id === id)
    if (!goal) return
    const lastIdx = goal.completedDates.lastIndexOf(today)
    if (lastIdx === -1) return
    const completedDates = goal.completedDates.filter((_, i) => i !== lastIdx)
    await db.goals.update(id, { completedDates })
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, completedDates } : g)),
    }))
  },

  updateGoalCurrentValue: async (id, value) => {
    await db.goals.update(id, { currentValue: value })
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, currentValue: value } : g)),
    }))
  },
}))
