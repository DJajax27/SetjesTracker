import type { ReactNode } from 'react'

type Props = { open: boolean; onClose: () => void; children: ReactNode }

export default function BottomSheet({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
