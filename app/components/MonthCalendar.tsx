'use client'

import { Booking } from '../lib/data'

interface Props {
  bookings: Booking[]
  onDayClick: (date: string) => void
  today: string
}

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

export default function MonthCalendar({ bookings, onDayClick, today }: Props) {
  // Show June + July 2025
  const months = [
    { year: 2025, month: 5 }, // June (0-indexed)
    { year: 2025, month: 6 }, // July
  ]

  const countForDate = (dateStr: string) => bookings.filter(b => b.date === dateStr).length
  const pendingForDate = (dateStr: string) => bookings.filter(b => b.date === dateStr && b.status === 'pending').length

  const getDays = (year: number, month: number) => {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    // Mon=0 offset
    const startOffset = (first.getDay() + 6) % 7
    const days: (number | null)[] = Array(startOffset).fill(null)
    for (let d = 1; d <= last.getDate(); d++) days.push(d)
    return days
  }

  return (
    <div className="space-y-6">
      {months.map(({ year, month }) => {
        const days = getDays(year, month)
        return (
          <div key={`${year}-${month}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <span className="text-[15px] font-semibold text-gray-900">{MONTHS[month]} {year}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-[11px] text-gray-400 text-center py-1 font-medium">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const count = countForDate(dateStr)
                  const pending = pendingForDate(dateStr)
                  const isToday = dateStr === today
                  const weekDay = (i % 7)
                  const isWeekend = weekDay === 5 || weekDay === 6

                  return (
                    <button
                      key={dateStr}
                      onClick={() => count > 0 && onDayClick(dateStr)}
                      className={`relative rounded-lg p-1.5 min-h-[56px] text-left transition-colors ${
                        count > 0 ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default'
                      } ${isToday ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
                    >
                      <div className={`text-[12px] font-medium mb-1 ${
                        isToday ? 'text-blue-600' :
                        isWeekend ? 'text-red-400' :
                        'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      {count > 0 && (
                        <div className="space-y-0.5">
                          <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded px-1 py-0.5 w-fit">
                            {count} зап.
                          </div>
                          {pending > 0 && (
                            <div className="text-[10px] font-semibold text-amber-600 bg-amber-50 rounded px-1 py-0.5 w-fit">
                              {pending} ждут
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
