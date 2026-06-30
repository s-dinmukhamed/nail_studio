import { Redis } from '@upstash/redis'
import { Booking, BookingStatus } from './data'
 
const url =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  ''
const token =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  ''
 
const kv = new Redis({ url, token })
 
const KEY = 'bookings'
 
const SEED: Booking[] = [
  { id: 'b1', clientName: 'Сабина Алиева', clientPhone: '+7 701 234 56 78', service: 'Маникюр + гель', master: 'Алия', date: '2025-06-30', time: '09:00', status: 'confirmed', reminderSent: true },
  { id: 'b2', clientName: 'Мадина Касымова', clientPhone: '+7 702 345 67 89', service: 'Гель-лак', master: 'Алия', date: '2025-06-30', time: '11:00', status: 'pending', reminderSent: false },
  { id: 'b3', clientName: 'Аяна Беккова', clientPhone: '+7 705 456 78 90', service: 'Наращивание', master: 'Дина', date: '2025-06-30', time: '10:00', status: 'confirmed', reminderSent: true },
  { id: 'b4', clientName: 'Лейла Сейткали', clientPhone: '+7 707 567 89 01', service: 'Педикюр', master: 'Жанна', date: '2025-06-30', time: '11:00', status: 'pending', reminderSent: false },
  { id: 'b5', clientName: 'Карина Нурова', clientPhone: '+7 708 678 90 12', service: 'Дизайн ногтей', master: 'Алия', date: '2025-06-30', time: '13:00', status: 'confirmed', reminderSent: true },
  { id: 'b6', clientName: 'Жулдыз Тлеуова', clientPhone: '+7 700 789 01 23', service: 'Гель-лак', master: 'Дина', date: '2025-06-30', time: '14:00', status: 'pending', reminderSent: false },
  { id: 'b7', clientName: 'Назерке Оспанова', clientPhone: '+7 701 890 12 34', service: 'SPA-педикюр', master: 'Жанна', date: '2025-06-30', time: '15:00', status: 'noshow', reminderSent: true },
  { id: 'b8', clientName: 'Айгуль Серикова', clientPhone: '+7 702 111 22 33', service: 'Гель-лак', master: 'Алия', date: '2025-07-01', time: '10:00', status: 'pending', reminderSent: false },
  { id: 'b9', clientName: 'Дана Ахметова', clientPhone: '+7 705 222 33 44', service: 'Маникюр + гель', master: 'Дина', date: '2025-07-01', time: '12:00', status: 'confirmed', reminderSent: true },
  { id: 'b10', clientName: 'Зарина Муратова', clientPhone: '+7 707 333 44 55', service: 'Педикюр', master: 'Жанна', date: '2025-07-02', time: '11:00', status: 'pending', reminderSent: false },
  { id: 'b11', clientName: 'Камила Бекова', clientPhone: '+7 708 444 55 66', service: 'Наращивание', master: 'Дина', date: '2025-07-02', time: '14:00', status: 'confirmed', reminderSent: true },
  { id: 'b12', clientName: 'Малика Ержанова', clientPhone: '+7 700 555 66 77', service: 'SPA-педикюр', master: 'Жанна', date: '2025-07-03', time: '09:00', status: 'pending', reminderSent: false },
  { id: 'b13', clientName: 'Нурия Касенова', clientPhone: '+7 701 666 77 88', service: 'Гель-лак', master: 'Алия', date: '2025-07-04', time: '13:00', status: 'confirmed', reminderSent: true },
  { id: 'b14', clientName: 'Рания Сатпаева', clientPhone: '+7 702 777 88 99', service: 'Дизайн ногтей', master: 'Дина', date: '2025-07-05', time: '15:00', status: 'pending', reminderSent: false },
]
 
async function ensureSeeded() {
  const existing = await kv.get<Booking[]>(KEY)
  if (!existing || existing.length === 0) {
    await kv.set(KEY, SEED)
  }
}
 
export async function getAll(): Promise<Booking[]> {
  await ensureSeeded()
  return (await kv.get<Booking[]>(KEY)) ?? []
}
 
export async function getById(id: string): Promise<Booking | undefined> {
  const all = await getAll()
  return all.find(b => b.id === id)
}
 
export async function create(b: Booking): Promise<Booking> {
  const all = await getAll()
  all.push(b)
  await kv.set(KEY, all)
  return b
}
 
export async function updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const all = await getAll()
  const idx = all.findIndex(b => b.id === id)
  if (idx === -1) return null
  all[idx] = { ...all[idx], status }
  await kv.set(KEY, all)
  return all[idx]
}
 
export async function markReminderSent(id: string): Promise<Booking | null> {
  const all = await getAll()
  const idx = all.findIndex(b => b.id === id)
  if (idx === -1) return null
  all[idx] = { ...all[idx], reminderSent: true }
  await kv.set(KEY, all)
  return all[idx]
}