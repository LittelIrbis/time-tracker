export function RecordsPlaceholder() {
  return (
    <div style={{
      background: 'var(--color-bg-panel)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '1.5rem',
      flex: 1
    }}>
      <h2 style={{ margin: '0 0 1rem 0', color: 'var(--color-accent)', fontSize: '1.2rem' }}>
        Записи
      </h2>
      <div style={{ color: 'var(--color-text-muted)' }}>Здесь будет лента задач</div>
    </div>
  );
}