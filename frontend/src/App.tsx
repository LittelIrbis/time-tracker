import { Sidebar } from './features/navigation/Sidebar';
import { TimerPanel } from './features/timer/TimerPanel';
import { StatsPlaceholder } from './features/stats/StatsPlaceholder';
import { RecordsPlaceholder } from './features/tasks/RecordsPlaceholder';

function App() {
  return (
    // Главный контейнер на весь экран
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      <Sidebar />

      <main
        style = {{
          flex: 1,
          padding: '2rem',
          display: 'grid',
          
          gridTemplateColumns: '350px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* new activity */}
          <TimerPanel />

          {/* Блок "Задачи"*/}
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

        {/* right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Блок статистики */}
          <StatsPlaceholder />

          {/* Блок записей*/}
          <RecordsPlaceholder />
        </div>
      </main>
    </div>
  );
}

export default App;