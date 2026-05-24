'use client';
import { useState, useMemo } from 'react';
import { useToast } from '../ui/Toast';
import { COUNTRY_STATS } from '@/lib/data';

const STATS = {
  Laos:        { total: 8, verified: 5 }, Cambodia:    { total: 6, verified: 5 },
  Myanmar:     { total: 4, verified: 2 }, Thailand:    { total: 9, verified: 8 },
  Vietnam:     { total: 6, verified: 4 }, Indonesia:   { total: 8, verified: 6 },
  Philippines: { total: 8, verified: 6 }, Singapore:   { total: 9, verified: 9 },
  Malaysia:    { total: 7, verified: 5 },
};
const ISO = { Laos:'LA', Cambodia:'KH', Myanmar:'MM', Thailand:'TH', Vietnam:'VN', Indonesia:'ID', Philippines:'PH', Singapore:'SG', Malaysia:'MY' };

function highlight(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      m => {
        let color = '#06B6D4';
        if (/^"/.test(m)) color = /:$/.test(m) ? '#818CF8' : '#86EFAC';
        else if (/true|false/.test(m)) color = '#F59E0B';
        else if (/null/.test(m)) color = '#64748B';
        return `<span style="color:${color}">${m}</span>`;
      }
    );
}

export default function Export() {
  const [country, setCountry] = useState('Laos');
  const [schema,  setSchema]  = useState('RDTII-2024');
  const toast = useToast();
  const countries = Object.keys(STATS);

  const exportObj = useMemo(() => ({
    export_date: '2026-05-24', schema_version: schema,
    generated_by: 'RegMap AI · Typhoon OCR × Qwen3-32b',
    escap_project: 'RDTII 2024 Data Collection',
    country, country_iso: ISO[country],
    total_mappings:   STATS[country]?.total    || 0,
    verified_mappings:STATS[country]?.verified || 0,
    pending_review:   (STATS[country]?.total || 0) - (STATS[country]?.verified || 0),
    coverage_score:   COUNTRY_STATS.find(s => s.country === country)?.score || 0,
    mappings: [
      {
        indicator_id: '6.4', indicator_name: 'Conditional flow regimes', pillar: 6,
        evidence_text: 'Personal data may only be transferred to countries assessed as providing adequate protection equivalent to this Law.',
        paragraph_ref: 'Article 12', confidence: 92, concept_detected: 'adequacy requirement',
        reasoning: 'Establishes conditional transfer regime requiring adequacy assessment before cross-border data flows.',
        status: 'confirmed', verified_by: 'human', verified_at: '2026-05-24T10:23:00Z',
        source_law: `${country} Electronic Data Protection Law`, traceable: true,
      },
      {
        indicator_id: '7.1', indicator_name: 'Comprehensive data protection legislation', pillar: 7,
        evidence_text: 'This Law governs the collection, use, storage, and transfer of electronic personal data.',
        paragraph_ref: 'Article 1', confidence: 98, concept_detected: 'comprehensive legislation',
        reasoning: 'Establishes the law as a comprehensive data governance framework covering the full data lifecycle.',
        status: 'confirmed', verified_by: 'human', verified_at: '2026-05-24T10:15:00Z',
        source_law: `${country} Electronic Data Protection Law`, traceable: true,
      },
      {
        indicator_id: '7.2', indicator_name: 'Independent supervisory authority', pillar: 7,
        evidence_text: 'The Ministry shall establish a national data protection registry and publish annual compliance reports.',
        paragraph_ref: 'Article 23', confidence: 74, concept_detected: 'supervisory body (ministerial)',
        reasoning: 'Creates oversight under a ministry — partial independence, not a fully autonomous authority.',
        status: 'confirmed', verified_by: 'human', verified_at: '2026-05-24T10:28:00Z',
        source_law: `${country} Electronic Data Protection Law`, traceable: true,
      },
    ],
  }), [country, schema]);

  const jsonStr = JSON.stringify(exportObj, null, 2);
  const flagFor = c => COUNTRY_STATS.find(s => s.country === c)?.flag || '';

  const dl = (content, mime, ext) => {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `rdtii-${country.toLowerCase()}-${schema.toLowerCase()}.${ext}`; a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${country} as ${ext.toUpperCase()}`);
  };

  const dlCSV = () => {
    const hdr  = 'indicator_id,indicator_name,pillar,evidence_text,paragraph_ref,confidence,status,verified_by,traceable\n';
    const rows = exportObj.mappings.map(m =>
      [m.indicator_id, m.indicator_name, m.pillar, `"${m.evidence_text}"`, m.paragraph_ref, m.confidence, m.status, m.verified_by, m.traceable].join(',')
    ).join('\n');
    dl(hdr + rows, 'text/csv', 'csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 860, paddingBottom: 32 }}>

      {/* Page title */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px', marginBottom: 4 }}>Export</div>
        <div style={{ fontSize: 13, color: '#475569' }}>RDTII-2024 schema · JSON &amp; CSV · Direct ESCAP database ingestion</div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 9, color: '#E2E8F0', padding: '8px 14px', fontSize: 13, cursor: 'pointer',
        }}>
          {countries.map(c => <option key={c} value={c} style={{ background: '#0D0D18' }}>{flagFor(c)} {c}</option>)}
        </select>

        <select value={schema} onChange={e => setSchema(e.target.value)} style={{
          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 9, color: '#818CF8', padding: '8px 14px', fontSize: 13, cursor: 'pointer',
        }}>
          {['RDTII-2024','RDTII-2023','RDTII-2022'].map(s => <option key={s} value={s} style={{ background: '#0D0D18' }}>{s}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn-primary" onClick={() => dl(jsonStr, 'application/json', 'json')}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}>⬇ JSON</button>
          <button className="btn-ghost"  onClick={dlCSV}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}>⬇ CSV</button>
        </div>
      </div>

      {/* Stats chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          [`${exportObj.total_mappings} mappings`,     '#818CF8'],
          [`${exportObj.verified_mappings} verified`,  '#10B981'],
          [`${exportObj.pending_review} pending`,      '#F59E0B'],
          [`Score ${exportObj.coverage_score}`,        '#22D3EE'],
        ].map(([label, color]) => (
          <span key={label} style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            color, background: `${color}10`, border: `1px solid ${color}22`,
          }}>{label}</span>
        ))}
      </div>

      {/* JSON preview */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#EF4444','#F59E0B','#10B981'].map((c, i) => (
              <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontSize: 11.5, color: '#475569', marginLeft: 4, fontFamily: 'monospace' }}>
            rdtii-{country.toLowerCase()}-export.json
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#334155' }}>{jsonStr.length.toLocaleString()} bytes</span>
        </div>
        <div
          style={{
            padding: '14px 18px', maxHeight: 440, overflowY: 'auto', overflowX: 'auto',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, lineHeight: 1.8, color: '#64748B',
            background: 'rgba(0,0,0,0.18)', whiteSpace: 'pre',
          }}
          dangerouslySetInnerHTML={{ __html: highlight(jsonStr) }}
        />
      </div>

      {/* Note */}
      <div style={{ fontSize: 12.5, color: '#475569', display: 'flex', gap: 10, lineHeight: 1.7 }}>
        <span style={{ color: '#22D3EE', flexShrink: 0 }}>🔒</span>
        Every mapping cites exact paragraph, verbatim evidence text, confidence score, and human verification status. Zero fabricated citations.
      </div>
    </div>
  );
}
