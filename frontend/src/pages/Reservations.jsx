import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createReservation } from '../api/client'
import './Reservations.css'

const RESTAURANT_TZ = 'America/New_York'

function getCalendarDateInTimeZone(date, timeZone) {
  const [year, month, day] = date.toLocaleDateString('en-CA', { timeZone }).split('-').map(Number)
  return { year, month, day }
}

function addCalendarDays(year, month, day, days) {
  const next = new Date(Date.UTC(year, month - 1, day + days))
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  }
}

function getDayOfWeekInTimeZone(year, month, day, timeZone) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
  }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)))

  return {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }[weekday]
}

function getOffsetMinutes(timeZone, date) {
  const timeZoneName = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value

  const match = timeZoneName?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) {
    return 0
  }

  const sign = match[1] === '+' ? 1 : -1
  const hours = Number(match[2])
  const minutes = Number(match[3] ?? 0)
  return sign * (hours * 60 + minutes)
}

function wallTimeToDate(year, month, day, hours, minutes, timeZone) {
  const asUtc = Date.UTC(year, month - 1, day, hours, minutes, 0)
  let offset = getOffsetMinutes(timeZone, new Date(asUtc))
  let utcMs = asUtc - offset * 60 * 1000

  const refinedOffset = getOffsetMinutes(timeZone, new Date(utcMs))
  if (refinedOffset !== offset) {
    offset = refinedOffset
    utcMs = asUtc - offset * 60 * 1000
  }

  return new Date(utcMs)
}

function formatSlotValue(year, month, day, hours, minutes) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`
}

function formatSlotLabel(year, month, day, hours, minutes) {
  return wallTimeToDate(year, month, day, hours, minutes, RESTAURANT_TZ).toLocaleString('en-US', {
    timeZone: RESTAURANT_TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getReservationSlots() {
  const slots = []
  const tomorrow = getCalendarDateInTimeZone(new Date(), RESTAURANT_TZ)
  const start = addCalendarDays(tomorrow.year, tomorrow.month, tomorrow.day, 1)

  for (let day = 0; day < 14; day += 1) {
    const currentDay = addCalendarDays(start.year, start.month, start.day, day)
    const dayOfWeek = getDayOfWeekInTimeZone(
      currentDay.year,
      currentDay.month,
      currentDay.day,
      RESTAURANT_TZ,
    )
    const times = dayOfWeek === 0 ? ['17:00', '18:30', '20:00'] : ['17:00', '18:00', '19:00', '20:00', '21:00']

    times.forEach((time) => {
      const [hours, minutes] = time.split(':').map(Number)
      slots.push({
        value: formatSlotValue(currentDay.year, currentDay.month, currentDay.day, hours, minutes),
        label: formatSlotLabel(currentDay.year, currentDay.month, currentDay.day, hours, minutes),
      })
    })
  }

  return slots
}

const initialForm = {
  time_slot: '',
  number_of_guests: '2',
  customer_name: '',
  email_address: '',
  phone_number: '',
}

function Reservations() {
  const slots = useMemo(() => getReservationSlots(), [])
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setLoading(true)

    try {
      const result = await createReservation({
        ...form,
        number_of_guests: Number(form.number_of_guests),
      })
      setStatus({
        type: 'success',
        message: `${result.message} Table ${result.table_number} has been assigned.`,
      })
      setForm(initialForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page reservations-page container">
      <header className="page-header">
        <p className="eyebrow">Book Your Evening</p>
        <h1>Reservations</h1>
        <p>Select a time, share your details, and we will confirm your table.</p>
      </header>

      <form className="reservation-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Time Slot
            <select
              name="time_slot"
              value={form.time_slot}
              onChange={handleChange}
              required
            >
              <option value="">Select date and time</option>
              {slots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Number of Guests
            <input
              type="number"
              name="number_of_guests"
              min="1"
              max="12"
              value={form.number_of_guests}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Customer Name
            <input
              type="text"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email_address"
              value={form.email_address}
              onChange={handleChange}
              required
            />
          </label>

          <label className="full-width">
            Phone Number <span className="optional">(optional)</span>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
            />
          </label>
        </div>

        <Button type="submit" variant="outline" size="lg" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Booking…' : 'Book Reservation'}
        </Button>
        {status.message && (
          <p className={`form-message ${status.type}`} role="status">
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
}

export default Reservations
