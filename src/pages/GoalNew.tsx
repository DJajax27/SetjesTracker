import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useGoalsStore } from '../store/goalsStore'
import { requestNotificationPermission } from '../services/notificationService'
import NotifyFields from '../components/NotifyFields'

export default function GoalNew() {
  const navigate = useNavigate()
  const { createGoal } = useGoalsStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'recurring' | 'deadline' | 'weekly'>('recurring')
  const [targetDate, setTargetDate] = useState('')
  const [weeklyTarget, setWeeklyTarget] = useState(3)
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('')
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const [notifyTime, setNotifyTime] = useState('08:00')

  const handleNotifyToggle = async (enabled: boolean) => {
    if (enabled) await requestNotificationPermission()
    setNotifyEnabled(enabled)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    await createGoal({
      name: name.trim(),
      description: description.trim(),
      type,
      targetDate: type === 'deadline' && targetDate ? targetDate : undefined,
      weeklyTarget: type === 'weekly' ? weeklyTarget : undefined,
      targetValue: type === 'deadline' && targetValue ? parseFloat(targetValue) : undefined,
      currentValue: type === 'deadline' ? 0 : undefined,
      unit: type === 'deadline' && unit.trim() ? unit.trim() : undefined,
      notifyEnabled,
      notifyTime,
    })
    navigate('/goals')
  }

  return (
    <Layout title="Nieuw doel" back>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naam <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Elke dag stretchen"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optionele toelichting"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="recurring"
                checked={type === 'recurring'}
                onChange={() => setType('recurring')}
                className="accent-gray-900"
              />
              <span className="text-sm">Dagelijks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="weekly"
                checked={type === 'weekly'}
                onChange={() => setType('weekly')}
                className="accent-gray-900"
              />
              <span className="text-sm">Wekelijks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="deadline"
                checked={type === 'deadline'}
                onChange={() => setType('deadline')}
                className="accent-gray-900"
              />
              <span className="text-sm">Deadline</span>
            </label>
          </div>
        </div>

        {type === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doel per week (aantal keer)
            </label>
            <input
              type="number"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
              min="1"
              max="7"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <p className="mt-1 text-xs text-gray-400">
              Bijv. 3 = {weeklyTarget}× per week
            </p>
          </div>
        )}

        {type === 'deadline' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Einddatum</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Doel (getal)</label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="Bijv. 10"
                  min="0"
                  step="any"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Eenheid</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Bijv. km, kg, pagina's"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          </>
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
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium disabled:opacity-40 mt-2 transition hover:opacity-90"
        >
          Opslaan
        </button>
        <button onClick={() => navigate('/goals')} className="w-full text-gray-500 py-2 text-sm">
          Annuleren
        </button>
      </div>
    </Layout>
  )
}
