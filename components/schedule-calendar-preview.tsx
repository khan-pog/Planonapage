"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { addDays, addWeeks, addMonths, isSameDay, parseISO } from "date-fns"

export interface ScheduleApiResponse {
  frequency: string
  dayOfWeek?: string | null
  time: string
  enabled: boolean
  sendDate?: string | null
  pmReminderDay?: string | null
  pmFinalReminderDays?: number | null
  pmStartWeeksBefore?: number | null
}

interface ScheduleCalendarPreviewProps {
  settings?: ScheduleApiResponse
}

const weekdayToNumber: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function getNextSendDate(base: Date, sendDateStr?: string | null) {
  // If explicit sendDate provided, roll it forward to next occurrence if already passed.
  if (sendDateStr) {
    let target = parseISO(sendDateStr)
    const now = new Date()
    if (target < now) {
      // Move to next month preserving day
      target = new Date(now.getFullYear(), now.getMonth() + 1, target.getDate())
    }
    return target
  }
  // Fallback: first day of next month
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

export default function ScheduleCalendarPreview({ settings }: ScheduleCalendarPreviewProps) {
  const [sendDate, setSendDate] = useState<Date | null>(null)
  const [sendDates, setSendDates] = useState<Date[]>([])
  const [reminderDates, setReminderDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function resolveSchedule() {
      try {
        let data: ScheduleApiResponse
        if (settings) {
          data = settings
        } else {
          const res = await fetch("/api/report-schedule")
          if (!res.ok) throw new Error("Failed to load schedule")
          data = await res.json()
        }

        const nextSend = getNextSendDate(new Date(), data.sendDate)
        const pmStartWeeksBefore = data.pmStartWeeksBefore ?? 2
        const pmFinalReminderDays = data.pmFinalReminderDays ?? 1
        const windowOpen = addWeeks(nextSend, -pmStartWeeksBefore)
        const windowClose = addDays(nextSend, -pmFinalReminderDays)

        let reminders: Date[] = []
        if (data.pmReminderDay) {
          const dow = data.pmReminderDay.toLowerCase()
          const start = new Date(windowOpen)
          // Adjust to first desired weekday >= start date
          const delta = (weekdayToNumber[dow] - start.getDay() + 7) % 7
          start.setDate(start.getDate() + delta)
          for (let d = new Date(start); d <= windowClose; d = addDays(d, 7)) {
            reminders.push(new Date(d))
          }
        }
        // Always ensure windowClose is included as final reminder
        if (!reminders.some((d) => isSameDay(d, windowClose))) {
          reminders.push(windowClose)
        }

        if (!ignore) {
          setSendDate(nextSend)
          setReminderDates(reminders)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!ignore) setLoading(false)
      }
    }

    resolveSchedule()
    return () => {
      ignore = true
    }
  }, [settings])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading calendar…</p>
  }

  if (!sendDate) {
    return <p className="text-sm text-muted-foreground">No schedule configured.</p>
  }

  return (
    <div className="space-y-2">
      <Calendar
        mode="single"
        defaultMonth={sendDate}
        selected={sendDate}
        modifiers={{
          reminder: reminderDates,
          send: [sendDate],
        }}
        modifiersClassNames={{
          send: "bg-green-600 text-green-50 hover:bg-green-600",
          reminder: "bg-yellow-300/50 text-yellow-900 hover:bg-yellow-300/60",
        }}
      />
      <div className="text-xs text-muted-foreground flex flex-col gap-1">
        <span>
          <span className="inline-block h-2 w-2 rounded-full bg-green-600 mr-2" /> Report Send Day
        </span>
        <span>
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-300 mr-2 border border-yellow-500" /> PM
          Reminder Day
        </span>
      </div>
    </div>
  )
} 