import { create } from 'zustand'
import { db, type WorkoutTemplate, type TemplateExercise, type WorkoutSession, type WorkoutSet } from '../db/db'
import { triggerPush, deleteCloud, deleteCloudBy, deleteCloudByMany } from '../lib/sync'

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

  createTemplate: async (name, exerciseNames, category?) => {
    const now = new Date().toISOString()
    const templateId = (await db.templates.add({ name, category, updatedAt: now })) as number
    for (let i = 0; i < exerciseNames.length; i++) {
      await db.exercises.add({ templateId, name: exerciseNames[i], order: i, updatedAt: now })
    }
    triggerPush()
  },

  renameSession: async (sessionId, name) => {
    const now = new Date().toISOString()
    await db.sessions.update(sessionId, { customName: name, updatedAt: now })
    set((s) => ({
      history: s.history.map((h) => (h.id === sessionId ? { ...h, customName: name } : h)),
    }))
    triggerPush()
  },

  renameTemplate: async (templateId, name) => {
    const now = new Date().toISOString()
    await db.templates.update(templateId, { name, updatedAt: now })
    set((s) => ({
      templates: s.templates.map((t) => (t.id === templateId ? { ...t, name } : t)),
      history: s.history.map((h) => (h.templateId === templateId ? { ...h, templateName: name } : h)),
    }))
    triggerPush()
  },

  updateTemplate: async (templateId, name, keptExerciseIds, newExerciseNames, category?) => {
    const now = new Date().toISOString()
    await db.templates.update(templateId, { name, category, updatedAt: now })
    const allExercises = await db.exercises.where('templateId').equals(templateId).toArray()
    const toDelete = allExercises.filter((ex) => !keptExerciseIds.includes(ex.id!))
    for (const ex of toDelete) {
      await db.sets.where('exerciseId').equals(ex.id!).delete()
      await db.exercises.delete(ex.id!)
      deleteCloud('exercises', ex.id!)
      deleteCloudBy('sets', 'exercise_id', ex.id!)
    }
    for (let i = 0; i < newExerciseNames.length; i++) {
      await db.exercises.add({ templateId, name: newExerciseNames[i], order: keptExerciseIds.length + i, updatedAt: now })
    }
    set((s) => ({
      templates: s.templates.map((t) => (t.id === templateId ? { ...t, name, category } : t)),
      history: s.history.map((h) => (h.templateId === templateId ? { ...h, templateName: name } : h)),
    }))
    triggerPush()
  },

  startSession: async (templateId) => {
    const now = new Date().toISOString()
    const sessionId = (await db.sessions.add({ templateId, date: now, updatedAt: now })) as number
    triggerPush()
    return sessionId
  },

  loadSession: async (sessionId) => {
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

  addSet: async (exerciseId, reps, weight) => {
    const { activeSession } = get()
    if (!activeSession?.id) return
    const now = new Date().toISOString()
    const id = (await db.sets.add({
      sessionId: activeSession.id,
      exerciseId,
      reps,
      weight,
      unit: 'kg',
      updatedAt: now,
    })) as number
    const newSet = await db.sets.get(id)
    if (newSet) {
      set((s) => ({ sets: [...s.sets, newSet] }))
    }
    triggerPush()
  },

  deleteSet: async (id) => {
    await db.sets.delete(id)
    set((s) => ({ sets: s.sets.filter((ws) => ws.id !== id) }))
    deleteCloud('sets', id)
  },

  updateSet: async (id, reps, weight) => {
    const now = new Date().toISOString()
    await db.sets.update(id, { reps, weight, updatedAt: now })
    triggerPush()
  },

  saveSessionEdits: async (sessionId, deletedExerciseIds, deletedSessionExerciseIds, updatedSets, newSets, newExercises) => {
    const now = new Date().toISOString()
    for (const exId of deletedExerciseIds) {
      await db.sets.where('sessionId').equals(sessionId).and((s) => s.exerciseId === exId).delete()
    }
    for (const seId of deletedSessionExerciseIds) {
      await db.sets.where('sessionExerciseId').equals(seId).delete()
      await db.sessionExercises.delete(seId)
      deleteCloud('session_exercises', seId)
      deleteCloudBy('sets', 'session_exercise_id', seId)
    }
    for (const s of updatedSets) {
      await db.sets.update(s.id, { reps: s.reps, weight: s.weight, updatedAt: now })
    }
    for (const s of newSets) {
      await db.sets.add({ sessionId, exerciseId: s.exerciseId, sessionExerciseId: s.sessionExerciseId, reps: s.reps, weight: s.weight, unit: 'kg', updatedAt: now })
    }
    for (const ex of newExercises) {
      const seId = (await db.sessionExercises.add({ sessionId, name: ex.name, updatedAt: now })) as number
      for (const s of ex.sets) {
        await db.sets.add({ sessionId, sessionExerciseId: seId, reps: s.reps, weight: s.weight, unit: 'kg', updatedAt: now })
      }
    }
    triggerPush()
  },

  completeSession: async (sessionId) => {
    const now = new Date().toISOString()
    await db.sessions.update(sessionId, { completedAt: now, updatedAt: now })
    set((s) => ({
      activeSession:
        s.activeSession?.id === sessionId ? { ...s.activeSession, completedAt: now } : s.activeSession,
    }))
    triggerPush()
  },

  deleteSession: async (sessionId) => {
    await db.sets.where('sessionId').equals(sessionId).delete()
    await db.sessionExercises.where('sessionId').equals(sessionId).delete()
    await db.sessions.delete(sessionId)
    set((s) => ({ history: s.history.filter((h) => h.id !== sessionId) }))
    deleteCloud('sessions', sessionId)
    deleteCloudBy('sets', 'session_id', sessionId)
    deleteCloudBy('session_exercises', 'session_id', sessionId)
  },

  deleteTemplate: async (templateId) => {
    const sessions = await db.sessions.where('templateId').equals(templateId).toArray()
    const sessionIds = sessions.map((s) => s.id!)
    if (sessionIds.length > 0) {
      await db.sets.where('sessionId').anyOf(sessionIds).delete()
    }
    await db.sessions.where('templateId').equals(templateId).delete()
    await db.exercises.where('templateId').equals(templateId).delete()
    await db.templates.delete(templateId)
    set((s) => ({ templates: s.templates.filter((t) => t.id !== templateId) }))
    deleteCloud('templates', templateId)
    deleteCloudBy('exercises', 'template_id', templateId)
    deleteCloudByMany('sessions', 'id', sessionIds)
    deleteCloudByMany('sets', 'session_id', sessionIds)
  },
}))
