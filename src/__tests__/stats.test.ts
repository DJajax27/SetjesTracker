import { describe, it, expect } from 'vitest'
import { calcStreak, calcThisWeek, calcTotalTime } from '../utils/stats'
import type { WorkoutSession } from '../db/db'

let _id = 1
function makeSession(completedAt?: string): WorkoutSession {
  return { id: _id++, templateId: 1, date: new Date().toISOString(), completedAt }
}

function isoFromNow(deltaDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + deltaDays)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

describe('calcStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calcStreak([])).toBe(0)
  })

  it('returns 0 for sessions without completedAt', () => {
    expect(calcStreak([makeSession()])).toBe(0)
  })

  it('returns 1 for a single session today', () => {
    expect(calcStreak([makeSession(isoFromNow(0))])).toBe(1)
  })

  it('counts consecutive days ending today', () => {
    const sessions = [makeSession(isoFromNow(0)), makeSession(isoFromNow(-1)), makeSession(isoFromNow(-2))]
    expect(calcStreak(sessions)).toBe(3)
  })

  it('breaks on a gap', () => {
    const sessions = [makeSession(isoFromNow(0)), makeSession(isoFromNow(-2))]
    expect(calcStreak(sessions)).toBe(1)
  })

  it('counts from yesterday when no session today', () => {
    const sessions = [makeSession(isoFromNow(-1)), makeSession(isoFromNow(-2))]
    expect(calcStreak(sessions)).toBe(2)
  })

  it('deduplicates multiple sessions on the same day', () => {
    const sessions = [makeSession(isoFromNow(0)), makeSession(isoFromNow(0)), makeSession(isoFromNow(-1))]
    expect(calcStreak(sessions)).toBe(2)
  })
})

describe('calcThisWeek', () => {
  it('returns 0 for no sessions', () => {
    expect(calcThisWeek([])).toBe(0)
  })

  it('counts sessions completed today', () => {
    const sessions = [makeSession(isoFromNow(0)), makeSession(isoFromNow(0))]
    expect(calcThisWeek(sessions)).toBe(2)
  })

  it('excludes sessions older than this week', () => {
    const sessions = [makeSession(isoFromNow(-14))]
    expect(calcThisWeek(sessions)).toBe(0)
  })

  it('excludes sessions without completedAt', () => {
    expect(calcThisWeek([makeSession()])).toBe(0)
  })
})

describe('calcTotalTime', () => {
  it('returns 0m for 0 sets', () => {
    expect(calcTotalTime(0)).toBe('0m')
  })

  it('returns minutes only when under 60', () => {
    expect(calcTotalTime(10)).toBe('20m')
  })

  it('returns hours only when evenly divisible', () => {
    expect(calcTotalTime(30)).toBe('1u')
  })

  it('returns hours and minutes', () => {
    expect(calcTotalTime(40)).toBe('1u 20m')
  })

  it('handles large set counts', () => {
    expect(calcTotalTime(120)).toBe('4u')
  })
})
