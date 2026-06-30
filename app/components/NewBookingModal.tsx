'use client'

import { useState } from 'react'
import { X, Bell } from 'lucide-react'
import { Booking, MASTERS, SERVICES, TIME_SLOTS } from '../lib/data'

interface Props {
  onClose: () => void
  onSave: (data: Omit<Booking, 'id' | 'status' | 'reminderSent'>) => void
  activeDate: string
}

export default function NewBookingModal({ onClose, onSave, activeDate }: Props) {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    service: SERVICES[0],
    master: MASTERS[0],
    date: activeDate,
    time: TIME_SLOTS[0],
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-[15px] font-semibold text-gray-900">Новая запись · {formatDate(activeDate)}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Имя клиентки</label>
            <input type="text" value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Айдана"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Телефон (WhatsApp)</label>
            <input type="text" value={form.clientPhone} onChange={e => set('clientPhone', e.target.value)} placeholder="+7 777 000 00 00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">Мастер</label>
              <select value={form.master} onChange={e => set('master', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-blue-400">
                {MASTERS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">Время</label>
              <select value={form.time} onChange={e => set('time', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-blue-400">
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Услуга</label>
            <select value={form.service} onChange={e => set('service', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-blue-400">
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-start gap-2.5 bg-blue-50 rounded-xl px-3.5 py-3">
            <Bell size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-blue-600 leading-relaxed">Напоминание отправится клиентке автоматически — за 24ч и за 2ч до записи.</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Отмена</button>
            <button onClick={() => form.clientName.trim() && onSave(form)}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium transition-colors">Записать</button>
          </div>
        </div>
      </div>
    </div>
  )
}
