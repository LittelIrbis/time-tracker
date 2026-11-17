import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../shared/api/tasks';
import { getDayLabel } from '../../shared/utils/time';
import { TaskRow } from './TaskRow';

export function RecordsList() {
  const { data: tasks = [], isLoading } = useQuery({ 
    queryKey: ['tasks'], 
    queryFn: getTasks 
  });

  if (isLoading) return <p style={{ padding: '1rem' }}>Загрузка...</p>;

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  );

  const grouped: Record<string, typeof sortedTasks> = {};
  for (const task of sortedTasks) {
    const label = getDayLabel(task.start);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(task);
  }

  return (
    <div style={{ 
      background: 'var(--color-bg-panel)', 
      border: '3px solid var(--color-accent-muted)', 
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      
      height: '100%',      
      minHeight: '200px',
      width: '100%',

    }}>
      {/* шапка */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0
      }}>
        <h2 style={{ margin: 0, color: 'var(--color-accent)', fontSize: '1.2rem' }}>
          Записи
        </h2>
      </div>

      {/* СПИСОК */}
      <div style={{ 
        overflowY: 'auto', 
        flex: 1,
        minHeight: 0,
        scrollbarColor: 'var(--color-border) transparent',
        scrollbarWidth: 'thin'
      }}>
        {sortedTasks.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>
            Пока нет записей. Начни первую активность!
          </p>
        ) : (
          <div>
            {Object.entries(grouped).map(([dayLabel, dayTasks]) => (
              <div key={dayLabel}>
                {/* Заголовок дня */}
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  background: 'var(--color-bg-input)', 
                  color: 'var(--color-text-muted)', 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--color-border)',
                  position: 'sticky', // Заголовок дня прилипает при скролле
                  top: 0,
                  zIndex: 1
                }}>
                  {dayLabel}
                </div>
                {/* Строки задач */}
                {dayTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}