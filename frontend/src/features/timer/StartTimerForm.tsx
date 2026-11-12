import { useState, useMemo, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, getTasks } from '../../api/tasks';

export function StartTimerForm() {

  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Список задач для подсказок (берётся из того же кеша, что и в App.tsx)
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  // Уникальные названия задач, отфильтрованные по введённому тексту
  const suggestions = useMemo(() => {
    const query = name.trim().toLowerCase();
    if (query.length < 1 || !tasks) return [];

    const uniqueNames = new Set<string>();
    for (const task of tasks) {
      if (task.name.toLowerCase().includes(query)) {
        uniqueNames.add(task.name);
      }
      if (uniqueNames.size >= 5) break; // не больше 5 подсказок
    }

    // Если единственная подсказка совпадает с введённым текстом — не показываем
    if (uniqueNames.size === 1 && uniqueNames.has(name.trim())) return [];

    return Array.from(uniqueNames);
  }, [name, tasks]);

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setName('');
      setShowSuggestions(false);
    },
  });

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    createMutation.mutate({
      name: trimmed,
      start: new Date().toISOString(),
      end: null,
    });
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  // Закрываем подсказки по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
      }}
    >
      <label style={{ fontSize: '0.9rem', color: '#666' }}>
        Новая активность
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (suggestions.length > 0 && showSuggestions) {
                // Enter при открытой выпадашке — выбирает первую подсказку
                handleSelectSuggestion(suggestions[0]);
              } else {
                handleStart();
              }
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          placeholder="Что делаешь?"
          disabled={createMutation.isPending}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: '1rem',
          }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              margin: '4px 0 0',
              padding: 0,
              listStyle: 'none',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              zIndex: 10,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onMouseDown={(e) => {
                  e.preventDefault(); // не даём инпуту потерять фокус
                  handleSelectSuggestion(suggestion);
                }}
                style={{
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#fff';
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleStart}
        disabled={createMutation.isPending || !name.trim()}
        style={{
          padding: '1rem',
          background: !name.trim() ? '#ccc' : '#e53935',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: '1.5rem',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
        }}
        title="Запустить таймер"
      >
        {createMutation.isPending ? '⏳' : '▶'}
      </button>

      {createMutation.isError && (
        <p style={{ color: '#e53935', fontSize: '0.9rem' }}>
          Не удалось создать задачу
        </p>
      )}
    </div>
  );
}