import { format, differenceInSeconds, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';


//Форматирует ISO-дату в читаемый вид
export function formatTime(isoString: string): string {
  const date = new Date(isoString);

  if (isToday(date)) {
    return format(date, 'HH:mm', { locale: ru });
  }

  return format(date, 'dd MMM, HH:mm', { locale: ru });
}


// Длительность между start и end/now
export function formatDuration(startIso: string, endIso: string | null): string {

  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();

  const totalSeconds = Math.max(0, differenceInSeconds(end, start));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}


// Заголовок для группировки по дням: "Сегодня", "Вчера" или "05 ноября".
export function getDayLabel(isoString: string): string {
  const date = new Date(isoString);
  
  if (isToday(date)) {
    return 'Сегодня';
  }

  if (isYesterday(date)){
    return 'Вчера';
  } 

  return format(date, 'dd MMMM', { locale: ru });
}

// Суммарное время за сегодня
export function getTodayTotalSeconds(tasks: { start: string; end: string | null }[]): number {
  const now = new Date();
  let total = 0;

  for (const task of tasks) {

    const start = new Date(task.start);

    if (!isToday(start)) {
      continue;
    }
    const end = task.end ? new Date(task.end) : now;
    total += Math.max(0, differenceInSeconds(end, start));
  }

  return total;
}

// Cекунды в строку
export function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  return `${minutes}м`;
}