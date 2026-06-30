'use client'

import { Send, CheckCircle, Clock } from 'lucide-react'
import { Booking, MASTERS } from '../lib/data'

interface Props {
  bookings: Booking[]
  onRemind: (id: string) => void
  onRefresh: () => void
}

export default function RemindersPanel({ bookings, onRemind }: Props) {
  const pending = bookings.filter(b => b.status === 'pending' && b.date === '2025-06-30')
  const reminded = bookings.filter(b => b.reminderSent && b.date === '2025-06-30')

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[13px] text-gray-500 mb-3">
          Клиентки, которые ещё не подтвердили запись — отправьте напоминание пока слот не сгорел.
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <CheckCircle size={28} className="text-emerald-400 mx-auto mb-2" />
            <div className="text-[13px] text-gray-500">Все клиентки подтвердили запись</div>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-amber-100 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[12px] font-semibold text-amber-600">
                    {b.clientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-gray-900">{b.clientName}</div>
                    <div className="text-[11px] text-gray-400">{b.master} · {b.time} · {b.service}</div>
                    <div className="text-[11px] text-gray-400">{b.clientPhone}</div>
                  </div>
                </div>
                <button
                  onClick={() => onRemind(b.id)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <Send size={12} /> Отправить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {reminded.length > 0 && (
        <div>
          <div className="text-[12px] font-medium text-gray-400 mb-2 uppercase tracking-wide">Напоминания отправлены</div>
          <div className="space-y-2">
            {reminded.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-gray-700">{b.clientName} · {b.time}</div>
                  <div className="text-[11px] text-gray-400">{b.master} · {b.service}</div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                  b.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {b.status === 'confirmed' ? 'Подтвердила' : b.status === 'cancelled' ? 'Отменила' : 'Ждём ответа'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
