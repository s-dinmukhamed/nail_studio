'use client'

import { X, Send, UserX, Trash2, CheckCircle } from 'lucide-react'
import { Booking, STATUS_LABELS, STATUS_COLORS, MASTERS } from '../lib/data'

interface Props {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  onRemind: (id: string) => void
}

export default function BookingDetail({ booking, onClose, onStatusChange, onRemind }: Props) {
  const confirmLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/confirm/${booking.id}`

  return (
    <div className="w-72 shrink-0 bg-white border-l border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <span className="text-[13px] font-medium text-gray-800">Детали записи</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Client info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[14px] font-semibold text-blue-600">
            {booking.clientName.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-[14px] font-medium text-gray-900">{booking.clientName}</div>
            <div className="text-[12px] text-gray-400">{booking.clientPhone}</div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
          {[
            { label: 'Услуга', value: booking.service },
            { label: 'Мастер', value: booking.master },
            { label: 'Время', value: `${booking.time} · 30 июня` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[12px] text-gray-400">{label}</span>
              <span className="text-[13px] font-medium text-gray-800">{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-400">Статус</span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${STATUS_COLORS[booking.status]}`}>
              {STATUS_LABELS[booking.status]}
            </span>
          </div>
        </div>

        {/* Reminder link */}
        <div className="bg-blue-50 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-blue-700 mb-1.5">Ссылка для клиентки</div>
          <div className="text-[11px] text-blue-500 break-all font-mono">{confirmLink}</div>
          <button
            onClick={() => navigator.clipboard?.writeText(confirmLink)}
            className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
          >
            Скопировать →
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!booking.reminderSent && (
            <button
              onClick={() => onRemind(booking.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Send size={14} className="text-gray-400" />
              Отправить напоминание
            </button>
          )}
          {booking.reminderSent && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 text-[13px] text-emerald-700">
              <CheckCircle size={14} />
              Напоминание отправлено
            </div>
          )}
          <button
            onClick={() => onStatusChange(booking.id, 'noshow')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <UserX size={14} className="text-gray-400" />
            Отметить неявку
          </button>
          <button
            onClick={() => onStatusChange(booking.id, 'cancelled')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-100 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Отменить запись
          </button>
        </div>
      </div>
    </div>
  )
}
