'use client';
import { useState } from 'react';
import Landing from './Landing';
import { ToastProvider } from './ui/Toast';
import Analyze from './sections/Analyze';
import Coverage from './sections/Coverage';
import Export from './sections/Export';

const TABS = [
  { id: 'analyze',  label: 'Analyze'  },
  { id: 'coverage', label: 'Coverage' },
  { id: 'export',   label: 'Export'   },
];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState('analyze');
  const [beat, setBeat] = useState(true);

  return (
    <ToastProvider>
      <div className="bg-grid" />
      {!entered && <Landing onEnter={() => setEntered(true)} />}
      {entered && (
        <div className="app-shell" style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
          {/* Header */}
          <header style={{
            height: 52, display: 'flex', alignItems: 'center',
            padding: '0 28px', gap: 20, flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px', marginRight: 4 }} className="gradient-text">
              RegMap AI
            </span>

            <div style={{ display: 'flex', gap: 2 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '5px 14px', borderRadius: 7,
                  fontSize: 13, fontFamily: 'Inter, sans-serif',
                  fontWeight: tab === t.id ? 600 : 400,
                  background: tab === t.id ? 'rgba(99,102,241,0.14)' : 'transparent',
                  border: `1px solid ${tab === t.id ? 'rgba(99,102,241,0.28)' : 'transparent'}`,
                  color: tab === t.id ? '#F1F5F9' : '#475569',
                  cursor: 'pointer', transition: 'all .15s',
                }}>{t.label}</button>
              ))}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#334155' }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#10B981', display: 'inline-block',
                boxShadow: '0 0 5px #10B981',
              }} />
              Typhoon OCR × Qwen3-32b
            </div>
          </header>

          <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
            {tab === 'analyze'  && <Analyze />}
            {tab === 'coverage' && <Coverage />}
            {tab === 'export'   && <Export />}
          </main>
        </div>
      )}
    </ToastProvider>
  );
}
