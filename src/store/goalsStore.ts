import { create } from 'zustand'
import { db, type Goal } from '../db/db'

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function isCompletedToday(goal: Goal): boolean {
  return goal.completedDates.includes(toDateKey(new Date()))
}

interface GoalsStore {
  goals: Goal[]
  loadGoals: () => Promise<void>
  createGoal: (data: Omit<Goal, 'id' | 'completedDates'>) => Promise<void>
  updateGoal: (id: number, data: Omit<Goal, 'id' | 'completedDates'>) => Promise<void>
  removeGoal: (id: number) => Promise<void>
  toggleGoalToday: (id: number) => Promise<void>
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
}))
