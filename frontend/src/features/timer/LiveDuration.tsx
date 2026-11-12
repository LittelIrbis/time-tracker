import { useEffect, useState } from 'react';
import { formatDuration } from '../../shared/utils/time';

interface LiveDurationProps {
  start: string;
  end: string | null;
}

// Длительность задачи
export function LiveDuration({ start, end }: LiveDurationProps) {
  const [, setTick] = useState(0);

  useEffect(() => {

    // задача завершена
    if (end !== null) {
      return; 
    }

    // Пересчет каждую секунду
    const interval = setInterval(() => {
      setTick((t) => t + 1); 
    }, 1000);

    // очистка при размонтировании
    return () => clearInterval(interval); 
  }, [end]);

  return <span>{formatDuration(start, end)}</span>;
}