export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'noshow'

export interface Booking {
  id: string
  clientName: string
  clientPhone: string
  service: string
  master: string
  date: string
  time: string
  status: BookingStatus
  reminderSent: boolean
}

export const MASTERS = ['Алия', 'Дина', 'Жанна']

export const SERVICES = [
  'Гель-лак',
  'Маникюр + гель',
  'Наращивание',
  'Дизайн ногтей',
  'Педикюр',
  'SPA-педикюр',
]

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Придёт',
  cancelled: 'Отменила',
  noshow: 'Не пришла',
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  noshow: 'bg-gray-100 text-gray-500 border-gray-200',
}

export const CARD_COLORS: Record<BookingStatus, string> = {
  pending: 'border-l-amber-400 bg-amber-50/60',
  confirmed: 'border-l-emerald-400 bg-emerald-50/60',
  cancelled: 'border-l-red-300 bg-red-50/40',
  noshow: 'border-l-gray-300 bg-gray-50',
}
