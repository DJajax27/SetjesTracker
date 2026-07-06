import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useGoalsStore, isCompletedToday } from '../store/goalsStore'

const store = () => useGoalsStore.getState()

beforeEach(async () => {
  await db.goals.clear()
  useGoalsStore.setState({ goals: [] })
})

describe('createGoal', () => {
  it('persists a recurring goal to the database', async () => {
    await store().createGoal({ name: 'Stretchen', description: '', type: 'recurring' })
    const goals = await db.goals.toArray()
    expect(goals).toHaveLength(1)
    expect(goals[0].name).toBe('Stretchen')
    expect(goals[0].completedDates).toEqual([])
  })

  it('persists a deadline goal with targetDate', async () => {
    await store().createGoal({ name: 'Race', description: '', type: 'deadline', targetDate: '2026-12-31' })
    const goals = await db.goals.toArray()
    expect(goals[0].targetDate).toBe('2026-12-31')
  })

  it('adds the goal to the store', async () => {
    await store().createGoal({ name: 'Lopen', description: '', type: 'recurring' })
    expect(store().goals).toHaveLength(1)
  })
})

describe('updateGoal', () => {
  it('updates name and description in the database and store', async () => {
    await store().createGoal({ name: 'Oud', description: '', type: 'recurring' })
    const id = store().goals[0].id!
    await store().updateGoal(id, { name: 'Nieuw', description: 'Toelichting', type: 'recurring' })
    expect(store().goals[0].name).toBe('Nieuw')
    expect(store().goals[0].description).toBe('Toelichting')
    const dbGoal = await db.goals.get(id)
    expect(dbGoal?.name).toBe('Nieuw')
  })
})

describe('removeGoal', () => {
  it('deletes from the database and the store', async () => {
    await store().createGoal({ name: 'Lopen', description: '', type: 'recurring' })
    const id = store().goals[0].id!
    await store().removeGoal(id)
    expect(await db.goals.count()).toBe(0)
    expect(store().goals).toHaveLength(0)
  })
})

describe('toggleGoalToday', () => {
  it('adds today as a completedDate when unchecked', async () => {
    await store().createGoal({ name: 'Lopen', description: '', type: 'recurring' })
    const id = store().goals[0].id!
    await store().toggleGoalToday(id)
    const today = new Date().toISOString().slice(0, 10)
    expect(store().goals[0].completedDates).toContain(today)
    const dbGoal = await db.goals.get(id)
    expect(dbGoal?.completedDates).toContain(today)
  })

  it('removes today from completedDates when already checked (toggle)', async () => {
    await store().createGoal({ name: 'Lopen', description: '', type: 'recurring' })
    const id = store().goals[0].id!
    await store().toggleGoalToday(id)
    await store().toggleGoalToday(id)
    expect(store().goals[0].completedDates).toHaveLength(0)
  })

  it('toggling twice returns to the unchecked state in the database', async () => {
    await store().createGoal({ name: 'Lopen', description: '', type: 'recurring' })
    const id = store().goals[0].id!
    await store().toggleGoalToday(id)
    await store().toggleGoalToday(id)
    const dbGoal = await db.goals.get(id)
    const today = new Date().toISOString().slice(0, 10)
    expect(dbGoal?.completedDates).not.toContain(today)
  })
})

describe('isCompletedToday', () => {
  it('returns true when today is in completedDates', () => {
    const today = new Date().toISOString().slice(0, 10)
    const goal = { id: 1, name: 'Test', description: '', type: 'recurring' as const, completedDates: [today] }
    expect(isCompletedToday(goal)).toBe(true)
  })

  it('returns false when today is not in completedDates', () => {
    const goal = { id: 1, name: 'Test', description: '', type: 'recurring' as const, completedDates: ['2020-01-01'] }
    expect(isCompletedToday(goal)).toBe(false)
  })

  it('returns false for an empty completedDates array', () => {
    const goal = { id: 1, name: 'Test', description: '', type: 'recurring' as const, completedDates: [] }
    expect(isCompletedToday(goal)).toBe(false)
  })
})

describe('loadGoals', () => {
  it('loads goals from the database into the store', async () => {
    await db.goals.add({ name: 'Direct', description: '', type: 'recurring', completedDates: [] })
    await store().loadGoals()
    expect(store().goals).toHaveLength(1)
    expect(store().goals[0].name).toBe('Direct')
  })
})
