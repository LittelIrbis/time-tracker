import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, stopTask } from '../../shared/api/tasks';

export function TimerPanel() {
  const queryClient = useQueryClient();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });
  const recentTasks = Array.from(new Set(tasks.map(t => t.name))).slice(0, 5);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startMutation = useMutation({
    mutationFn: (name: string) => createTask({ name, start: new Date().toISOString(), end: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const stopMutation = useMutation({
    mutationFn: (id: number) => stopTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsRunning(false);       
      setActiveTaskId(null);     
      setSelectedTaskName(null); 
      setElapsedSeconds(0);      
    }
  });

  const handleStart = () => {
    if (!selectedTaskName) return;
    startMutation.mutate(selectedTaskName, {
      onSuccess: (createdTask) => {
        setIsRunning(true);
        setElapsedSeconds(0);
        setActiveTaskId(createdTask.id);
      }
    });
  };

  const handleStop = () => {
    if (activeTaskId !== null) {
      stopMutation.mutate(activeTaskId);
    }
  };

  const handleReset = () => {
    if (isRunning) return;
    setSelectedTaskName(null);
    setElapsedSeconds(0);
  };

  // Определяем состояние (1, 2 или 3)
  const state = isRunning ? 3 : (selectedTaskName ? 2 : 1);

  // Выбираем переменные цвета в зависимости от состояния
  let cardBgVar, inputBgVar;
  if (state === 3) {
    cardBgVar = 'var(--timer-bg-running)';
    inputBgVar = 'var(--timer-input-bg-running)';
  } else if (state === 2) {
    cardBgVar = 'var(--timer-bg-selected)';
    inputBgVar = 'var(--timer-input-bg-selected)';
  } else {
    cardBgVar = 'var(--timer-bg-idle)';
    inputBgVar = 'var(--timer-input-bg-idle)';
  }

  return (
    <div style={{
      background: cardBgVar,
      border: '3px solid var(--color-accent-muted)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      transition: 'background 0.3s ease',
      width: '100%',
      aspectRatio: '1 / 1',
      boxSizing: 'border-box',
    }}>
      
      {/* ШАПКА КАРТОЧКИ */}
      <div 
        onClick={() => {
          if (isRunning) return;
          if (selectedTaskName) {
            handleReset();
          } else {
            setIsDropdownOpen(!isDropdownOpen);
          }
        }}
        style={{
          background: inputBgVar,
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '0.75rem',
          cursor: isRunning ? 'default' : 'pointer',
          color: selectedTaskName ? 'var(--color-text-main)' : 'var(--color-text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedTaskName && (
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent)' }} />
          )}
          <span>{selectedTaskName || 'Новая задача'}</span>
        </div>
        
        {!isRunning && (
          <span>{selectedTaskName ? '✕' : '▼'}</span>
        )}
      </div>

      {/* ВЫПАДАЮЩИЙ СПИСОК */}
      {isDropdownOpen && !isRunning && !selectedTaskName && (
        <div style={{
          position: 'absolute',
          top: '4.2rem', left: '1.5rem', right: '1.5rem',
          background: 'var(--color-bg-input)', // Оставляем базовый темный фон для списка
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          zIndex: 10,
          overflow: 'hidden'
        }}>
          {recentTasks.length === 0 && (
            <div style={{ padding: '0.5rem 1rem', color: 'var(--color-text-muted)' }}>
              Нет недавних задач
            </div>
          )}
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

      {/* ТАЙМЕР */}
      {(state === 2 || state === 3) && (
        <div style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'var(--color-text-main)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '2px',
          margin: '1rem 0'
        }}>
          {formatTime(elapsedSeconds)}
        </div>
      )}

      {/* КНОПКИ УПРАВЛЕНИЯ */}
      <div style={{ 
        flex: 1,                 // Занимает всё оставшееся место по центру
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        paddingBottom: '0.5rem' 
      }}>
        {/*состояние 1*/}
        {state === 1 && <div />}

        {/* Кнопка Старт (состояние 2) */}
        {state === 2 && (
          <button
            onClick={handleStart}
            disabled={startMutation.isPending}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--color-accent)', border: 'none',
              cursor: 'pointer', color: '#fff', fontSize: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {startMutation.isPending ? '⏳' : '▶'}
          </button>
        )}

        {/* Кнопка Стоп (состояние 3) */}
        {state === 3 && (
          <button
            onClick={handleStop}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--color-accent-blue)',
              border: 'none',
              cursor: 'pointer', color: '#fff', fontSize: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ⏹
          </button>
        )}
      </div>
    </div>
  );
}