import Dexie, { type Table } from 'dexie'

export interface WorkoutTemplate {
  id?: number
  name: string
  category?: string
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

export interface Goal {
  id?: number
  name: string
  description: string
  type: 'deadline' | 'recurring' | 'weekly'
  targetDate?: string
  weeklyTarget?: number
  targetValue?: number
  currentValue?: number
  unit?: string
  completedDates: string[]
  notifyEnabled?: boolean
  notifyTime?: string
}

class WorkoutDB extends Dexie {
  templates!: Table<WorkoutTemplate>
  exercises!: Table<TemplateExercise>
  sessions!: Table<WorkoutSession>
  sets!: Table<WorkoutSet>
  sessionExercises!: Table<SessionExercise>
  goals!: Table<Goal>

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
    this.version(4).stores({
      goals: '++id',
    })
  }
}

export const db = new WorkoutDB()
