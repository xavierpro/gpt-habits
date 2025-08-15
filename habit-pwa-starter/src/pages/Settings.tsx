import { repo } from '../lib/db'

export default function Settings() {
  async function exportData() {
    const data = await repo.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-export-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <button className="px-4 py-2 rounded-lg border" onClick={exportData}>Export Data (JSON)</button>
      <div className="text-sm text-gray-500">
        Add to Home Screen on iPhone: Share → “Add to Home Screen”
      </div>
    </div>
  )
}
