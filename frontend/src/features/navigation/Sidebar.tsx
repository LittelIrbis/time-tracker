export function Sidebar() {
  return (
    <aside style={{
      width: '240px',
      background: 'var(--color-bg-panel)',
      borderRight: '1px solid var(--color-border)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1 style={{ color: 'var(--color-accent)', fontSize: '1.5rem', margin: 0 }}>
        Time Tracker
      </h1>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Навигация появится позже
      </div>
    </aside>
  );
}