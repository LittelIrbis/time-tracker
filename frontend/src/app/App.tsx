import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../features/navigation/Sidebar';
import { DashboardPage } from '../pages/DashboardPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { TasksPage } from '../pages/TasksPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { SettingsPage } from '../pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-main)' }}>
        
        {/* Сайтбар всегда слева */}
        <Sidebar />

        {/* Контент страницы (меняется при переходе) */}
        <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;