import { NextResponse } from 'next/server'
import { getAll, create } from '@/app/lib/store'
import { Booking } from '@/app/lib/data'

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(req: Request) {
  const body = await req.json()
  const booking: Booking = {
    id: `b${Date.now()}`,
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    service: body.service,
    master: body.master,
    date: body.date,
    time: body.time,
    status: 'pending',
    reminderSent: false,
  }
  create(booking)
  return NextResponse.json(booking, { status: 201 })
}
