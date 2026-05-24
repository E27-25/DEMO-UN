'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { COUNTRY_STATS, CHART_DATA, RECENT_VERIFICATIONS } from '@/lib/data';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = CHART_DATA.find(x => x.id === label);
  return (
    <div style={{ background: '#0D0D18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#F1F5F9', fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#64748B' }}>{payload[0].value} countries with coverage</div>
      <div style={{ color: d?.pillar === 6 ? '#818CF8' : '#A78BFA', fontWeight: 600, marginTop: 2 }}>Avg score: {d?.conf}%</div>
    </div>
  );
}

export default function Dashboard() {
  const totalVerified = RECENT_VERIFICATIONS.filter(v => v.action === 'Human Verified').length;
  const avgScore = Math.round(COUNTRY_STATS.reduce((s, c) => s + parseInt(c.score), 0) / COUNTRY_STATS.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto', paddingBottom: 24 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(99,102,241,0.05) 100%)',
        border: '1px solid rgba(16,185,129,0.12)', borderRadius: 14, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Analytics Dashboard
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            RDTII-2024 compliance scores · {COUNTRY_STATS.length} ASEAN countries
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            [String(avgScore), 'Avg Score'],
            [String(totalVerified), 'Verified'],
            [String(COUNTRY_STATS.length), 'Countries'],
          ].map(([v, l]) => (
            <div key={l} style={{
              padding: '8px 14px', borderRadius: 10, textAlign: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>{v}</div>
              <div style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Country compliance cards */}
      <div>
        <div className="section-label">Country Compliance Scores (RDTII-2024)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {COUNTRY_STATS.map(c => (
            <div key={c.country} className="glass card-hover" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 26 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{c.country}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    {c.laws} law{c.laws !== 1 ? 's' : ''} · {c.indicators} indicators
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.score}</div>
                  <div style={{ fontSize: 9.5, color: '#334155', fontWeight: 500 }}>RDTII</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 10.5, color: '#475569' }}>Verified coverage</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: c.color }}>{c.verified}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${c.verified}%`, height: '100%',
                  background: `linear-gradient(90deg, ${c.color}, ${c.color}CC)`,
                  borderRadius: 3, boxShadow: `0 0 8px ${c.color}44`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <div className="section-label">Countries per Indicator</div>
        <div className="glass" style={{ padding: '20px 16px 14px' }}>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="id" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="laws" radius={[5, 5, 0, 0]}>
                {CHART_DATA.map((e, i) => (
                  <Cell key={i} fill={e.pillar === 6 ? '#6366F1' : '#8B5CF6'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 10 }}>
            {[['#6366F1', 'Pillar 6 — Cross-border Data Flows'], ['#8B5CF6', 'Pillar 7 — Domestic Data Protection']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification feed */}
      <div>
        <div className="section-label">Live Verification Feed</div>
        <div className="glass" style={{ overflow: 'hidden' }}>
          {RECENT_VERIFICATIONS.map((v, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
              borderBottom: i < RECENT_VERIFICATIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{v.flag}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#E2E8F0' }}>{v.country}</span>
                <span style={{ fontSize: 12, color: '#334155', margin: '0 6px' }}>·</span>
                <span style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 200, verticalAlign: 'bottom' }}>{v.law}</span>
              </div>
              <span style={{
                padding: '2px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, flexShrink: 0,
                color: '#818CF8', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
              }}>{v.ind}</span>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: v.action === 'Human Verified' ? '#10B981' : '#F59E0B' }}>
                  {v.action === 'Human Verified' ? '✓ Verified' : '⏳ Pending'}
                </div>
                <div style={{ fontSize: 10.5, color: '#1E293B', marginTop: 1 }}>{v.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
