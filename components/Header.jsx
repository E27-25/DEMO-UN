'use client';
import { useState, useEffect } from 'react';

const LABELS = {
  overview:     { label: 'Overview',       hint: 'Platform summary & live activity' },
  discovery:    { label: 'Discovery',      hint: 'Upload documents · OCR extraction' },
  intelligence: { label: 'Intelligence',   hint: 'AI regulatory mapping · stream live' },
  coverage:     { label: 'Coverage Map',   hint: 'ASEAN indicator × country heatmap' },
  dashboard:    { label: 'Dashboard',      hint: 'Compliance scores · indicator charts' },
  export:       { label: 'Export',         hint: 'RDTII-2024 schema · JSON & CSV' },
};

export default function Header({ section, onNav }) {
  const [beat, setBeat] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBeat(b => !b), 2000);
    return () => clearInterval(t);
  }, []);

  const info = LABELS[section];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 220, right: 0, height: 52,
      background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', zIndex: 100,
    }}>
      {/* Left: breadcrumb + hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12.5, color: '#1E293B' }}>RegMap AI</span>
        <span style={{ color: '#1E293B', fontSize: 12 }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1' }}>{info?.label}</span>
        <span style={{
          padding: '2px 10px', borderRadius: 20,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11, color: '#334155',
        }}>{info?.hint}</span>
      </div>

      {/* Right: stats + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[['overview','🏠'],['discovery','📥'],['intelligence','🧠'],['coverage','🗺️'],['dashboard','📊'],['export','📤']].map(([id, icon]) => (
            <button key={id} onClick={() => onNav(id)} style={{
              width: 28, height: 28, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: section === id ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: `1px solid ${section === id ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
              cursor: 'pointer', fontSize: 13, transition: 'all .15s',
            }}>{icon}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px',
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: 20, fontSize: 11.5, color: '#64748B',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
            background: beat ? '#10B981' : '#059669',
            boxShadow: '0 0 5px #10B981', transition: 'background 0.4s',
          }} />
          ⚡ Typhoon OCR × Qwen3-32b
        </div>
      </div>
    </div>
  );
}
