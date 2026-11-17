export function StatsPlaceholder() {
  return (

    <div style={{
      background: 'var(--color-bg-panel)',
      border: '3px solid var(--color-accent-muted)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      
      minHeight: '400px'
    }}>
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0
      }}>
        <h2 style = {{
          margin: 0, color: 'var(--color-accent)', fontSize: '1.2rem'}}>
            Статистика
        </h2>
      </div>

      <div style = {{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '1.5rem'
      }}>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          Здесь будет график
        </p>
      </div>

    </div>
  );
}