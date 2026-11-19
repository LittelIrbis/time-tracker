import type { Task } from '../../shared/types/api';
import { formatTime } from '../../shared/utils/time';
import { LiveDuration } from '../timer/LiveDuration';

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const isActive = task.end === null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--color-border)',
        gap: '1rem',
        fontSize: '0.95rem',
      }}
    >
      {/* Время начала */}
      <span style={{ color: 'var(--color-text-muted)' }}>
        {formatTime(task.start)}
      </span>

      {/* Название задачи */}
      <span style={{ fontWeight: isActive ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Кружочек проекта (фиолетовый) */}
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
        {task.name}
      </span>

      {/* Длительность */}
      <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-main)' }}>
        <LiveDuration start={task.start} end={task.end} />
      </span>
    </div>
  );
}