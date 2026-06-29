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
}

export interface WorkoutSet {
  id?: number
  sessionId: number
  exerciseId: number
  reps: number
  weight: number
  unit: 'kg'
}

class WorkoutDB extends Dexie {
  templates!: Table<WorkoutTemplate>
  exercises!: Table<TemplateExercise>
  sessions!: Table<WorkoutSession>
  sets!: Table<WorkoutSet>

  constructor() {
    super('WorkoutLogger')
    // v1 was the old single-workout schema — kept here so Dexie can upgrade from it
    this.version(1).stores({
      workouts: '++id, date',
      exercises: '++id, workoutId',
      sets: '++id, exerciseId',
    })
    // v2 introduces the template/session split
    this.version(2).stores({
      workouts: null,
      templates: '++id',
      exercises: '++id, templateId',
      sessions: '++id, templateId, date',
      sets: '++id, sessionId, exerciseId',
    })
  }
}

export const db = new WorkoutDB()
