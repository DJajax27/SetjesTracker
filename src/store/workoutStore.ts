import { create } from 'zustand'
import { db, type WorkoutTemplate, type TemplateExercise, type WorkoutSession, type WorkoutSet } from '../db/db'

interface SessionWithName extends WorkoutSession {
  templateName: string
}

interface WorkoutStore {
  templates: WorkoutTemplate[]
  activeSession: WorkoutSession | null
  activeTemplate: WorkoutTemplate | null
  sessionExercises: TemplateExercise[]
  sets: WorkoutSet[]
  history: SessionWithName[]

  loadTemplates: () => Promise<void>
  createTemplate: (name: string, exerciseNames: string[]) => Promise<void>
  startSession: (templateId: number) => Promise<number>
  loadSession: (sessionId: number) => Promise<void>
  loadHistory: () => Promise<void>
  addSet: (exerciseId: number, reps: number, weight: number) => Promise<void>
  deleteSet: (id: number) => Promise<void>
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  templates: [],
  activeSession: null,
  activeTemplate: null,
  sessionExercises: [],
  sets: [],
  history: [],

  loadTemplates: async () => {
    const templates = await db.templates.toArray()
    set({ templates })
  },

  createTemplate: async (name: string, exerciseNames: string[]) => {
    const templateId = (await db.templates.add({ name })) as number
    for (let i = 0; i < exerciseNames.length; i++) {
      await db.exercises.add({ templateId, name: exerciseNames[i], order: i })
    }
  },

  startSession: async (templateId: number) => {
    const date = new Date().toISOString()
    const sessionId = (await db.sessions.add({ templateId, date })) as number
    return sessionId
  },

  loadSession: async (sessionId: number) => {
    const session = await db.sessions.get(sessionId)
    if (!session) {
      set({ activeSession: null, activeTemplate: null, sessionExercises: [], sets: [] })
      return
    }
    const template = await db.templates.get(session.templateId)
    const exercises = await db.exercises
      .where('templateId')
      .equals(session.templateId)
      .sortBy('order')
    const sets = await db.sets.where('sessionId').equals(sessionId).toArray()
    set({ activeSession: session, activeTemplate: template ?? null, sessionExercises: exercises, sets })
  },

  loadHistory: async () => {
    const sessions = await db.sessions.orderBy('date').reverse().toArray()
    const templateIds = [...new Set(sessions.map((s) => s.templateId))]
    const templates =
      templateIds.length > 0 ? await db.templates.where('id').anyOf(templateIds).toArray() : []
    const nameById = new Map(templates.map((t) => [t.id!, t.name]))
    const history = sessions.map((s) => ({ ...s, templateName: nameById.get(s.templateId) ?? '—' }))
    set({ history })
  },

  addSet: async (exerciseId: number, reps: number, weight: number) => {
    const { activeSession } = get()
    if (!activeSession?.id) return
    const id = (await db.sets.add({
      sessionId: activeSession.id,
      exerciseId,
      reps,
      weight,
      unit: 'kg',
    })) as number
    const newSet = await db.sets.get(id)
    if (newSet) {
      set((s) => ({ sets: [...s.sets, newSet] }))
    }
  },

  deleteSet: async (id: number) => {
    await db.sets.delete(id)
    set((s) => ({ sets: s.sets.filter((ws) => ws.id !== id) }))
  },
}))
