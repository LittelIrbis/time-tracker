import { TimerPanel } from '../features/timer/TimerPanel';
import { StatsPlaceholder } from '../features/stats/StatsPlaceholder';
import { RecordsList } from '../features/tasks/RecordsList';
import { TasksToDo } from '../features/tasks/TasksToDo';

export function DashboardPage() {
  return (
    // Главный контейнер на весь экран
    <div style={{ display: 'flex', height: '100vh', }}>

      <main
        style = {{
          flex: 1,
          padding: '2rem',
          display: 'grid',
          height: '100vh',
          gridTemplateColumns: '350px 1fr',
          gap: '2rem',
          //alignItems: 'start',
          overflow: 'hidden',
        }}
      >
        {/* left column -------------------------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* new activity */}
          <TimerPanel />

          <TasksToDo />
        </div>


        {/* right column -----------------*/}
        <div style={{ display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          height: '100%',       
          minHeight: 0,         
          overflow: 'hidden'
        }}>
          {/* Блок статистики */}
          <div style={{width: '100%', flexShrink: 0 }}>
            <StatsPlaceholder />
          </div>

          {/* Блок записей*/}
          <div style={{ flex: 1, minHeight: 0, width: '100%'  }}>
            <RecordsList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;