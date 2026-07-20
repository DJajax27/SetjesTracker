import type { ReactNode } from 'react'

type Props = { open: boolean; onClose: () => void; children: ReactNode; tall?: boolean }

export default function BottomSheet({ open, onClose, children, tall }: Props) {
  if (!open) return null

  if (tall) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
        <div className="relative bg-white rounded-t-2xl sheet-shadow-up w-full max-w-[640px] mx-auto animate-slide-up">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl sheet-shadow w-full max-w-sm animate-pop-in">
        {children}
      </div>
    </div>
  )
}
