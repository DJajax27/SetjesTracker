import { create } from 'zustand'
import { db, type WorkoutTemplate, type TemplateExercise, type WorkoutSession, type WorkoutSet } from '../db/db'
import type { SessionExercise } from '../db/db'

interface SessionWithName extends WorkoutSession {
  templateName: string
}

interface WorkoutStore {
  templates: WorkoutTemplate[]
  activeSession: WorkoutSession | null
  activeTemplate: WorkoutTemplate | null
  sessionExercises: TemplateExercise[]
  sets: WorkoutSet[]
  previousSetsByExercise: Record<number, WorkoutSet[]>
  history: SessionWithName[]

  loadTemplates: () => Promise<void>
  createTemplate: (name: string, exerciseNames: string[], category?: string) => Promise<void>
  renameTemplate: (templateId: number, name: string) => Promise<void>
  updateTemplate: (templateId: number, name: string, keptExerciseIds: number[], newExerciseNames: string[], category?: string) => Promise<void>
  renameSession: (sessionId: number, name: string) => Promise<void>
  startSession: (templateId: number) => Promise<number>
  loadSession: (sessionId: number) => Promise<void>
  loadHistory: () => Promise<void>
  addSet: (exerciseId: number, reps: number, weight: number) => Promise<void>
  deleteSet: (id: number) => Promise<void>
  updateSet: (id: number, reps: number, weight: number) => Promise<void>
  saveSessionEdits: (
    sessionId: number,
    deletedExerciseIds: number[],
    deletedSessionExerciseIds: number[],
    updatedSets: { id: number; reps: number; weight: number }[],
    newSets: { exerciseId?: number; sessionExerciseId?: number; reps: number; weight: number }[],
    newExercises: { name: string; sets: { reps: number; weight: number }[] }[]
  ) => Promise<void>
  completeSession: (sessionId: number) => Promise<void>
  deleteSession: (sessionId: number) => Promise<void>
  deleteTemplate: (templateId: number) => Promise<void>
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  templates: [],
  activeSession: null,
  activeTemplate: null,
  sessionExercises: [],
  sets: [],
  previousSetsByExercise: {},
  history: [],

  loadTemplates: async () => {
    const templates = await db.templates.toArray()
    set({ templates })
  },

  createTemplate: async (name: string, exerciseNames: string[], category?: string) => {
    const templateId = (await db.templates.add({ name, category })) as number
    for (let i = 0; i < exerciseNames.length; i++) {
      await db.exercises.add({ templateId, name: exerciseNames[i], order: i })
    }
  },

  renameSession: async (sessionId: number, name: string) => {
    await db.sessions.update(sessionId, { customName: name })
    set((s) => ({
      history: s.history.map((h) => (h.id === sessionId ? { ...h, customName: name } : h)),
    }))
  },

  renameTemplate: async (templateId: number, name: string) => {
    await db.templates.update(templateId, { name })
    set((s) => ({
      templates: s.templates.map((t) => (t.id === templateId ? { ...t, name } : t)),
      history: s.history.map((h) => (h.templateId === templateId ? { ...h, templateName: name } : h)),
    }))
  },

  updateTemplate: async (templateId: number, name: string, keptExerciseIds: number[], newExerciseNames: string[], category?: string) => {
    await db.templates.update(templateId, { name, category })
    const allExercises = await db.exercises.where('templateId').equals(templateId).toArray()
    const toDelete = allExercises.filter((ex) => !keptExerciseIds.includes(ex.id!))
    for (const ex of toDelete) {
      await db.sets.where('exerciseId').equals(ex.id!).delete()
      await db.exercises.delete(ex.id!)
    }
    for (let i = 0; i < newExerciseNames.length; i++) {
      await db.exercises.add({ templateId, name: newExerciseNames[i], order: keptExerciseIds.length + i })
    }
    set((s) => ({
      templates: s.templates.map((t) => (t.id === templateId ? { ...t, name, category } : t)),
      history: s.history.map((h) => (h.templateId === templateId ? { ...h, templateName: name } : h)),
    }))
  },

  startSession: async (templateId: number) => {
    const date = new Date().toISOString()
    const sessionId = (await db.sessions.add({ templateId, date })) as number
    return sessionId
  },

  loadSession: async (sessionId: number) => {
    const session = await db.sessions.get(sessionId)
    if (!session) {
      set({ activeSession: null, activeTemplate: null, sessionExercises: [], sets: [], previousSetsByExercise: {} })
      return
    }
    const template = await db.templates.get(session.templateId)
    const exercises = await db.exercises
      .where('templateId')
      .equals(session.templateId)
      .sortBy('order')
    const sets = await db.sets.where('sessionId').equals(sessionId).toArray()

    // All previous sessions for this template, newest first
    const allPrevSessions = await db.sessions
      .where('templateId')
      .equals(session.templateId)
      .filter((s) => s.id !== sessionId)
      .sortBy('date')
    allPrevSessions.reverse()

    const prevSessionIds = allPrevSessions.map((s) => s.id!)
    const allPrevSets =
      prevSessionIds.length > 0
        ? await db.sets.where('sessionId').anyOf(prevSessionIds).toArray()
        : []

    // Per exercise: pick the most recent session that actually has sets for it
    const previousSetsByExercise: Record<number, WorkoutSet[]> = {}
    for (const prevSession of allPrevSessions) {
      const sessSets = allPrevSets.filter((s) => s.sessionId === prevSession.id)
      for (const ex of exercises) {
        const exId = ex.id!
        if (previousSetsByExercise[exId]) continue
        const exSets = sessSets.filter((s) => s.exerciseId === exId)
        if (exSets.length > 0) previousSetsByExercise[exId] = exSets
      }
    }

    set({ activeSession: session, activeTemplate: template ?? null, sessionExercises: exercises, sets, previousSetsByExercise })
  },

  loadHistory: async () => {
    const sessions = await db.sessions
      .orderBy('date')
      .reverse()
      .filter((s) => s.completedAt !== undefined)
      .toArray()
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

  updateSet: async (id: number, reps: number, weight: number) => {
    await db.sets.update(id, { reps, weight })
  },

  saveSessionEdits: async (sessionId, deletedExerciseIds, deletedSessionExerciseIds, updatedSets, newSets, newExercises) => {
    for (const exId of deletedExerciseIds) {
      await db.sets.where('sessionId').equals(sessionId).and((s) => s.exerciseId === exId).delete()
    }
    for (const seId of deletedSessionExerciseIds) {
      await db.sets.where('sessionExerciseId').equals(seId).delete()
      await db.sessionExercises.delete(seId)
    }
    for (const s of updatedSets) {
      await db.sets.update(s.id, { reps: s.reps, weight: s.weight })
    }
    for (const s of newSets) {
      await db.sets.add({ sessionId, exerciseId: s.exerciseId, sessionExerciseId: s.sessionExerciseId, reps: s.reps, weight: s.weight, unit: 'kg' })
    }
    for (const ex of newExercises) {
      const seId = (await db.sessionExercises.add({ sessionId, name: ex.name })) as number
      for (const s of ex.sets) {
        await db.sets.add({ sessionId, sessionExerciseId: seId, reps: s.reps, weight: s.weight, unit: 'kg' })
      }
    }
  },

  completeSession: async (sessionId: number) => {
    const completedAt = new Date().toISOString()
    await db.sessions.update(sessionId, { completedAt })
    set((s) => ({
      activeSession:
        s.activeSession?.id === sessionId ? { ...s.activeSession, completedAt } : s.activeSession,
    }))
  },

  deleteSession: async (sessionId: number) => {
    await db.sets.where('sessionId').equals(sessionId).delete()
    await db.sessionExercises.where('sessionId').equals(sessionId).delete()
    await db.sessions.delete(sessionId)
    set((s) => ({ history: s.history.filter((h) => h.id !== sessionId) }))
  },

  deleteTemplate: async (templateId: number) => {
    const sessions = await db.sessions.where('templateId').equals(templateId).toArray()
    const sessionIds = sessions.map((s) => s.id!)
    if (sessionIds.length > 0) {
      await db.sets.where('sessionId').anyOf(sessionIds).delete()
    }
    await db.sessions.where('templateId').equals(templateId).delete()
    await db.exercises.where('templateId').equals(templateId).delete()
    await db.templates.delete(templateId)
    set((s) => ({ templates: s.templates.filter((t) => t.id !== templateId) }))
  },
}))
