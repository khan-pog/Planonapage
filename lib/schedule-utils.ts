import { getReportSchedule } from '@/lib/db';
import { addWeeks, addDays, format, nextDay, parseISO, startOfDay, setHours, setMinutes } from 'date-fns';

export type ResolvedSchedule = Awaited<ReturnType<typeof getReportSchedule>> & { nextSend: Date, windowOpen: Date, windowClose: Date };

export async function resolveReportSchedule(): Promise<ResolvedSchedule|null>{
  const sched = await getReportSchedule();
  if(!sched) return null;

  let sendDate: Date;
  const [hour, minute] = sched.time.split(':').map(Number);
  const now = new Date();

  if(sched.frequency === 'monthly'){
    // Use the day component from sendDate (if provided) or default to 1
    const dayOfMonth = sched.sendDate ? parseISO(sched.sendDate).getDate() : 1;

    const candidateThisMonth = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    sendDate = setMinutes(setHours(startOfDay(candidateThisMonth), hour), minute);

    // If we've already passed the target day/time this month, roll to next month
    if(sendDate <= now){
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth()+1, dayOfMonth);
      // Clamp for short months
      if(nextMonthDate.getDate() !== dayOfMonth){
        const lastDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth()+1, 0).getDate();
        nextMonthDate.setDate(lastDay);
      }
      sendDate = setMinutes(setHours(startOfDay(nextMonthDate), hour), minute);
    }
  } else if(sched.sendDate){
    // One-off explicit date
    sendDate = parseISO(sched.sendDate);
  } else {
    // Compute based on frequency + day/time
    const todayAtTime = setMinutes(setHours(startOfDay(now), hour), minute);
    if(sched.frequency === 'daily'){
      sendDate = todayAtTime > now ? todayAtTime : addDays(todayAtTime,1);
    } else { // weekly
      const targetDow = sched.dayOfWeek ?? 'monday';
      const targetDate = nextDay(now, toWeekdayNumber(targetDow));
      sendDate = setMinutes(setHours(startOfDay(targetDate), hour), minute);
    }
  }

  const weeksBefore = sched.pmStartWeeksBefore ?? 2;
  const windowOpen = addWeeks(sendDate, -weeksBefore);
  const daysBefore = sched.pmFinalReminderDays ?? 1;
  const windowClose = addDays(sendDate, -daysBefore);
  return {...sched, nextSend: sendDate, windowOpen, windowClose};
}

function toWeekdayNumber(dow:string):number{
  const map:Record<string, number> = {monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0};
  return map[dow.toLowerCase()];
} 