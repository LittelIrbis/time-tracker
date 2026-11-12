import { Sidebar } from './features/navigation/Sidebar';
import { TimerPanel } from './features/timer/TimerPanel';
import { StatsPlaceholder } from './features/stats/StatsPlaceholder';
import { RecordsPlaceholder } from './features/tasks/RecordsPlaceholder';

function App() {
  return (
    // Главный контейнер на весь экран
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* 1. Сайтбар слева (заглушка) */}
      <Sidebar />

      {/* 2. Основная рабочая область */}
      <main
        style={{
          flex: 1, // занимает всё оставшееся место
          padding: '2rem',
          display: 'grid',
          // Две колонки: левая фиксированная 350px, правая - резиновая (1fr)
          gridTemplateColumns: '350px 1fr',
          gap: '2rem',
          alignItems: 'start', // чтобы карточки не растягивались по высоте
        }}
      >
        {/* ЛЕВАЯ КОЛОНКА */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Карточка "Новая активность" */}
          <TimerPanel />

          {/* Блок "Задачи" (пока заглушка, но потом сюда придет список) */}
          <div
            style={{
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              minHeight: '200px',
            }}
          >
            <h2
              style={{
                margin: '0 0 1rem 0',
                color: 'var(--color-accent)',
                fontSize: '1.2rem',
              }}
            >
              Задачи
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Список активных задач появится здесь.
            </p>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Блок статистики */}
          <StatsPlaceholder />

          {/* Блок записей (лента) */}
          <RecordsPlaceholder />
        </div>
      </main>
    </div>
  );
}

export default App;