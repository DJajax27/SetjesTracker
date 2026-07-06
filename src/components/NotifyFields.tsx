interface Props {
  enabled: boolean
  time: string
  onToggle: (enabled: boolean) => void
  onTimeChange: (time: string) => void
}

export default function NotifyFields({ enabled, time, onToggle, onTimeChange }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Melding ontvangen</span>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            enabled ? 'bg-accent' : 'bg-gray-300'
          }`}
          aria-pressed={enabled}
          aria-label="Melding aan of uit"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tijdstip</label>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}
    </div>
  )
}
