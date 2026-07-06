import Dexie, { type Table } from 'dexie'

export interface WorkoutTemplate {
  id?: number
  name: string
}

export interface TemplateExercise {
  id?: number
  templateId: number
  name: string
  order: number
}

export interface WorkoutSession {
  id?: number
  templateId: number
  date: string
  completedAt?: string
  customName?: string
}

export interface WorkoutSet {
  id?: number
  sessionId: number
  exerciseId?: number
  sessionExerciseId?: number
  reps: number
  weight: number
  unit: 'kg'
}

export interface SessionExercise {
  id?: number
  sessionId: number
  name: string
}

class WorkoutDB extends Dexie {
  templates!: Table<WorkoutTemplate>
  exercises!: Table<TemplateExercise>
  sessions!: Table<WorkoutSession>
  sets!: Table<WorkoutSet>
  sessionExercises!: Table<SessionExercise>

  constructor() {
    super('WorkoutLogger')
    this.version(1).stores({
      workouts: '++id, date',
      exercises: '++id, workoutId',
      sets: '++id, exerciseId',
    })
    this.version(2).stores({
      workouts: null,
      templates: '++id',
      exercises: '++id, templateId',
      sessions: '++id, templateId, date',
      sets: '++id, sessionId, exerciseId',
    })
    this.version(3).stores({
      sets: '++id, sessionId, exerciseId, sessionExerciseId',
      sessionExercises: '++id, sessionId',
    })
  }
}

export const db = new WorkoutDB()
