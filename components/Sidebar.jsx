'use client';

const NAV = [
  { id: 'overview',     icon: '🏠', label: 'Overview',       desc: 'Platform overview' },
  { id: 'discovery',    icon: '📥', label: 'Discovery',       desc: 'Document vault & OCR' },
  { id: 'intelligence', icon: '🧠', label: 'Intelligence',    desc: 'AI regulatory mapping' },
  { id: 'coverage',     icon: '🗺️',  label: 'Coverage Map',   desc: 'ASEAN heatmap' },
  { id: 'dashboard',    icon: '📊', label: 'Dashboard',       desc: 'Analytics & scores' },
  { id: 'export',       icon: '📤', label: 'Export',          desc: 'RDTII-ready output' },
];

export default function Sidebar({ active, onNav }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: 'rgba(5,5,8,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', zIndex: 200,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🗺️</span>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px' }} className="gradient-text">
            RegMap AI
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: '#1E293B', marginTop: 4, fontWeight: 500, paddingLeft: 28 }}>
          RDTII Platform
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#1E293B', letterSpacing: '.12em', textTransform: 'uppercase', padding: '8px 10px 4px' }}>
          Modules
        </div>
        {NAV.map(item => {
          const a = active === item.id;
          return (
            <button key={item.id} className="nav-btn" onClick={() => onNav(item.id)} style={{
              color: a ? '#F1F5F9' : '#475569',
              fontWeight: a ? 600 : 400,
              fontSize: 13,
              background: a
                ? 'linear-gradient(135deg,rgba(99,102,241,.16),rgba(139,92,246,.1))'
                : 'transparent',
              borderLeft: `2px solid ${a ? '#6366F1' : 'transparent'}`,
              marginBottom: 1,
              padding: '8px 10px',
            }}>
              <span style={{ fontSize: 14, opacity: a ? 1 : 0.6 }}>{item.icon}</span>
              <div>
                <div>{item.label}</div>
                {a && (
                  <div style={{ fontSize: 10.5, color: '#6366F1', fontWeight: 400, marginTop: 1 }}>
                    {item.desc}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 10, color: '#1E293B', textAlign: 'center' }}>Built for ESCAP · v2.0</div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
          {['Typhoon OCR', 'Qwen3-32b'].map(t => (
            <span key={t} style={{
              padding: '2px 7px', borderRadius: 20,
              fontSize: 9.5, color: '#334155',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
