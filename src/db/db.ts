import Dexie, { type Table } from 'dexie'

export interface WorkoutTemplate {
  id?: number
  name: string
  category?: string
  updatedAt?: string
}

export interface TemplateExercise {
  id?: number
  templateId: number
  name: string
  order: number
  updatedAt?: string
}

export interface WorkoutSession {
  id?: number
  templateId: number
  date: string
  completedAt?: string
  customName?: string
  updatedAt?: string
}

export interface WorkoutSet {
  id?: number
  sessionId: number
  exerciseId?: number
  sessionExerciseId?: number
  reps: number
  weight: number
  unit: 'kg'
  updatedAt?: string
}

export interface SessionExercise {
  id?: number
  sessionId: number
  name: string
  updatedAt?: string
}

export interface ExerciseLibraryItem {
  id?: number
  name: string
  muscleGroup: string
  createdAt: string
  updatedAt?: string
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
  updatedAt?: string
}

class WorkoutDB extends Dexie {
  templates!: Table<WorkoutTemplate>
  exercises!: Table<TemplateExercise>
  sessions!: Table<WorkoutSession>
  sets!: Table<WorkoutSet>
  sessionExercises!: Table<SessionExercise>
  goals!: Table<Goal>
  exerciseLibrary!: Table<ExerciseLibraryItem>

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
    this.version(5).stores({
      exerciseLibrary: '++id, muscleGroup',
    })
  }
}

export const db = new WorkoutDB()
