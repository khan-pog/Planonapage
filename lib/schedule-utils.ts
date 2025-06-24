import { getReportSchedule } from '@/lib/db';
import { addWeeks, addDays, format, nextDay, parseISO, startOfDay, setHours, setMinutes } from 'date-fns';

export type ResolvedSchedule = Awaited<ReturnType<typeof getReportSchedule>> & { nextSend: Date, windowOpen: Date, windowClose: Date };

export async function resolveReportSchedule(): Promise<ResolvedSchedule|null>{
  const sched = await getReportSchedule();
  if(!sched) return null;

  let sendDate: Date;
  if(sched.sendDate){
    sendDate = parseISO(sched.sendDate);
  } else {
    // compute based on frequency/dayOfWeek/time
    const [hour, minute] = sched.time.split(':').map(Number);
    const now = new Date();
    const todayAtTime = setMinutes(setHours(startOfDay(now), hour), minute);
    if(sched.frequency === 'daily'){
      sendDate = todayAtTime > now ? todayAtTime : addDays(todayAtTime,1);
    } else if(sched.frequency === 'weekly'){
      const targetDow = sched.dayOfWeek ?? 'monday';
      const targetDate = nextDay(now, toWeekdayNumber(targetDow));
      sendDate = setMinutes(setHours(startOfDay(targetDate), hour), minute);
    } else { // monthly
      const nextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);
      sendDate = setMinutes(setHours(startOfDay(nextMonth), hour), minute);
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