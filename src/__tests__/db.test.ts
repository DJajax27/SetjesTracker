import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'

beforeEach(async () => {
  await db.templates.clear()
  await db.exercises.clear()
  await db.sessions.clear()
  await db.sets.clear()
})

describe('schema', () => {
  it('opens with the expected tables', () => {
    const tableNames = db.tables.map((t) => t.name).sort()
    expect(tableNames).toEqual(['exercises', 'goals', 'sessionExercises', 'sessions', 'sets', 'templates'])
  })

  it('is at version 4', () => {
    expect(db.verno).toBe(4)
  })
})

describe('templates', () => {
  it('auto-increments id on add', async () => {
    const id1 = await db.templates.add({ name: 'Rug & Biceps' })
    const id2 = await db.templates.add({ name: 'Push day' })
    expect(id2).toBeGreaterThan(id1 as number)
  })

  it('retrieves a template by id', async () => {
    const id = await db.templates.add({ name: 'Rug & Biceps' })
    const template = await db.templates.get(id as number)
    expect(template?.name).toBe('Rug & Biceps')
  })

  it('returns all templates', async () => {
    await db.templates.add({ name: 'Rug & Biceps' })
    await db.templates.add({ name: 'Push day' })
    expect(await db.templates.count()).toBe(2)
  })
})

describe('exercises', () => {
  it('stores exercises linked to a template', async () => {
    const templateId = (await db.templates.add({ name: 'Rug & Biceps' })) as number
    await db.exercises.add({ templateId, name: 'Deadlift', order: 0 })
    await db.exercises.add({ templateId, name: 'Barbell curl', order: 1 })

    const exercises = await db.exercises.where('templateId').equals(templateId).sortBy('order')
    expect(exercises).toHaveLength(2)
    expect(exercises[0].name).toBe('Deadlift')
    expect(exercises[1].name).toBe('Barbell curl')
  })

  it('isolates exercises per template', async () => {
    const id1 = (await db.templates.add({ name: 'Rug & Biceps' })) as number
    const id2 = (await db.templates.add({ name: 'Push day' })) as number
    await db.exercises.add({ templateId: id1, name: 'Deadlift', order: 0 })
    await db.exercises.add({ templateId: id2, name: 'Bench press', order: 0 })

    const forTemplate1 = await db.exercises.where('templateId').equals(id1).toArray()
    expect(forTemplate1).toHaveLength(1)
    expect(forTemplate1[0].name).toBe('Deadlift')
  })
})

describe('sessions', () => {
  it('stores a session linked to a template', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    const date = new Date().toISOString()
    const sessionId = (await db.sessions.add({ templateId, date })) as number

    const session = await db.sessions.get(sessionId)
    expect(session?.templateId).toBe(templateId)
    expect(session?.date).toBe(date)
  })

  it('returns sessions for a template ordered by date descending', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    await db.sessions.add({ templateId, date: '2026-01-01T10:00:00.000Z' })
    await db.sessions.add({ templateId, date: '2026-01-15T10:00:00.000Z' })

    const sessions = await db.sessions.orderBy('date').reverse().toArray()
    expect(sessions[0].date).toBe('2026-01-15T10:00:00.000Z')
    expect(sessions[1].date).toBe('2026-01-01T10:00:00.000Z')
  })

  it('multiple sessions can share the same template', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    await db.sessions.add({ templateId, date: '2026-01-01T10:00:00.000Z' })
    await db.sessions.add({ templateId, date: '2026-01-08T10:00:00.000Z' })

    const sessions = await db.sessions.where('templateId').equals(templateId).toArray()
    expect(sessions).toHaveLength(2)
  })
})

describe('sets', () => {
  it('stores a set linked to a session and exercise', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    const exerciseId = (await db.exercises.add({ templateId, name: 'Bench press', order: 0 })) as number
    const sessionId = (await db.sessions.add({ templateId, date: new Date().toISOString() })) as number

    const setId = (await db.sets.add({ sessionId, exerciseId, reps: 5, weight: 100, unit: 'kg' })) as number
    const set = await db.sets.get(setId)

    expect(set?.reps).toBe(5)
    expect(set?.weight).toBe(100)
    expect(set?.unit).toBe('kg')
    expect(set?.sessionId).toBe(sessionId)
    expect(set?.exerciseId).toBe(exerciseId)
  })

  it('retrieves all sets for a session', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    const exerciseId = (await db.exercises.add({ templateId, name: 'Bench press', order: 0 })) as number
    const sessionId = (await db.sessions.add({ templateId, date: new Date().toISOString() })) as number

    await db.sets.add({ sessionId, exerciseId, reps: 5, weight: 100, unit: 'kg' })
    await db.sets.add({ sessionId, exerciseId, reps: 5, weight: 105, unit: 'kg' })

    const sets = await db.sets.where('sessionId').equals(sessionId).toArray()
    expect(sets).toHaveLength(2)
  })

  it('isolates sets between sessions', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    const exerciseId = (await db.exercises.add({ templateId, name: 'Bench press', order: 0 })) as number
    const session1 = (await db.sessions.add({ templateId, date: '2026-01-01T10:00:00.000Z' })) as number
    const session2 = (await db.sessions.add({ templateId, date: '2026-01-08T10:00:00.000Z' })) as number

    await db.sets.add({ sessionId: session1, exerciseId, reps: 5, weight: 100, unit: 'kg' })
    await db.sets.add({ sessionId: session2, exerciseId, reps: 5, weight: 110, unit: 'kg' })

    const setsForSession1 = await db.sets.where('sessionId').equals(session1).toArray()
    expect(setsForSession1).toHaveLength(1)
    expect(setsForSession1[0].weight).toBe(100)
  })

  it('deletes a set by id', async () => {
    const templateId = (await db.templates.add({ name: 'Push day' })) as number
    const exerciseId = (await db.exercises.add({ templateId, name: 'Bench press', order: 0 })) as number
    const sessionId = (await db.sessions.add({ templateId, date: new Date().toISOString() })) as number
    const setId = (await db.sets.add({ sessionId, exerciseId, reps: 5, weight: 100, unit: 'kg' })) as number

    await db.sets.delete(setId)
    expect(await db.sets.get(setId)).toBeUndefined()
  })
})