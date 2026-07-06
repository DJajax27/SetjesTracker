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
    previousSetsByExercise: {},
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

describe('loadSession — previousSetsByExercise', () => {
  it('maps previous sets by exerciseId for the most recent session that has them', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!
    const exerciseId = store().sessionExercises[0]?.id ?? (await (async () => {
      const firstId = await store().startSession(templateId)
      await store().loadSession(firstId)
      return store().sessionExercises[0].id!
    })())

    const firstId = await store().startSession(templateId)
    await store().loadSession(firstId)
    const exId = store().sessionExercises[0].id!
    await store().addSet(exId, 5, 100)

    const secondId = await store().startSession(templateId)
    await store().loadSession(secondId)

    expect(store().previousSetsByExercise[exId]).toHaveLength(1)
    expect(store().previousSetsByExercise[exId][0]).toMatchObject({ reps: 5, weight: 100 })
  })

  it('falls back to the last session that has sets when the most recent has none', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!

    // Session 1: log a set
    const firstId = await store().startSession(templateId)
    await store().loadSession(firstId)
    const exId = store().sessionExercises[0].id!
    await store().addSet(exId, 5, 100)

    // Session 2: log nothing (empty session)
    await store().startSession(templateId)

    // Session 3: should still see session 1's sets
    const thirdId = await store().startSession(templateId)
    await store().loadSession(thirdId)

    expect(store().previousSetsByExercise[exId]).toHaveLength(1)
    expect(store().previousSetsByExercise[exId][0]).toMatchObject({ reps: 5, weight: 100 })
  })

  it('returns empty record when no prior session exists', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)

    expect(store().previousSetsByExercise).toEqual({})
  })
})

describe('completeSession', () => {
  it('sets completedAt on the session in the database', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)

    await store().completeSession(sessionId)

    const session = await db.sessions.get(sessionId)
    expect(session?.completedAt).toBeDefined()
  })

  it('updates activeSession in the store', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)

    await store().completeSession(sessionId)

    expect(store().activeSession?.completedAt).toBeDefined()
  })
})

describe('deleteSession', () => {
  it('removes the session and its sets from the database', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().loadSession(sessionId)
    await store().addSet(store().sessionExercises[0].id!, 5, 100)

    await store().deleteSession(sessionId)

    expect(await db.sessions.get(sessionId)).toBeUndefined()
    expect(await db.sets.count()).toBe(0)
  })

  it('removes the session from the history in the store', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const sessionId = await store().startSession(store().templates[0].id!)
    await store().completeSession(sessionId)
    await store().loadHistory()

    await store().deleteSession(sessionId)

    expect(store().history).toHaveLength(0)
  })
})

describe('deleteTemplate', () => {
  it('removes the template, its exercises, sessions and sets', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!
    const sessionId = await store().startSession(templateId)
    await store().loadSession(sessionId)
    await store().addSet(store().sessionExercises[0].id!, 5, 100)

    await store().deleteTemplate(templateId)

    expect(await db.templates.get(templateId)).toBeUndefined()
    expect(await db.exercises.where('templateId').equals(templateId).count()).toBe(0)
    expect(await db.sessions.get(sessionId)).toBeUndefined()
    expect(await db.sets.count()).toBe(0)
  })

  it('removes the template from the store', async () => {
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()
    const templateId = store().templates[0].id!

    await store().deleteTemplate(templateId)

    expect(store().templates).toHaveLength(0)
  })
})

describe('loadHistory', () => {
  it('returns sessions enriched with template name, newest first', async () => {
    await store().createTemplate('Rug & Biceps', ['Deadlift'])
    await store().createTemplate('Push day', ['Bench press'])
    await store().loadTemplates()

    const [t1, t2] = store().templates
    const s1 = await store().startSession(t1.id!)
    const s2 = await store().startSession(t2.id!)
    await store().completeSession(s1)
    await store().completeSession(s2)

    await store().loadHistory()

    expect(store().history).toHaveLength(2)
    expect(store().history[0].templateName).toBe('Push day')
    expect(store().history[1].templateName).toBe('Rug & Biceps')
  })
})