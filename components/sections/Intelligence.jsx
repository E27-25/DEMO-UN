'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import ResultCard from '../ui/ResultCard';
import { VAULT_DOCS, MOCK_LAWS } from '@/lib/data';

const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_KEY || '';

const SYSTEM_PROMPT = `You are an expert legal analyst for ESCAP's RDTII (Regulatory and Digital Trade Inclusive Internet Index). Analyze the legal text and map ALL relevant provisions to RDTII indicators.

Pillar 6 — Cross-border Data Flows:
6.1 = Free flow of data principle
6.2 = Data localization requirements
6.3 = Government access to data
6.4 = Conditional flow regimes (adequacy decisions)
6.5 = Sector-specific data flow rules
6.6 = International framework alignment (CBPR, APEC, GDPR adequacy)

Pillar 7 — Domestic Data Protection:
7.1 = Comprehensive data protection legislation
7.2 = Independent supervisory authority
7.3 = Individual rights (access, correction, deletion, portability)
7.4 = Data breach notification obligations

Return ONLY a JSON array — no markdown fences, no backticks, no text outside JSON:
[{"indicator_id":"6.4","indicator_name":"Conditional flow regimes","pillar":6,"evidence_text":"exact quote max 40 words","paragraph_ref":"Article 12","confidence":87,"concept_detected":"adequacy requirement","reasoning":"One sentence explanation.","status":"pending"}]`;

export default function Intelligence({ uploadedText }) {
  const [docId, setDocId] = useState('laos-edp-2017');
  const [text, setText] = useState(MOCK_LAWS['laos-edp-2017']);
  const [analyzing, setAnalyzing] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [showStream, setShowStream] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [evidenceSnips, setEvidenceSnips] = useState([]);
  const streamRef = useRef(null);
  const toast = useToast();

  const docOptions = [
    ...VAULT_DOCS.map(d => ({ value: d.id, label: `${d.flag} ${d.country} · ${d.title} (${d.year})` })),
    ...(uploadedText ? [{ value: '__ocr__', label: '📎 Uploaded Document (OCR)' }] : []),
  ];

  const onDocChange = v => {
    setDocId(v);
    setText(v === '__ocr__' ? (uploadedText || '') : (MOCK_LAWS[v] || ''));
    setResults([]); setError(''); setEvidenceSnips([]); setStreamText('');
  };

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [streamText]);

  const analyze = useCallback(async () => {
    if (!text) return;
    setAnalyzing(true); setResults([]); setError(''); setStreamText(''); setEvidenceSnips([]);
    setShowStream(true);
    let accumulated = '';

    const readStream = async reader => {
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          const l = line.trim();
          if (!l.startsWith('data: ')) continue;
          const d = l.slice(6);
          if (d === '[DONE]') continue;
          try {
            const j = JSON.parse(d);
            const tok = j.choices?.[0]?.delta?.content || '';
            accumulated += tok;
            setStreamText(accumulated);
          } catch { /* partial JSON */ }
        }
      }
    };

    try {
      try {
        const r = await fetch('/api/analyze', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!r.ok) throw new Error('proxy unavailable');
        await readStream(r.body.getReader());
      } catch {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: 'qwen/qwen3-32b',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `Analyze this legal document and map ALL provisions to RDTII indicators:\n\n${text}` },
            ],
            stream: true, temperature: 0.05, max_tokens: 4000,
          }),
        });
        await readStream(r.body.getReader());
      }

      const noThink = accumulated.replace(/<think>[\s\S]*?<\/think>/gi, '');
      const raw = noThink.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Model returned no mappings — try a different document');
      const parsed = JSON.parse(match[0]);
      setResults(parsed.map(r => ({ ...r, status: 'pending' })));
      setEvidenceSnips(parsed.map(r => r.evidence_text?.slice(0, 22) || '').filter(Boolean));
      toast(`Found ${parsed.length} indicator mapping${parsed.length !== 1 ? 's' : ''} — review and verify`);
    } catch (err) {
      setError(err.message);
      toast('Analysis failed: ' + err.message, 'error');
    } finally {
      setAnalyzing(false);
    }
  }, [text, toast]);

  const lines = text.split('\n');
  const confirmedCount = results.filter(r => r.status === 'confirmed').length;
  const pendingCount = results.filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto', paddingBottom: 24 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(99,102,241,0.05) 100%)',
        border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, letterSpacing: '-0.3px' }}>
            AI Regulatory Intelligence
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            Qwen3-32b maps legal provisions to RDTII indicators in real time
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {results.length > 0 && (
            <>
              <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                ✓ {confirmedCount} verified
              </span>
              <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                ⏳ {pendingCount} pending
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 500 }}>
        {/* Left: Document viewer */}
        <div style={{ width: '42%', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Document Viewer
          </div>

          <select value={docId} onChange={e => onDocChange(e.target.value)} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9, color: '#E2E8F0', padding: '9px 12px',
            fontSize: 13, width: '100%', cursor: 'pointer',
          }}>
            {docOptions.map(o => <option key={o.value} value={o.value} style={{ background: '#0D0D18' }}>{o.label}</option>)}
          </select>

          <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 300 }}>
            <div style={{
              padding: '7px 14px', background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: 11, color: '#334155', flexShrink: 0, display: 'flex', gap: 10,
            }}>
              <span>{text.length.toLocaleString()} chars</span>
              <span>·</span>
              <span>{lines.length} lines</span>
              {evidenceSnips.length > 0 && (
                <span style={{ color: '#F59E0B', marginLeft: 4 }}>· {evidenceSnips.length} matched</span>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
              {lines.map((line, i) => {
                const hi = evidenceSnips.some(s => line.includes(s));
                return (
                  <div key={i} className={hi ? 'highlight-amber' : ''} style={{
                    display: 'flex', gap: 10, padding: '1px 0', transition: 'all .4s',
                  }}>
                    <span className="mono" style={{ fontSize: 9.5, color: '#1E293B', minWidth: 22, textAlign: 'right', paddingTop: 3, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 12, color: hi ? '#FDE68A' : '#64748B', lineHeight: 1.7 }}>
                      {line || ' '}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn-primary" onClick={analyze} disabled={analyzing || !text}
            style={{ padding: '13px 20px', borderRadius: 10, fontSize: 14, width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            {analyzing ? <><span className="spin">⟳</span>Analyzing…</> : '⚡ Analyze Document'}
          </button>
        </div>

        {/* Right: Results */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Mapping Results
            </div>
            {streamText && (
              <button onClick={() => setShowStream(s => !s)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                color: '#818CF8', fontFamily: 'Inter, sans-serif',
              }}>
                {showStream ? 'Hide' : 'Show'} Stream
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Live stream terminal */}
            {showStream && streamText && (
              <div className="glass-dark" style={{ borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{
                  padding: '7px 14px', background: 'rgba(0,0,0,0.25)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                    background: analyzing ? '#10B981' : '#475569',
                    boxShadow: analyzing ? '0 0 6px #10B981' : 'none',
                    transition: 'all .3s',
                  }} />
                  <span className="mono">{analyzing ? '● streaming qwen3-32b…' : '✓ stream complete'}</span>
                </div>
                <div ref={streamRef} style={{
                  maxHeight: 150, overflowY: 'auto',
                  padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: '#475569', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>
                  {streamText}
                  {analyzing && (
                    <span style={{ animation: 'streamCursor 0.8s step-end infinite', color: '#6366F1' }}>▋</span>
                  )}
                </div>
              </div>
            )}

            {/* Skeleton loaders */}
            {analyzing && !results.length && [1, 2, 3].map(i => (
              <div key={i} className="glass pulse" style={{
                borderRadius: 10, borderLeft: `3px solid ${i % 2 ? '#6366F150' : '#8B5CF650'}`, padding: 14,
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 56, height: 20, borderRadius: 12, background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{ width: 34, height: 20, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div style={{ width: '60%', height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />
                <div style={{ height: 44, borderRadius: 6, background: 'rgba(245,158,11,0.05)', marginBottom: 10, borderLeft: '3px solid rgba(245,158,11,0.15)' }} />
              </div>
            ))}

            {error && (
              <div style={{ padding: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, fontSize: 13, color: '#EF4444' }}>
                ⚠ {error}
              </div>
            )}

            {!analyzing && !error && results.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1E293B', textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: 56, marginBottom: 18, opacity: 0.35 }}>🧠</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                  Select a document and click Analyze
                </div>
                <div style={{ fontSize: 12.5, color: '#1E293B', maxWidth: 280, lineHeight: 1.7 }}>
                  Qwen3-32b maps legal provisions to RDTII indicators via semantic understanding — watch it stream live
                </div>
              </div>
            )}

            {results.map((r, idx) => (
              <ResultCard
                key={idx} result={r} idx={idx}
                onUpdate={(i, status, reasoning) =>
                  setResults(prev => prev.map((x, j) => j === i ? { ...x, status, reasoning } : x))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
