'use client'

import { useEffect, useState } from 'react'
import { Bell, Plus, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Booking, MASTERS, TIME_SLOTS, STATUS_LABELS, STATUS_COLORS, CARD_COLORS } from './lib/data'
import NewBookingModal from './components/NewBookingModal'
import BookingDetail from './components/BookingDetail'
import RemindersPanel from './components/RemindersPanel'
import MastersPanel from './components/MastersPanel'
import MonthCalendar from './components/MonthCalendar'

type Tab = 'schedule' | 'calendar' | 'reminders' | 'masters'

const TODAY = '2025-06-30'

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selected, setSelected] = useState<Booking | null>(null)
  const [tab, setTab] = useState<Tab>('schedule')
  const [showModal, setShowModal] = useState(false)
  const [activeDate, setActiveDate] = useState(TODAY)

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings')
    const data = await res.json()
    setBookings(data)
  }

  useEffect(() => { fetchBookings() }, [])

  const dayBookings = bookings.filter(b => b.date === activeDate)
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const confirmedCount = dayBookings.filter(b => b.status === 'confirmed').length

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchBookings()
    setSelected(prev => prev?.id === id ? null : prev)
  }

  const handleRemind = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remind' }),
    })
    await fetchBookings()
  }

  const handleNewBooking = async (data: Omit<Booking, 'id' | 'status' | 'reminderSent'>) => {
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, date: activeDate }),
    })
    await fetchBookings()
    setShowModal(false)
  }

  const getSlotBooking = (time: string, master: string) =>
    dayBookings.find(b => b.time === time && b.master === master)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const shiftDate = (delta: number) => {
    const d = new Date(activeDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setActiveDate(d.toISOString().slice(0, 10))
    setSelected(null)
  }

  const goToDate = (date: string) => {
    setActiveDate(date)
    setTab('schedule')
    setSelected(null)
  }

  return (
    <div className="flex h-screen bg-[#f5f4f1] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col py-5">
        <div className="px-5 pb-4 border-b border-gray-100 mb-3">
          <div className="text-[15px] font-semibold text-gray-900">Студия Айгерим</div>
          <div className="text-[11px] text-gray-400 mt-0.5">3 мастера · Алматы</div>
        </div>
        {([
          { id: 'schedule', label: 'Расписание', icon: Bell, badge: 0 },
          { id: 'calendar', label: 'Календарь', icon: Calendar, badge: 0 },
          { id: 'reminders', label: 'Напоминания', icon: Bell, badge: pendingCount },
          { id: 'masters', label: 'Мастера', icon: Users, badge: 0 },
        ] as const).map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2.5 px-5 py-2 text-sm transition-colors text-left ${
              tab === id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            {label}
            {badge > 0 && (
              <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
        <div className="mt-auto px-5 pt-4 border-t border-gray-100">
          <div className="text-[11px] text-gray-400">Сегодня: {formatDate(TODAY)}</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100">
          <div>
            <div className="text-[15px] font-semibold text-gray-900 capitalize">
              {tab === 'schedule' && formatDate(activeDate)}
              {tab === 'calendar' && 'Июль 2025'}
              {tab === 'reminders' && 'Напоминания'}
              {tab === 'masters' && 'Мастера'}
            </div>
            {tab === 'schedule' && (
              <div className="flex items-center gap-2 mt-0.5">
                <button onClick={() => shiftDate(-1)} className="text-gray-400 hover:text-gray-600">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[12px] text-gray-400">{dayBookings.length} записей · {confirmedCount} подтвердили</span>
                <button onClick={() => shiftDate(1)} className="text-gray-400 hover:text-gray-600">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
          {tab === 'schedule' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
            >
              <Plus size={15} /> Новая запись
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'schedule' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Записей', value: dayBookings.length, sub: 'на этот день', color: 'text-gray-900' },
                  { label: 'Ожидают ответа', value: dayBookings.filter(b => b.status === 'pending').length, sub: 'не подтвердили', color: 'text-amber-600' },
                  { label: 'Подтвердили', value: confirmedCount, sub: 'придут точно', color: 'text-emerald-600' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="text-[11px] text-gray-400 mb-1">{label}</div>
                    <div className={`text-2xl font-semibold ${color}`}>{value}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="grid" style={{ gridTemplateColumns: '64px repeat(3, 1fr)' }}>
                  <div className="px-3 py-3 text-[11px] text-gray-400 border-b border-gray-100" />
                  {MASTERS.map(m => (
                    <div key={m} className="px-4 py-3 border-b border-l border-gray-100">
                      <div className="text-[13px] font-medium text-gray-800">{m}</div>
                    </div>
                  ))}
                  {TIME_SLOTS.map(time => (
                    <>
                      <div key={`t-${time}`} className="px-3 flex items-start pt-3 text-[11px] text-gray-400 border-b border-gray-100 h-[72px]">
                        {time}
                      </div>
                      {MASTERS.map(master => {
                        const booking = getSlotBooking(time, master)
                        return (
                          <div key={`${time}-${master}`} className="border-b border-l border-gray-100 h-[72px] p-1.5 relative">
                            {booking ? (
                              <button
                                onClick={() => setSelected(booking)}
                                className={`absolute inset-1.5 rounded-lg border-l-[3px] px-2.5 py-1.5 text-left transition-opacity hover:opacity-75 ${CARD_COLORS[booking.status]}`}
                              >
                                <div className="text-[12px] font-medium text-gray-800 truncate">{booking.clientName}</div>
                                <div className="text-[11px] text-gray-500 truncate">{booking.service}</div>
                                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border mt-0.5 ${STATUS_COLORS[booking.status]}`}>
                                  {STATUS_LABELS[booking.status]}
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setShowModal(true)}
                                className="absolute inset-1.5 rounded-lg flex items-center justify-center text-gray-200 hover:text-gray-400 hover:bg-gray-50 transition-colors text-xl"
                              >
                                +
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'calendar' && (
            <MonthCalendar bookings={bookings} onDayClick={goToDate} today={TODAY} />
          )}

          {tab === 'reminders' && (
            <RemindersPanel bookings={bookings} onRemind={handleRemind} onRefresh={fetchBookings} />
          )}

          {tab === 'masters' && (
            <MastersPanel bookings={bookings} />
          )}
        </div>
      </main>

      {selected && (
        <BookingDetail
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onRemind={handleRemind}
        />
      )}

      {showModal && (
        <NewBookingModal onClose={() => setShowModal(false)} onSave={handleNewBooking} activeDate={activeDate} />
      )}
    </div>
  )
}
