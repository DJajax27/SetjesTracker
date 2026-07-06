import type { Goal } from '../db/db'

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register('/sw.js')
  } catch {
    return null
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

export async function scheduleReminders(goalNames: string[]): Promise<void> {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') return
  if (goalNames.length === 0) return
  try {
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({ type: 'schedule-reminders', goals: goalNames })
  } catch {
    // silent — reminders are best-effort
  }
}

export function scheduleGoalNotifications(goals: Goal[]): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  for (const goal of goals) {
    if (!goal.notifyEnabled) continue
    if (goal.completedDates.includes(today)) continue

    const [hours, minutes] = (goal.notifyTime ?? '08:00').split(':').map(Number)
    const fireAt = new Date()
    fireAt.setHours(hours, minutes, 0, 0)

    const delay = fireAt.getTime() - now.getTime()
    if (delay <= 0) {
      scheduleReminders([goal.name])
    } else {
      setTimeout(() => { scheduleReminders([goal.name]) }, delay)
    }
  }
}
