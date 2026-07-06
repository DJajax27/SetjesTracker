import type { WorkoutSession } from '../db/db'

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function calcStreak(sessions: WorkoutSession[]): number {
  const completedDays = new Set(
    sessions
      .filter((s) => s.completedAt)
      .map((s) => localDateKey(new Date(s.completedAt!)))
  )
  const today = new Date()
  const todayKey = localDateKey(today)
  let streak = 0
  const d = new Date(today)
  d.setHours(12, 0, 0, 0)
  if (!completedDays.has(todayKey)) d.setDate(d.getDate() - 1)
  while (completedDays.has(localDateKey(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function calcThisWeek(sessions: WorkoutSession[]): number {
  const now = new Date()
  const daysFromMonday = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)
  return sessions.filter((s) => s.completedAt && new Date(s.completedAt) >= monday).length
}

export function calcTotalTime(totalSets: number): string {
  const totalMinutes = totalSets * 2
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}u`
  return `${hours}u ${minutes}m`
}
