import localforage from 'localforage'

export type HabitType = 'positive' | 'negative'

export interface Habit {
  id: string
  name: string
  type: HabitType
  daysOfWeek: number[]
  targetPerDay: number | null
  archived: boolean
  createdAt: string
}

export interface Entry {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  value: number | boolean
  note?: string | null
  createdAt: string
}

export interface Mood {
  id: string
  date: string // YYYY-MM-DD
  score: number // 0-10
  note?: string | null
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  onboardingComplete: boolean
}

const db = localforage.createInstance({ name: 'habit-pwa' })

const key = (collection: string) => `col:${collection}`

async function getCollection<T>(collection: string): Promise<T[]> {
  return (await db.getItem<T[]>(key(collection))) ?? []
}

async function setCollection<T>(collection: string, items: T[]): Promise<void> {
  await db.setItem(key(collection), items)
}

export const repo = {
  async listHabits(): Promise<Habit[]> { return getCollection<Habit>('habit') },
  async saveHabit(h: Habit) {
    const items = await repo.listHabits()
    const ix = items.findIndex(x => x.id === h.id)
    if (ix >= 0) items[ix] = h; else items.push(h)
    await setCollection('habit', items)
  },
  async listEntries(): Promise<Entry[]> { return getCollection<Entry>('entry') },
  async saveEntry(e: Entry) {
    const items = await repo.listEntries()
    const ix = items.findIndex(x => x.id === e.id)
    if (ix >= 0) items[ix] = e; else items.push(e)
    await setCollection('entry', items)
  },
  async listMood(): Promise<Mood[]> { return getCollection<Mood>('mood') },
  async saveMood(m: Mood) {
    const items = await repo.listMood()
    const ix = items.findIndex(x => x.id === m.id)
    if (ix >= 0) items[ix] = m; else items.push(m)
    await setCollection('mood', items)
  },
  async exportAll() {
    const [habit, entry, mood] = await Promise.all([
      repo.listHabits(), repo.listEntries(), repo.listMood()
    ])
    return { habit, entry, mood, exportedAt: new Date().toISOString() }
  }
}

export function uid() {
  return crypto.randomUUID()
}

export function ymd(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
