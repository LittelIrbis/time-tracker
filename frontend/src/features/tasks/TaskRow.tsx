import type { Task } from '../../types/api';
import { formatTime } from '../../shared/utils/time';
import { LiveDuration } from '../timer/LiveDuration';

interface TaskRowProps {
  task: Task;
}

export function TaskRow(props: TaskRowProps) {
  const task = props.task;
  const isActive = task.end === null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #a0a0a0bc',
        gap: '1rem',
      }}
    >
      <span style={{ color: '#666666', fontSize: '0.9rem' }}>
        {formatTime(task.start)}
      </span>

      <span style={{ fontWeight: isActive ? 600 : 400 }}>
        {task.name}
        {isActive && (
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#327c46',
              marginLeft: '0.5rem',
            }}
            title="Идёт сейчас"
          />
        )}
      </span>

      <span style={{ fontVariantNumeric: 'tabular-nums', color: '#333' }}>
        <LiveDuration start={task.start} end={task.end} />
      </span>
    </div>
  );
}