import { NavLink } from 'react-router-dom';

export function Sidebar() {
  // Стили для ссылок
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'block',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
    background: isActive ? 'var(--color-accent-muted)' : 'transparent',
    transition: 'background 0.2s, color 0.2s',
    fontWeight: isActive ? 600 : 400,
  });

  return (
    <aside style={{
      width: '240px',
      background: 'var(--color-bg-panel)',
      borderRight: '1px solid var(--color-border)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      flexShrink: 0,
    }}>
      <h1 style={{ color: 'var(--color-accent)', fontSize: '1.5rem', margin: '0 0 1rem 0' }}>
        Time Tracker
      </h1>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" style={linkStyle}>
          Главная
        </NavLink>
        <NavLink to="/statistics" style={linkStyle}>
          Статистика
        </NavLink>
        <NavLink to="/tasks" style={linkStyle}>
          Задачи
        </NavLink>
        <NavLink to="/projects" style={linkStyle}>
          Проекты
        </NavLink>
        <NavLink to="/settings" style={linkStyle}>
          Настройки
        </NavLink>
      </nav>
    </aside>
  );
}