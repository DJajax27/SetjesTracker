import { create } from 'zustand'
import { db } from '../db/db'
import { EXERCISES } from '../data/exercises'
import { triggerPush, deleteCloud } from '../lib/sync'
import type { ExerciseLibraryItem } from '../db/db'
import type { MuscleGroup } from '../data/exercises'

interface ExerciseLibraryStore {
  customExercises: ExerciseLibraryItem[]
  loadCustomExercises: () => Promise<void>
  addCustomExercise: (name: string, muscleGroup: MuscleGroup) => Promise<ExerciseLibraryItem>
  removeCustomExercise: (id: number) => Promise<void>
}

export const useExerciseLibraryStore = create<ExerciseLibraryStore>((set) => ({
  customExercises: [],

  loadCustomExercises: async () => {
    const items = await db.exerciseLibrary.toArray()
    set({ customExercises: items })
  },

  addCustomExercise: async (name, muscleGroup) => {
    const now = new Date().toISOString()
    const item: ExerciseLibraryItem = {
      name: name.trim(),
      muscleGroup,
      createdAt: now,
      updatedAt: now,
    }
    const id = (await db.exerciseLibrary.add(item)) as number
    const saved = { ...item, id }
    set((s) => ({ customExercises: [...s.customExercises, saved] }))
    triggerPush()
    return saved
  },

  removeCustomExercise: async (id) => {
    await db.exerciseLibrary.delete(id)
    set((s) => ({ customExercises: s.customExercises.filter((e) => e.id !== id) }))
    deleteCloud('exercise_library', id)
  },
}))

export function allExercises(customExercises: ExerciseLibraryItem[]) {
  const custom = customExercises.map((c) => ({
    id: `custom-${c.id}`,
    name: c.name,
    muscleGroup: c.muscleGroup as MuscleGroup,
  }))
  return [...EXERCISES, ...custom]
}
