import { supabase } from './supabase'
import { db } from '../db/db'

function toSnake(s: string) {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function toSupaRow(record: Record<string, any>, userId: string) {
  const out: Record<string, any> = { user_id: userId }
  for (const [k, v] of Object.entries(record)) {
    out[toSnake(k)] = v
  }
  return out
}

function fromSupaRow(row: Record<string, any>) {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(row)) {
    if (k === 'user_id') continue
    out[toCamel(k)] = v
  }
  return out
}

const TABLES = [
  { dexie: 'templates', supa: 'templates' },
  { dexie: 'exercises', supa: 'exercises' },
  { dexie: 'sessions', supa: 'sessions' },
  { dexie: 'sets', supa: 'sets' },
  { dexie: 'sessionExercises', supa: 'session_exercises' },
  { dexie: 'goals', supa: 'goals' },
  { dexie: 'exerciseLibrary', supa: 'exercise_library' },
] as const

export async function pushAll(userId: string): Promise<void> {
  for (const { dexie: tbl, supa } of TABLES) {
    const records = await (db as any)[tbl].toArray()
    if (!records.length) continue
    const rows = records.map((r: any) => toSupaRow(r, userId))
    await supabase.from(supa).upsert(rows, { onConflict: 'user_id,id' })
  }
}

export async function pullAll(userId: string): Promise<void> {
  for (const { dexie: tbl, supa } of TABLES) {
    const { data, error } = await supabase.from(supa).select('*').eq('user_id', userId)
    if (error || !data) continue
    for (const row of data) {
      const record = fromSupaRow(row)
      const local = await (db as any)[tbl].get(record.id)
      if (!local || !local.updatedAt || (record.updatedAt && record.updatedAt > local.updatedAt)) {
        await (db as any)[tbl].put(record)
      }
    }
  }
}

export async function syncOnLogin(userId: string): Promise<void> {
  try {
    await pushAll(userId)
    await pullAll(userId)
  } catch {
    // best-effort: sync failures are silent
  }
}

export function triggerPush(): void {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return
    pushAll(session.user.id).catch(() => {})
  })
}

export function deleteCloud(supaTable: string, id: number): void {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return
    supabase.from(supaTable).delete().eq('user_id', session.user.id).eq('id', id).then(() => {})
  })
}

export function deleteCloudBy(supaTable: string, col: string, val: number): void {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return
    supabase.from(supaTable).delete().eq('user_id', session.user.id).eq(col, val).then(() => {})
  })
}

export function deleteCloudByMany(supaTable: string, col: string, vals: number[]): void {
  if (!vals.length) return
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return
    supabase.from(supaTable).delete().eq('user_id', session.user.id).in(col, vals).then(() => {})
  })
}
