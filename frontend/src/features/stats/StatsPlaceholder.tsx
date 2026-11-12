export function StatsPlaceholder() {
  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-accent-muted)',
      borderRadius: '12px',
      padding: '1.5rem',
      minHeight: '250px'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', color: 'var(--color-accent)', fontSize: '1.2rem' }}>
        Статистика
      </h2>
      <div style={{ color: 'var(--color-text-muted)' }}>Здесь будет график</div>
    </div>
  );
}