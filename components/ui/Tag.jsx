export default function Tag({ children, color = '#6366F1', bg, border, size = 11 }) {
  return (
    <span style={{
      padding: '2px 9px', borderRadius: 20, fontSize: size, fontWeight: 600,
      color, background: bg || `${color}18`, border: `1px solid ${border || color + '30'}`,
      whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3,
    }}>
      {children}
    </span>
  );
}
