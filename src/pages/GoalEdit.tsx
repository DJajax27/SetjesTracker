import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useGoalsStore } from '../store/goalsStore'
import { requestNotificationPermission } from '../services/notificationService'
import { db } from '../db/db'
import type { Goal } from '../db/db'
import NotifyFields from '../components/NotifyFields'

export default function GoalEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateGoal } = useGoalsStore()

  const [goal, setGoal] = useState<Goal | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'recurring' | 'deadline'>('recurring')
  const [targetDate, setTargetDate] = useState('')
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const [notifyTime, setNotifyTime] = useState('08:00')

  useEffect(() => {
    if (!id) return
    db.goals.get(Number(id)).then((g) => {
      if (!g) return
      setGoal(g)
      setName(g.name)
      setDescription(g.description)
      setType(g.type)
      setTargetDate(g.targetDate ?? '')
      setNotifyEnabled(g.notifyEnabled ?? false)
      setNotifyTime(g.notifyTime ?? '08:00')
    })
  }, [id])

  const handleNotifyToggle = async (enabled: boolean) => {
    if (enabled) await requestNotificationPermission()
    setNotifyEnabled(enabled)
  }

  const handleSave = async () => {
    if (!goal?.id || !name.trim()) return
    await updateGoal(goal.id, {
      name: name.trim(),
      description: description.trim(),
      type,
      targetDate: type === 'deadline' && targetDate ? targetDate : undefined,
      notifyEnabled,
      notifyTime,
    })
    navigate('/goals')
  }

  if (!goal) return null

  return (
    <Layout title="Doel wijzigen" back>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naam <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="recurring"
                checked={type === 'recurring'}
                onChange={() => setType('recurring')}
                className="accent-accent"
              />
              <span className="text-sm">Dagelijks herhalend</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="deadline"
                checked={type === 'deadline'}
                onChange={() => setType('deadline')}
                className="accent-accent"
              />
              <span className="text-sm">Deadline</span>
            </label>
          </div>
        </div>

        {type === 'deadline' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Einddatum</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        )}

        <NotifyFields
          enabled={notifyEnabled}
          time={notifyTime}
          onToggle={handleNotifyToggle}
          onTimeChange={setNotifyTime}
        />

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-accent text-white py-3 rounded-xl font-medium disabled:opacity-40 mt-2"
        >
          Opslaan
        </button>
        <button
          onClick={() => navigate('/goals')}
          className="w-full text-gray-500 py-2 text-sm"
        >
          Annuleren
        </button>
      </div>
    </Layout>
  )
}
