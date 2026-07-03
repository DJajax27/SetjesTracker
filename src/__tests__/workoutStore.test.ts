import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useWorkoutStore } from '../store/workoutStore'

const store = () => useWorkoutStore.getState()

beforeEach(async () => {
  await db.templates.clear()
  await db.exercises.clear()
  await db.sessions.clear()
  await db.sets.clear()
  useWorkoutStore.setState({
    templates: [],
    activeSession: null,
    activeTemplate: null,
    sessionExercises: [],
    sets: [],
    history: [],
  })
})

describe('createTemplate', () => {
  it('persists template and exercises to the database', async () => {
    await store().createTemplate('Rug & Biceps', ['Deadlift', 'Barbell curl'])
    await store().loadTemplates()

    expect(store().templates).toHaveLength(1)
    expect(store().templates[0].name).toBe('Rug & Biceps')

    const exercises = await db.exercises.toArray()
    expect(exercises).toHaveLength(2)
    expect(exercises.map((e) => e.name)).toEqual(['Deadlift', 'Barbell curl'])
  })
})

describe('startSession + loadSession', () => {
  it('creates a session and loads exercises from the template', async () => {
    await store().createTemplate('Push day', ['Bench press', 'Overhead press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!

    const sessionId = await store().startSession(templateId)
    await store().loadSession(sessionId)

    expect(store().activeTemplate?.name).toBe('Push day')
    expect(store().sessionExercises).toHaveLength(2)
    expect(store().sets).toHaveLength(0)
  })

  it('keeps previous sessions independent when starting a second session', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!

    const firstId = await store().startSession(templateId)
    await store().loadSession(firstId)
    await store().addSet(store().sessionExercises[0].id!, 5, 100)

    const secondId = await store().startSession(templateId)
    await store().loadSession(secondId)

    expect(store().sets).toHaveLength(0)
    expect(secondId).not.toBe(firstId)
  })
})

describe('addSet / deleteSet', () => {
  it('adds a set to the active session and stores it in the database', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)

    await store().addSet(store().sessionExercises[0].id!, 5, 100)

    expect(store().sets).toHaveLength(1)
    expect(store().sets[0]).toMatchObject({ reps: 5, weight: 100, unit: 'kg' })

    const dbSets = await db.sets.toArray()
    expect(dbSets).toHaveLength(1)
  })

  it('removes a set from both the store and the database', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)
    await store().addSet(store().sessionExercises[0].id!, 5, 100)

    await store().deleteSet(store().sets[0].id!)

    expect(store().sets).toHaveLength(0)
    expect(await db.sets.count()).toBe(0)
  })
})

describe('loadHistory', () => {
  it('returns sessions enriched with template name, newest first', async () => {
    await store().createTemplate('Rug & Biceps', ['Deadlift'])
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()

    const [t1, t2] = store().templates
    await store().startSession(t1.id!)
    await store().startSession(t2.id!)

    await store().loadHistory()

    expect(store().history).toHaveLength(2)
    expect(store().history[0].templateName).toBe('Push day')
    expect(store().history[1].templateName).toBe('Rug & Biceps')
  })
})