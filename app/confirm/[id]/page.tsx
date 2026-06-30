'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { Booking, STATUS_LABELS } from '../../lib/data'

type State = 'loading' | 'ready' | 'confirming' | 'confirmed' | 'cancelled' | 'already' | 'error'

export default function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [state, setState] = useState<State>('loading')
  const [bookingId, setBookingId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => {
      setBookingId(id)
      fetch(`/api/bookings/${id}`)
        .then(r => r.json())
        .then(data => {
          setBooking(data)
          if (data.status === 'confirmed' || data.status === 'cancelled') {
            setState('already')
          } else {
            setState('ready')
          }
        })
        .catch(() => setState('error'))
    })
  }, [params])

  const respond = async (action: 'confirmed' | 'cancelled') => {
    setState('confirming')
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    })
    setState(action)
  }

  const formatDate = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`)
    return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }) + ' в ' + time
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Studio header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-3 text-lg">
            💅
          </div>
          <div className="text-[15px] font-semibold text-gray-900">Студия Айгерим</div>
          <div className="text-[12px] text-gray-400">Алматы · Маникюр и педикюр</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          {state === 'loading' && (
            <div className="p-8 flex flex-col items-center gap-3">
              <Loader2 size={24} className="text-gray-300 animate-spin" />
              <span className="text-[13px] text-gray-400">Загружаем запись...</span>
            </div>
          )}

          {state === 'error' && (
            <div className="p-8 text-center">
              <div className="text-2xl mb-3">🤔</div>
              <div className="text-[14px] font-medium text-gray-800 mb-1">Запись не найдена</div>
              <div className="text-[13px] text-gray-400">Возможно, ссылка устарела. Напишите нам напрямую.</div>
            </div>
          )}

          {(state === 'ready' || state === 'confirming') && booking && (
            <>
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-[13px] text-gray-500 mb-1">Напоминание о записи</div>
                <div className="text-[15px] font-semibold text-gray-900">{booking.clientName}</div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[13px] font-medium text-gray-800">
                      {formatDate(booking.date, booking.time)}
                    </div>
                    <div className="text-[12px] text-gray-400 mt-0.5">
                      {booking.service} · мастер {booking.master}
                    </div>
                  </div>
                </div>

                <p className="text-[13px] text-gray-600 leading-relaxed px-0.5">
                  Вы придёте на запись? Ответьте, пожалуйста — если не получится, мы успеем предложить ваш слот другой клиентке.
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    disabled={state === 'confirming'}
                    onClick={() => respond('cancelled')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                  >
                    Не приду
                  </button>
                  <button
                    disabled={state === 'confirming'}
                    onClick={() => respond('confirmed')}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-[14px] font-semibold transition-colors"
                  >
                    {state === 'confirming' ? '...' : 'Приду ✓'}
                  </button>
                </div>
              </div>
            </>
          )}

          {state === 'confirmed' && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">Отлично, ждём вас!</div>
                <div className="text-[13px] text-gray-500">
                  {booking && `${booking.time} · ${booking.service} · мастер ${booking.master}`}
                </div>
              </div>
              <div className="text-[12px] text-gray-400 mt-2">
                Если планы изменятся — напишите нам заранее 🙏
              </div>
            </div>
          )}

          {state === 'cancelled' && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <XCircle size={28} className="text-gray-400" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">Поняли, хорошо</div>
                <div className="text-[13px] text-gray-500">Запись отменена. Ждём вас в следующий раз!</div>
              </div>
            </div>
          )}

          {state === 'already' && booking && (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle size={28} className="text-blue-400" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">
                  {booking.status === 'confirmed' ? 'Запись уже подтверждена' : 'Запись отменена'}
                </div>
                <div className="text-[13px] text-gray-500">
                  {booking.time} · {booking.service}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-[11px] text-gray-400">
          Студия Айгерим · WhatsApp +7 700 000 00 00
        </div>
      </div>
    </div>
  )
}
