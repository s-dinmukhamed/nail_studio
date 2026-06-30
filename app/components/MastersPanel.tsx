'use client'

import { Booking, MASTERS } from '../lib/data'

interface Props {
  bookings: Booking[]
}

export default function MastersPanel({ bookings }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {MASTERS.map(master => {
        const mb = bookings.filter(b => b.master === master && b.date === '2025-06-30')
        const confirmed = mb.filter(b => b.status === 'confirmed').length
        const pending = mb.filter(b => b.status === 'pending').length
        const noshow = mb.filter(b => b.status === 'noshow').length

        return (
          <div key={master} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[14px] font-semibold text-blue-600">
                {master.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-gray-900">{master}</div>
                <div className="text-[11px] text-gray-400">Мастер маникюра</div>
              </div>
            </div>

            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Записей</span>
                <span className="font-medium text-gray-900">{mb.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Подтвердили</span>
                <span className="font-medium text-emerald-600">{confirmed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ожидают</span>
                <span className="font-medium text-amber-600">{pending}</span>
              </div>
              {noshow > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Не пришли</span>
                  <span className="font-medium text-red-500">{noshow}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-[11px] text-gray-400 mb-1.5">Загрузка</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${Math.min(100, (mb.length / 9) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
