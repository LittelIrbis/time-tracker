import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../shared/api/tasks';
import { getDayLabel } from '../../shared/utils/time';

export function TasksToDo() {
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
          Задачи
        </h2>
      </div>

      
    </div>
  );
}