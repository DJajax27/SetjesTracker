import { supabase } from './supabase'
import { pushAll, pullAll } from './sync'

function syncIfLoggedIn(): void {
  supabase.auth.getSession().then(({ data }: any) => {
    const session = data?.session
    if (!session) return
    pushAll(session.user.id).catch(() => {})
    pullAll(session.user.id).catch(() => {})
  })
}

export function initBackgroundSync(): void {
  // Pull on startup
  syncIfLoggedIn()

  // Pull every 60 seconds
  setInterval(syncIfLoggedIn, 60_000)

  // Push when coming back online
  window.addEventListener('online', syncIfLoggedIn)
}
