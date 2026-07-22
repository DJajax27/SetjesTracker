import { supabase } from './supabase'
import { pushAll } from './sync'

export function initBackgroundSync(): void {
  window.addEventListener('online', () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      pushAll(session.user.id).catch(() => {})
    })
  })
}
