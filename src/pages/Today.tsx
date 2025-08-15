import { useEffect, useMemo, useState } from 'react'
import { repo, Habit, uid, ymd, Entry, Mood } from '../lib/db'
import { weekdayIndex } from '../lib/date'

export default function Today() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [mood, setMood] = useState<Mood | null>(null)
  const today = ymd()

  useEffect(() => {
    (async () => {
      const [hs, es, ms] = await Promise.all([repo.listHabits(), repo.listEntries(), repo.listMood()])
      setHabits(hs.filter(h => !h.archived && h.daysOfWeek.includes(weekdayIndex(today))))
      setEntries(es.filter(e => e.date === today))
      setMood(ms.find(m => m.date === today) ?? null)
    })()
  }, [today])

  const entriesByHabit = useMemo(() => {
    const map = new Map(entries.map(e => [e.habitId, e]))
    return map
  }, [entries])

  async function toggleHabit(h: Habit) {
    const existing = entriesByHabit.get(h.id)
    const next: Entry = existing ? { ...existing, value: !(existing.value as boolean) } : {
      id: uid(),
      habitId: h.id,
      date: today,
      value: true,
      createdAt: new Date().toISOString()
    }
    await repo.saveEntry(next)
    const all = await repo.listEntries()
    setEntries(all.filter(e => e.date === today))
  }

  async function setTodayMood(score: number) {
    const m: Mood = mood ? { ...mood, score } : { id: uid(), date: today, score }
    await repo.saveMood(m)
    setMood(m)
  }

  return (
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Mood</h2>
        <div className="p-4 rounded-xl border flex items-center gap-3">
          <input
            type="range" min={0} max={10} value={mood?.score ?? 5}
            onChange={e => setTodayMood(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="w-10 text-center text-sm">{mood?.score ?? 5}</span>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today&apos;s Habits</h2>
          <AddHabit onCreated={h => setHabits(prev => [...prev, h])} />
        </div>
        <div className="mt-2 grid gap-2">
          {habits.length === 0 && (
            <p className="text-sm text-gray-500">No habits scheduled for today yet. Add one!</p>
          )}
          {habits.map(h => {
            const done = Boolean(entriesByHabit.get(h.id)?.value)
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h)}
                className={"w-full text-left p-4 rounded-xl border transition " + (done ? "bg-brand-50 border-brand-200" : "bg-white hover:bg-gray-50")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-gray-500">{h.type === 'positive' ? 'Positive' : 'Negative'}</div>
                  </div>
                  <div className={"text-sm px-3 py-1 rounded-full " + (done ? "bg-brand-500 text-white" : "border")}>
                    {done ? "Done" : "Mark"}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function AddHabit({ onCreated }: { onCreated: (h: Habit) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<"positive"|"negative">("positive")
  const [days, setDays] = useState<number[]>([1,2,3,4,5])
  const [target, setTarget] = useState<number | ''>('')

  async function create() {
    const h: Habit = {
      id: uid(),
      name,
      type,
      daysOfWeek: days.sort(),
      targetPerDay: target === '' ? null : Number(target),
      archived: false,
      createdAt: new Date().toISOString()
    }
    await repo.saveHabit(h)
    onCreated(h)
    setOpen(false); setName(""); setDays([1,2,3,4,5]); setType("positive"); setTarget('')
  }

  function toggleDay(d: number) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  return (
    <>
      <button className="text-sm px-3 py-1 rounded-lg border" onClick={() => setOpen(true)}>+ Add</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl p-4 space-y-3">
            <div className="text-lg font-semibold">New Habit</div>
            <label className="block text-sm">
              Name
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label className="block text-sm">
              Type
              <select className="mt-1 w-full border rounded-lg px-3 py-2" value={type} onChange={e => setType(e.target.value as any)}>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
            </label>
            <div className="text-sm">
              Schedule (days)
              <div className="mt-1 grid grid-cols-7 gap-1">
                {['S','M','T','W','T','F','S'].map((l,i) => (
                  <button key={i}
                    onClick={() => toggleDay(i)}
                    className={"py-2 rounded-lg border text-sm " + (days.includes(i) ? "bg-brand-500 text-white" : "bg-white")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm">
              Target per day (optional number)
              <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2" value={target} onChange={e => setTarget(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button className="px-3 py-2 rounded-lg border" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-3 py-2 rounded-lg bg-brand-600 text-white disabled:opacity-50" disabled={!name.trim()} onClick={create}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
