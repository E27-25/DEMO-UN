'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import ResultCard from '../ui/ResultCard';
import { jsonrepair } from 'jsonrepair';
import { VAULT_DOCS, MOCK_LAWS } from '@/lib/data';

const TYPHOON_KEY = process.env.NEXT_PUBLIC_TYPHOON_KEY || '';
const GROQ_KEY    = process.env.NEXT_PUBLIC_GROQ_KEY    || '';

const SYSTEM_PROMPT = `You are an expert legal analyst for ESCAP's RDTII. The document may be in ANY language (Thai, Lao, Vietnamese, Bahasa, etc.). Read it in the original language and output results in English.

Map ALL relevant provisions to RDTII indicators:

Pillar 6 — Cross-border Data Flows:
6.1 Free flow of data | 6.2 Data localization | 6.3 Government access | 6.4 Conditional flow regimes | 6.5 Sector-specific rules | 6.6 International framework alignment

Pillar 7 — Domestic Data Protection:
7.1 Comprehensive legislation | 7.2 Independent supervisory authority | 7.3 Individual rights | 7.4 Breach notification

Rules:
- evidence_text: English translation of the exact quote, ≤40 words
- paragraph_ref: cite the article/section number
- confidence: 0-100
- If no relevant provisions exist, return []

Return ONLY a valid JSON array, no markdown, no explanation:
[{"indicator_id":"6.4","indicator_name":"Conditional flow regimes","pillar":6,"evidence_text":"English translation of exact quote","paragraph_ref":"Article 12","confidence":87,"concept_detected":"adequacy requirement","reasoning":"One sentence.","status":"pending"}]`;

export default function Analyze() {
  const [docId,       setDocId]       = useState('laos-edp-2017');
  const [text,        setText]        = useState(MOCK_LAWS['laos-edp-2017']);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [streamText,  setStreamText]  = useState('');
  const [results,     setResults]     = useState([]);
  const [error,       setError]       = useState('');
  const [snips,       setSnips]       = useState([]);
  const [dragging,    setDragging]    = useState(false);
  const [scanning,    setScanning]    = useState(false);
  const [scanKey,     setScanKey]     = useState(0);
  const [preview,     setPreview]     = useState(null);
  const [ocrErr,      setOcrErr]      = useState('');
  const streamRef = useRef(null);
  const fileRef   = useRef();
  const toast = useToast();

  const docOptions = VAULT_DOCS.map(d => ({
    value: d.id,
    label: `${d.flag} ${d.country} — ${d.title} (${d.year})`,
  }));

  const onDocChange = v => {
    setDocId(v); setText(MOCK_LAWS[v] || '');
    setResults([]); setError(''); setSnips([]); setStreamText('');
    setPreview(null); setOcrErr('');
  };

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [streamText]);

  const ocrImage = useCallback(async (base64, mimeType) => {
    let data;
    try {
      const r = await fetch('/api/ocr', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mimeType }),
      });
      if (!r.ok) throw new Error('proxy unavailable');
      data = await r.json();
    } catch {
      const r = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TYPHOON_KEY}` },
        body: JSON.stringify({
          model: 'typhoon-ocr-preview',
          messages: [{ role: 'user', content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
            { type: 'text', text: 'Extract all text from this legal document. Preserve article numbers and paragraph structure. Plain text only.' },
          ]}],
          max_tokens: 4096,
        }),
      });
      data = await r.json();
    }
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || '';
  }, []);

  const processFile = useCallback(async file => {
    if (!file) return;
    setResults([]); setError(''); setSnips([]); setStreamText('');
    setOcrErr('');

    if (file.type === 'application/pdf') {
      setScanning(true); setScanKey(k => k + 1); setPreview(null);
      try {
        const r = await fetch('/api/extract-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/pdf' },
          body: file,
        });
        const data = await r.json();
        if (!r.ok || data.error) throw new Error(data.error || `Server error ${r.status}`);
        setDocId('__upload__'); setText(data.text);
        toast(`PDF — ${data.text.length.toLocaleString()} chars · ${data.pages} pages`);
      } catch (err) {
        setOcrErr(err.message);
        toast('PDF failed: ' + err.message, 'error');
      } finally { setScanning(false); }
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast('PNG, JPG, WEBP or PDF only', 'error'); return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target.result;
      setPreview(dataUrl); setScanning(true); setScanKey(k => k + 1);
      try {
        const txt = await ocrImage(dataUrl.split(',')[1], file.type);
        setDocId('__upload__'); setText(txt);
        toast(`OCR — ${txt.length.toLocaleString()} chars extracted`);
      } catch (err) {
        setOcrErr(err.message);
        toast('OCR failed: ' + err.message, 'error');
      } finally { setScanning(false); }
    };
    reader.readAsDataURL(file);
  }, [ocrImage, toast]);

  const analyze = useCallback(async () => {
    if (!text) return;
    setAnalyzing(true); setResults([]); setError(''); setStreamText(''); setSnips([]);
    let accumulated = '';

    // Groq free tier: 12k TPM total. ~8k input tokens + 2.5k output + 0.3k system = ~10.8k
    const smartSlice = t => {
      if (t.length <= 32000) return t;
      return t.slice(0, 16000) + '\n\n[...]\n\n' + t.slice(-16000);
    };

    const readStream = async reader => {
      const dec = new TextDecoder();
      let nonSse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          const l = line.trim();
          if (l.startsWith('data: ')) {
            const d = l.slice(6);
            if (d === '[DONE]') continue;
            try {
              const tok = JSON.parse(d).choices?.[0]?.delta?.content || '';
              accumulated += tok; setStreamText(accumulated);
            } catch { /* partial SSE chunk */ }
          } else {
            nonSse += line;
          }
        }
      }
      if (!accumulated && nonSse.trim()) {
        try {
          const e = JSON.parse(nonSse.trim());
          throw new Error(e.error?.message || e.message || nonSse.trim().slice(0, 120));
        } catch (e) { throw e; }
      }
    };

    try {
      try {
        const r = await fetch('/api/analyze', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: smartSlice(text) }),
        });
        if (!r.ok) throw new Error('proxy unavailable');
        await readStream(r.body.getReader());
      } catch (proxyErr) {
        accumulated = '';
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user',   content: `Analyze and map ALL RDTII provisions:\n\n${smartSlice(text)}` },
            ],
            stream: true, temperature: 0.05, max_tokens: 2500,
          }),
        });
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          throw new Error(e.error?.message || `Groq error ${r.status}`);
        }
        await readStream(r.body.getReader());
      }

      const noThink = accumulated
        .replace(/<think>[\s\S]*?<\/think>/gi, '')  // strip complete think blocks
        .replace(/<think>[\s\S]*/i, '');             // strip unclosed think block (truncated)
      const raw = noThink.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      if (/\[\s*\]/.test(raw) && !raw.includes('{')) throw new Error('No RDTII provisions found in this document');

      // Try complete array; fall back to extracting any complete objects (handles truncation)
      let match = raw.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!match) {
        const objs = [...raw.matchAll(/\{(?:[^{}]|\{[^{}]*\})*\}/g)].map(m => m[0]);
        if (objs.length) match = [`[${objs.join(',')}]`];
      }
      if (!match) throw new Error(`No mappings found — try again`);

      const tryParse = str => {
        try { return JSON.parse(str); } catch { return JSON.parse(jsonrepair(str)); }
      };

      let parsed;
      try {
        parsed = tryParse(match[0]);
      } catch {
        // jsonrepair failed on the whole array — extract individual objects
        const items = [];
        const objRe = /\{(?:[^{}]|\{[^{}]*\})*\}/g;
        let m;
        while ((m = objRe.exec(match[0])) !== null) {
          try { items.push(tryParse(m[0])); } catch { /* skip malformed */ }
        }
        if (!items.length) throw new Error('No mappings returned — try again');
        parsed = items;
      }

      setResults(parsed.map(r => ({ ...r, status: 'pending' })));
      setSnips(parsed.map(r => r.evidence_text?.slice(0, 22) || '').filter(Boolean));
      toast(`${parsed.length} mapping${parsed.length !== 1 ? 's' : ''} found — review below`);
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    } finally { setAnalyzing(false); }
  }, [text, toast]);

  const lines = text.split('\n');
  const confirmedCount = results.filter(r => r.status === 'confirmed').length;

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 108px)', minHeight: 0 }}>

      {/* ── Left panel: document ── */}
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>

        {/* Doc selector */}
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Document
          </div>
          <select value={docId} onChange={e => onDocChange(e.target.value)} style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9,
            color: '#E2E8F0', padding: '9px 12px', fontSize: 13, cursor: 'pointer',
          }}>
            {docOptions.map(o => <option key={o.value} value={o.value} style={{ background: '#0D0D18' }}>{o.label}</option>)}
            {docId === '__upload__' && <option value="__upload__" style={{ background: '#0D0D18' }}>📎 Uploaded document</option>}
          </select>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? '#6366F1' : 'rgba(99,102,241,0.2)'}`,
            borderRadius: 10, padding: '14px 16px',
            background: dragging ? 'rgba(99,102,241,0.06)' : 'transparent',
            cursor: 'pointer', transition: 'all .18s',
            display: 'flex', alignItems: 'center', gap: 12,
            minHeight: scanning || preview ? 80 : 60,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {scanning && !preview ? (
            <>
              <span style={{ fontSize: 20 }}>📑</span>
              <div style={{ fontSize: 12, color: '#818CF8' }}>
                <span className="spin" style={{ marginRight: 5 }}>⟳</span>
                {ocrErr ? '' : 'Extracting…'}
              </div>
            </>
          ) : preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" style={{
                height: 52, width: 'auto', borderRadius: 5,
                opacity: scanning ? 0.5 : 1, transition: 'opacity .3s',
              }} />
              {scanning && <div className="scan-beam" key={scanKey} />}
              {scanning && <div style={{ fontSize: 12, color: '#818CF8' }}><span className="spin" style={{ marginRight: 5 }}>⟳</span>OCR…</div>}
              {!scanning && <div style={{ fontSize: 12, color: '#64748B' }}>Image loaded — select another to replace</div>}
            </>
          ) : (
            <>
              <span style={{ fontSize: 18, opacity: 0.5 }}>📄</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#64748B' }}>Upload document</div>
                <div style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>PNG · JPG · WEBP · PDF</div>
              </div>
            </>
          )}
          {ocrErr && !scanning && (
            <div style={{ fontSize: 11.5, color: '#EF4444', marginLeft: 8 }}>⚠ {ocrErr}</div>
          )}
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
            onChange={e => processFile(e.target.files[0])} />
        </div>

        {/* Text viewer */}
        <div style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Preview
          {snips.length > 0 && <span style={{ color: '#F59E0B', marginLeft: 8, fontWeight: 500 }}>· {snips.length} highlighted</span>}
        </div>
        <div className="glass" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            padding: '5px 12px', fontSize: 10.5, color: '#1E293B',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', gap: 8, flexShrink: 0,
          }}>
            <span>{text.length.toLocaleString()} chars</span>
            <span>·</span>
            <span>{lines.length} lines</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
            {lines.map((line, i) => {
              const hi = snips.some(s => line.includes(s));
              return (
                <div key={i} className={hi ? 'highlight-amber' : ''} style={{ display: 'flex', gap: 9 }}>
                  <span className="mono" style={{ fontSize: 9, color: '#1E293B', minWidth: 20, textAlign: 'right', paddingTop: 3, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 11.5, color: hi ? '#FDE68A' : '#475569', lineHeight: 1.7 }}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analyze button */}
        <button className="btn-primary" onClick={analyze} disabled={analyzing || !text}
          style={{ padding: '12px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
          {analyzing ? <><span className="spin">⟳</span> Analyzing…</> : '⚡ Analyze Document'}
        </button>
      </div>

      {/* ── Right panel: results ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Mapping Results
          </div>
          {results.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.09)', border: '1px solid rgba(16,185,129,0.18)' }}>
                ✓ {confirmedCount} verified
              </span>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#F59E0B', background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.18)' }}>
                {results.length - confirmedCount} pending
              </span>
            </div>
          )}
        </div>

        {/* Scrollable results */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Live stream */}
          {streamText && analyzing && (
            <div className="glass-dark" style={{ borderRadius: 9, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{
                padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: 10.5, color: '#334155', display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
                <span className="mono">streaming llama-3.3-70b…</span>
              </div>
              <div ref={streamRef} style={{
                maxHeight: 130, overflowY: 'auto', padding: '9px 12px',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {streamText}
                <span style={{ animation: 'streamCursor 0.8s step-end infinite', color: '#6366F1' }}>▋</span>
              </div>
            </div>
          )}

          {/* Skeleton */}
          {analyzing && !results.length && [1, 2, 3].map(i => (
            <div key={i} className="glass pulse" style={{
              borderRadius: 9, padding: 14,
              borderLeft: `3px solid ${i % 2 ? '#6366F130' : '#8B5CF630'}`,
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 55, height: 18, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ width: 32, height: 18, borderRadius: 5, background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div style={{ width: '55%', height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />
              <div style={{ height: 40, borderRadius: 6, background: 'rgba(245,158,11,0.05)', borderLeft: '2px solid rgba(245,158,11,0.12)' }} />
            </div>
          ))}

          {error && (
            <div style={{ padding: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.16)', borderRadius: 9, fontSize: 13, color: '#EF4444' }}>
              ⚠ {error}
            </div>
          )}

          {!analyzing && !error && results.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>🧠</div>
              <div style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>Select a document and click Analyze</div>
              <div style={{ fontSize: 12, color: '#1E293B', maxWidth: 260, lineHeight: 1.7 }}>
                Qwen3-32b reads legal semantics and maps provisions to RDTII indicators — streamed live
              </div>
            </div>
          )}

          {results.map((r, idx) => (
            <ResultCard key={idx} result={r} idx={idx}
              onUpdate={(i, status, reasoning) =>
                setResults(prev => prev.map((x, j) => j === i ? { ...x, status, reasoning } : x))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
