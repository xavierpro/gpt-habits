import { useEffect, useMemo, useState } from 'react'
import { repo, Entry, Habit, Mood } from '../lib/db'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function History() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [moods, setMoods] = useState<Mood[]>([])

  useEffect(() => {
    (async () => {
      setEntries(await repo.listEntries())
      setHabits(await repo.listHabits())
      setMoods(await repo.listMood())
    })()
  }, [])

  const moodData = useMemo(() => {
    return [...moods].sort((a,b)=>a.date.localeCompare(b.date)).map(m => ({ date: m.date.slice(5), score: m.score }))
  }, [moods])

  const completionByDay = useMemo(() => {
    const days = Array.from(new Set(entries.map(e => e.date))).sort()
    return days.map(day => {
      const total = habits.length || 1
      const done = entries.filter(e => e.date === day && e.value === true).length
      return { date: day.slice(5), pct: Math.round(100*done/total) }
    })
  }, [entries, habits])

  return (
    <div className="p-4 space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-2">Mood trend</h2>
        <div className="h-48 rounded-xl border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0,10]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Completion %</h2>
        <div className="h-48 rounded-xl border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0,100]} />
              <Tooltip />
              <Line type="monotone" dataKey="pct" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
