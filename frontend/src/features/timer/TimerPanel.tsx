import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask } from '../../shared/api/tasks'; // Убедись, что путь правильный!
import { formatDuration } from '../../shared/utils/time';

export function TimerPanel() {
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState<string | null>(null);
  
  // Загружаем все задачи (пока без фильтрации по проектам)
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });

  // Берем последние 5 уникальных задач
  const recentTasks = Array.from(new Set(tasks.map(t => t.name))).slice(0, 5);

  // Мутация для создания новой задачи (старта таймера)
  const startMutation = useMutation({
    mutationFn: (name: string) => createTask({ name, start: new Date().toISOString(), end: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setSelectedTaskName(null); // Сбрасываем выбор после старта
    }
  });

  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-accent-muted)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative'
    }}>
      {/* Поле выбора задачи (выглядит как инпут, но это кнопка) */}
      <div 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          background: 'var(--color-bg-input)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '0.75rem',
          cursor: 'pointer',
          color: selectedTaskName ? 'var(--color-text-main)' : 'var(--color-text-muted)'
        }}
      >
        {selectedTaskName || '● task_name'}
      </div>

      {/* Выпадающий список */}
      {isDropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '4rem', left: '1.5rem', right: '1.5rem',
          background: 'var(--color-bg-input)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          zIndex: 10,
          overflow: 'hidden'
        }}>
          {recentTasks.map(taskName => (
            <div 
              key={taskName}
              onClick={() => {
                setSelectedTaskName(taskName);
                setIsDropdownOpen(false);
              }}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}
            >
              {taskName}
            </div>
          ))}
          <div 
            onClick={() => {
              const newName = prompt('Введите название новой задачи:');
              if (newName) {
                setSelectedTaskName(newName);
              }
              setIsDropdownOpen(false);
            }}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--color-accent)' }}
          >
            + Новая задача
          </div>
        </div>
      )}

      {/* Кнопка Старт */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
        <button
          disabled={!selectedTaskName || startMutation.isPending}
          onClick={() => selectedTaskName && startMutation.mutate(selectedTaskName)}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%', // Круглая кнопка как в макете
            background: selectedTaskName ? 'var(--color-accent)' : 'var(--color-bg-input)',
            border: 'none',
            cursor: selectedTaskName ? 'pointer' : 'default',
            color: '#fff',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
        >
          {startMutation.isPending ? '⏳' : '▶'}
        </button>
      </div>
    </div>
  );
}