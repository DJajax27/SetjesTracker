import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { syncOnLogin } from '../lib/sync'
import type { User, Session } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  initialize: () => void
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<string | null>
  deleteAccount: () => Promise<string | null>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, initialized: true })
    })
    supabase.auth.onAuthStateChange((event, session) => {
      set({ session, user: session?.user ?? null, initialized: true })
      if (event === 'SIGNED_IN' && session) {
        syncOnLogin(session.user.id)
      }
    })
  },

  signUp: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({ email, password })
    set({ loading: false })
    if (error) return { error: error.message, needsConfirmation: false }
    return { error: null, needsConfirmation: !data.session }
  },

  signIn: async (email, password) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    return error?.message ?? null
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })
    return error?.message ?? null
  },

  deleteAccount: async () => {
    const { error } = await supabase.rpc('delete_current_user')
    if (error) return error.message
    await supabase.auth.signOut()
    return null
  },
}))
