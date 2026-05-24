'use client';
import { useState, useCallback } from 'react';

export default function Landing({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = useCallback(() => {
    setExiting(true);
    setTimeout(onEnter, 380);
  }, [onEnter]);

  return (
    <div
      className={`landing-page${exiting ? ' exiting' : ''}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#050508',
      }}
    >
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 520 }}>
        {/* Label */}
        <div className="hero-text hero-text-d1" style={{ marginBottom: 28 }}>
          <span style={{
            padding: '4px 14px', borderRadius: 20,
            fontSize: 11.5, fontWeight: 500, letterSpacing: '.04em',
            color: '#475569', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            RDTII 2024 · Built for ESCAP
          </span>
        </div>

        {/* Wordmark */}
        <div className="hero-text hero-text-d2" style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#334155' }}>
          RegMap AI
        </div>

        {/* Headline */}
        <h1 className="hero-text hero-text-d2" style={{
          fontSize: 54, fontWeight: 800, lineHeight: 1.06,
          letterSpacing: '-2.5px', color: '#F1F5F9',
          margin: '0 0 6px',
        }}>
          Regulatory
        </h1>
        <h1 className="hero-text hero-text-d3 animated-gradient-text" style={{
          fontSize: 54, fontWeight: 800, lineHeight: 1.06,
          letterSpacing: '-2.5px', margin: '0 0 28px',
        }}>
          Intelligence
        </h1>

        {/* Subtitle */}
        <p className="hero-text hero-text-d3" style={{
          fontSize: 15.5, color: '#475569', lineHeight: 1.8,
          margin: '0 0 40px',
        }}>
          Map ASEAN digital trade laws to RDTII indicators.<br />
          Typhoon OCR · Qwen3-32b · Human-verified.
        </p>

        {/* CTA */}
        <div className="hero-text hero-text-d4">
          <button className="cta-button" onClick={handleEnter}
            style={{ padding: '13px 36px', borderRadius: 11, fontSize: 14.5 }}>
            <span>Enter Platform →</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hero-text hero-text-d5" style={{
          display: 'flex', gap: 0, justifyContent: 'center',
          marginTop: 52, paddingTop: 36,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          {[['2,341', 'Indicators Mapped'], ['9', 'ASEAN Countries'], ['96%', 'OCR Accuracy']].map(([v, l], i) => (
            <div key={l} style={{
              textAlign: 'center', flex: 1,
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }} className="gradient-text">{v}</div>
              <div style={{ fontSize: 11, color: '#1E293B', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
