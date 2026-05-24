'use client';
import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { INDICATORS, COVERAGE, COUNTRY_STATS, confColor, cellBg, cellTxt } from '@/lib/data';

const RADAR_COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

export default function Coverage() {
  const [hover, setHover] = useState(null);
  const countries = Object.keys(COVERAGE);

  const overallScore = c => {
    const vals = COVERAGE[c];
    return Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
  };

  const radarData = INDICATORS.map((ind, i) => ({
    subject: ind.id,
    ...Object.fromEntries(countries.slice(0, 5).map(c => [c, COVERAGE[c][i]])),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 32 }}>

      {/* Page title */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px', marginBottom: 4 }}>Coverage Map</div>
        <div style={{ fontSize: 13, color: '#475569' }}>RDTII indicator × country heatmap · {INDICATORS.length} indicators · {countries.length} countries</div>
      </div>

      {/* Heatmap */}
      <div className="glass" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 16px', fontSize: 11, color: '#475569', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, minWidth: 180 }}>
                Indicator
              </th>
              {countries.map(c => {
                const s = COUNTRY_STATS.find(x => x.country === c);
                return (
                  <th key={c} style={{ padding: '8px 4px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', minWidth: 68 }}>
                    <div style={{ fontSize: 17 }}>{s?.flag}</div>
                    <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{c.slice(0, 5)}</div>
                  </th>
                );
              })}
              <th style={{ padding: '10px 8px', fontSize: 11, color: '#475569', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>Avg</th>
            </tr>
          </thead>
          <tbody>
            {INDICATORS.map((ind, i) => {
              const vals = countries.map(c => COVERAGE[c][i]);
              const avg  = Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
              return (
                <tr key={ind.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '7px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: ind.pillar === 6 ? 'rgba(99,102,241,0.14)' : 'rgba(139,92,246,0.14)',
                        color: ind.pillar === 6 ? '#818CF8' : '#A78BFA',
                        fontFamily: 'monospace',
                      }}>{ind.id}</span>
                      <span style={{ fontSize: 11.5, color: '#94A3B8' }}>{ind.name}</span>
                    </div>
                  </td>
                  {countries.map(c => {
                    const v = COVERAGE[c][i];
                    const isHov = hover?.country === c && hover?.iIdx === i;
                    return (
                      <td key={c}
                        onMouseEnter={() => setHover({ country: c, iIdx: i })}
                        onMouseLeave={() => setHover(null)}
                        style={{
                          padding: '6px 4px', textAlign: 'center',
                          background: isHov ? 'rgba(99,102,241,0.2)' : cellBg(v),
                          transition: 'background .12s', cursor: 'default',
                        }}>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: isHov ? '#F1F5F9' : cellTxt(v) }}>
                          {v > 0 ? v : '—'}
                        </span>
                      </td>
                    );
                  })}
                  <td style={{ padding: '6px 8px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: confColor(avg) }}>{avg}</span>
                  </td>
                </tr>
              );
            })}
            <tr style={{ borderTop: '2px solid rgba(255,255,255,0.06)' }}>
              <td style={{ padding: '9px 16px', fontSize: 11.5, fontWeight: 600, color: '#64748B' }}>Overall</td>
              {countries.map(c => (
                <td key={c} style={{ padding: '7px 4px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: confColor(overallScore(c)) }}>{overallScore(c)}</span>
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>

        {/* Legend */}
        <div style={{ padding: '9px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            ['rgba(16,185,129,0.22)', '#34D399', '≥ 80'],
            ['rgba(16,185,129,0.1)',  '#A7F3D0', '60–79'],
            ['rgba(245,158,11,0.12)', '#FDE68A', '40–59'],
            ['rgba(239,68,68,0.1)',   '#FCA5A5', '< 40'],
          ].map(([bg, clr, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: bg, display: 'inline-block' }} />
              <span style={{ color: clr }}>{lbl}</span>
            </div>
          ))}
          {hover && (
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94A3B8' }}>
              {COUNTRY_STATS.find(s => s.country === hover.country)?.flag} {hover.country} · {INDICATORS[hover.iIdx].id} ·{' '}
              <span style={{ fontWeight: 700, color: confColor(COVERAGE[hover.country][hover.iIdx]) }}>
                {COVERAGE[hover.country][hover.iIdx]}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Radar */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
          Indicator Radar — Top 5
        </div>
        <div className="glass" style={{ padding: '20px 16px 14px' }}>
          <ResponsiveContainer width="100%" height={270}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
              {countries.slice(0, 5).map((c, i) => (
                <Radar key={c} name={c} dataKey={c} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.08} strokeWidth={1.5} />
              ))}
              <Tooltip
                contentStyle={{ background: '#0D0D18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F8FAFC', fontWeight: 600 }} itemStyle={{ color: '#94A3B8' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 6 }}>
            {countries.slice(0, 5).map((c, i) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: RADAR_COLORS[i], display: 'inline-block' }} />
                {COUNTRY_STATS.find(s => s.country === c)?.flag} {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
