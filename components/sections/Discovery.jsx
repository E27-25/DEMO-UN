'use client';
import { useState, useRef, useCallback } from 'react';
import Tag from '../ui/Tag';
import { useToast } from '../ui/Toast';
import { VAULT_DOCS } from '@/lib/data';

const TYPHOON_KEY = 'sk-1SdK6jnHrTUcL1Oequec6MWWWjGxUee57HM2qJ36WBHTgXTD';

export default function Discovery({ onSendToIntelligence }) {
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scanKey, setScanKey] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [ocrErr, setOcrErr] = useState('');
  const [ocrDone, setOcrDone] = useState(false);
  const fileRef = useRef();
  const toast = useToast();

  const countries = ['All', ...new Set(VAULT_DOCS.map(d => d.country))];

  const filtered = VAULT_DOCS.filter(d => {
    const q = search.toLowerCase();
    return (
      (!q || d.title.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || String(d.year).includes(q)) &&
      (filterCountry === 'All' || d.country === filterCountry)
    );
  });

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
            { type: 'text', text: 'Extract all text from this legal document. Preserve article numbers, paragraph structure, and formatting. Output plain text only, no commentary.' },
          ]}],
          max_tokens: 4096,
        }),
      });
      data = await r.json();
    }
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || '';
  }, []);

  const processPDF = useCallback(async file => {
    setPreview(null); setOcrDone(false); setOcrText(''); setOcrErr('');
    setScanning(true); setScanKey(k => k + 1);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((res, rej) => {
        reader.onload = e => res(e.target.result.split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const r = await fetch('/api/extract-pdf', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);

      setOcrText(data.text); setOcrDone(true);
      toast(`PDF extracted — ${data.text.length.toLocaleString()} chars · ${data.pages} page${data.pages !== 1 ? 's' : ''}`);
    } catch (err) {
      setOcrErr(err.message);
      toast('PDF extraction failed: ' + err.message, 'error');
    } finally {
      setScanning(false);
    }
  }, [toast]);

  const processFile = useCallback(async file => {
    if (!file) return;
    if (file.type === 'application/pdf') { processPDF(file); return; }
    if (!file.type.startsWith('image/')) {
      toast('Supported formats: images (PNG/JPG/WEBP) and PDF', 'error'); return;
    }
    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target.result;
      setPreview(dataUrl); setOcrDone(false); setOcrText(''); setOcrErr('');
      setScanning(true); setScanKey(k => k + 1);
      try {
        const base64 = dataUrl.split(',')[1];
        const txt = await ocrImage(base64, file.type);
        setOcrText(txt); setOcrDone(true);
        toast(`OCR complete — ${txt.length.toLocaleString()} characters extracted`);
      } catch (err) {
        setOcrErr(err.message);
        toast('OCR failed: ' + err.message, 'error');
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  }, [ocrImage, processPDF, toast]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto', paddingBottom: 24 }}>
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(34,211,238,0.04) 100%)',
        border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14,
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Document Vault &amp; OCR
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            {VAULT_DOCS.length} laws indexed · Typhoon OCR for multilingual extraction
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['11', 'Laws'], ['9', 'Countries'], ['96%', 'Accuracy']].map(([v, l]) => (
            <div key={l} style={{
              padding: '8px 14px', borderRadius: 10, textAlign: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#818CF8' }}>{v}</div>
              <div style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Left: Vault */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {/* Search + filter */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#334155' }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search laws, countries, years…"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 9, color: '#E2E8F0', padding: '9px 12px 9px 34px',
                  fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9, color: '#94A3B8', padding: '9px 16px', fontSize: 13, cursor: 'pointer',
            }}>
              {countries.map(c => <option key={c} value={c} style={{ background: '#0D0D18' }}>{c}</option>)}
            </select>
          </div>

          {/* Cards grid */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {filtered.map(doc => (
                <div key={doc.id} className="glass card-hover" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <span style={{ fontSize: 20 }}>{doc.flag}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                      color: '#818CF8', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
                    }}>{doc.country}</span>
                    <span style={{ fontSize: 11, color: '#334155', marginLeft: 'auto' }}>{doc.year}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.4, marginBottom: 9 }}>
                    {doc.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#475569' }}>{doc.lang}</span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 600, color: '#10B981',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      Indexed
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 20px', color: '#334155' }}>
                  <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>🔍</div>
                  <div style={{ fontSize: 13, color: '#475569' }}>No documents match your search</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Upload */}
        <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 }}>
            Upload New Document
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#6366F1' : 'rgba(99,102,241,0.25)'}`,
              borderRadius: 14, padding: 20,
              background: dragging ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.02)',
              cursor: 'pointer', transition: 'all .2s ease',
              position: 'relative', overflow: 'hidden',
              minHeight: 170, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {scanning && !preview ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📑</div>
                <div style={{ fontSize: 12, color: '#818CF8', fontWeight: 500 }}>
                  <span className="spin" style={{ marginRight: 6 }}>⟳</span>Extracting PDF text…
                </div>
              </div>
            ) : preview ? (
              <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="uploaded doc" style={{
                  maxHeight: 130, maxWidth: '100%', borderRadius: 8,
                  opacity: scanning ? 0.5 : 1, transition: 'opacity .3s',
                }} />
                {scanning && <div key={scanKey} className="scan-beam" />}
                {scanning && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#818CF8', fontWeight: 500 }}>
                    <span className="spin" style={{ marginRight: 6 }}>⟳</span>Typhoon OCR extracting…
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94A3B8', marginBottom: 5 }}>
                  Drop document here
                </div>
                <div style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.6 }}>
                  PNG · JPG · WEBP · PDF<br />Typhoon OCR · Multilingual
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
              onChange={e => processFile(e.target.files[0])} />
          </div>

          {/* Supported languages */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['🇹🇭 Thai', '🇱🇦 Lao', '🇰🇭 Khmer', '🇲🇲 Burmese', '🇻🇳 Viet'].map(l => (
              <span key={l} style={{
                padding: '3px 9px', borderRadius: 20, fontSize: 10.5,
                color: '#475569', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>{l}</span>
            ))}
          </div>

          {(ocrText || ocrErr) && (
            <div className="glass" style={{ overflow: 'hidden' }}>
              <div style={{
                padding: '8px 14px', background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {ocrErr
                  ? <span style={{ color: '#EF4444' }}>⚠ {ocrErr}</span>
                  : <>
                      <span style={{ color: '#10B981', fontWeight: 600 }}>✓ OCR Complete</span>
                      <span style={{ color: '#1E293B' }}>·</span>
                      <span style={{ color: '#64748B' }}>{ocrText.length.toLocaleString()} chars</span>
                    </>
                }
              </div>
              {ocrText && (
                <div style={{ maxHeight: 180, overflowY: 'auto', padding: '10px 14px' }}>
                  {ocrText.split('\n').slice(0, 50).map((line, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 1 }}>
                      <span className="mono" style={{ fontSize: 9.5, color: '#1E293B', minWidth: 22, textAlign: 'right', paddingTop: 2, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.65 }}>{line || ' '}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {ocrDone && ocrText && (
            <button className="btn-primary" onClick={() => onSendToIntelligence(ocrText)}
              style={{ padding: '13px 20px', borderRadius: 10, fontSize: 14, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Send to Intelligence Layer →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
