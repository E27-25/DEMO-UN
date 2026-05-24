'use client';
import { useState, useEffect, useRef } from 'react';
import { RECENT_VERIFICATIONS, COUNTRY_STATS } from '@/lib/data';

function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.disconnect();
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function StatCard({ val, suffix, label, sub, color = '#6366F1' }) {
  return (
    <div className="glass card-hover" style={{ padding: '20px 22px' }}>
      <div style={{
        fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1,
        background: `linear-gradient(135deg, ${color}, ${color}AA)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        <Counter target={val} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function StepCard({ icon, step, title, desc, delay }) {
  return (
    <div className="glass card-hover" style={{ padding: '22px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>
            Step {step}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>{title}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.75 }}>{desc}</div>
    </div>
  );
}

export default function Overview({ onNav }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', paddingBottom: 24 }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(34,211,238,0.04) 100%)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 16, padding: '32px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#22D3EE', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            For ESCAP
          </span>
          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#818CF8', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)' }}>
            RDTII 2024
          </span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', color: '#F1F5F9', marginBottom: 10, lineHeight: 1.2 }}>
          Automated Regulatory Intelligence<br />
          <span className="gradient-text">for Digital Trade Mapping</span>
        </div>
        <div style={{ fontSize: 14, color: '#64748B', marginBottom: 20, maxWidth: 520, lineHeight: 1.75 }}>
          Map ASEAN digital trade laws to RDTII indicators automatically.
          Typhoon OCR handles multilingual scans. Qwen3-32b understands legal semantics.
          Humans verify. ESCAP gets clean, traceable data.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={() => onNav('intelligence')}
            style={{ padding: '10px 20px', borderRadius: 9, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>
            ⚡ Try Intelligence Layer
          </button>
          <button className="btn-ghost" onClick={() => onNav('coverage')}
            style={{ padding: '10px 20px', borderRadius: 9, fontSize: 13.5 }}>
            🗺️ View Coverage Map
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard val={2341}  suffix=""  label="Indicators Mapped"   sub="Across 9 countries"      color="#6366F1" />
        <StatCard val={11}    suffix=""  label="Laws Indexed"        sub="11 ASEAN jurisdictions"  color="#8B5CF6" />
        <StatCard val={9}     suffix=""  label="ASEAN Countries"     sub="Full RDTII coverage"     color="#22D3EE" />
        <StatCard val={96}    suffix="%" label="OCR Accuracy"        sub="Multilingual documents"  color="#10B981" />
      </div>

      {/* Steps */}
      <div>
        <div className="section-label">How It Works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <StepCard icon="📄" step="01" title="Upload & Extract" desc="Drop any scanned document — Typhoon OCR extracts structured text in seconds. Thai, Lao, Khmer, Burmese, Vietnamese all supported." />
          <StepCard icon="🧠" step="02" title="AI Maps to RDTII" desc="Qwen3-32b reads legal semantics to identify adequacy regimes, breach obligations, supervisory mandates, and individual rights provisions." />
          <StepCard icon="✅" step="03" title="Human Verifies"   desc="Confirm, Edit, or Reject each AI mapping in one click. Complete audit trail with paragraph references. Export RDTII-2024 schema JSON." />
        </div>
      </div>

      {/* Value props */}
      <div className="glass" style={{ padding: 22 }}>
        <div className="section-label">What This Means for ESCAP</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            ['🏛', 'Feeds RDTII database directly', 'No manual data entry required'],
            ['🌏', 'No translators needed', 'Handles 9+ ASEAN languages natively'],
            ['🔍', 'Zero fabricated citations', 'Every mapping cites exact paragraph'],
            ['⚡', 'Minutes not months', 'Weeks of research per country → minutes'],
            ['🤝', 'Human-in-the-loop', 'AI drafts · experts verify · full trail'],
            ['📦', 'Schema-ready export', 'RDTII-2024 JSON & CSV, direct ingestion'],
          ].map(([icon, title, sub], i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '13px 4px',
              borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, marginTop: 2 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Country scores overview */}
      <div>
        <div className="section-label">Country Compliance Snapshot</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {COUNTRY_STATS.slice(0, 6).map(c => (
            <div key={c.country} className="glass-sm card-hover" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{c.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{c.country}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{c.laws} laws · {c.indicators} indicators</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.score}</div>
                <div style={{ fontSize: 10, color: '#334155' }}>RDTII</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live feed */}
      <div>
        <div className="section-label">Live Verification Activity</div>
        <div className="glass" style={{ overflow: 'hidden' }}>
          {RECENT_VERIFICATIONS.map((v, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px',
              borderBottom: i < RECENT_VERIFICATIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontSize: 20 }}>{v.flag}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.country} · {v.law}
                </div>
              </div>
              <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, color: '#818CF8', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', flexShrink: 0 }}>
                {v.ind}
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: v.action === 'Human Verified' ? '#10B981' : '#F59E0B', flexShrink: 0 }}>
                {v.action === 'Human Verified' ? '✓ Verified' : '⏳ Pending'}
              </span>
              <span style={{ fontSize: 11, color: '#1E293B', flexShrink: 0 }}>{v.ts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
