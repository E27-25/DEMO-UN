'use client';
import { useState } from 'react';
import Tag from './Tag';
import { useToast } from './Toast';
import { confColor } from '@/lib/data';

export default function ResultCard({ result, idx, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(result.reasoning || '');
  const toast = useToast();
  const pc = result.pillar === 6 ? '#6366F1' : '#8B5CF6';

  const act = status => {
    onUpdate(idx, status, editing ? editText : result.reasoning);
    setEditing(false);
    toast(
      status === 'confirmed'
        ? `✓ Indicator ${result.indicator_id} verified`
        : `Indicator ${result.indicator_id} rejected`,
      status === 'confirmed' ? 'success' : 'info',
    );
  };

  return (
    <div className="fade-up glass" style={{ borderLeft: `3px solid ${pc}`, padding: 14 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9, flexWrap: 'wrap' }}>
        <Tag color={pc}>Pillar {result.pillar}</Tag>
        <span className="mono" style={{
          padding: '2px 9px', borderRadius: 6,
          background: 'rgba(255,255,255,0.07)',
          fontSize: 12, fontWeight: 700, color: '#F8FAFC',
        }}>{result.indicator_id}</span>
        {result.status === 'confirmed' && <Tag color="#10B981">✅ Verified</Tag>}
        {result.status === 'rejected'  && <Tag color="#EF4444">❌ Rejected</Tag>}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 52, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div className="bar-in" style={{
              height: '100%', width: `${result.confidence}%`,
              background: confColor(result.confidence), borderRadius: 2,
            }} />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: confColor(result.confidence) }}>
            {result.confidence}%
          </span>
        </div>
      </div>

      {/* Name */}
      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#F8FAFC', marginBottom: 9 }}>
        {result.indicator_name}
      </div>

      {/* Evidence blockquote */}
      {result.evidence_text && (
        <div style={{
          background: 'rgba(245,158,11,0.07)',
          borderLeft: '3px solid rgba(245,158,11,0.45)',
          padding: '8px 12px', borderRadius: '0 6px 6px 0',
          marginBottom: 9, fontSize: 12.5, color: '#FDE68A',
          fontStyle: 'italic', lineHeight: 1.65,
        }}>
          &ldquo;{result.evidence_text}&rdquo;
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {result.paragraph_ref && <Tag color="#06B6D4" size={10.5}>{result.paragraph_ref}</Tag>}
        {result.concept_detected && (
          <Tag color="#94A3B8" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.08)" size={10.5}>
            🔍 {result.concept_detected}
          </Tag>
        )}
      </div>

      {/* Reasoning */}
      {!editing && result.reasoning && (
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.65, marginBottom: result.status === 'pending' ? 10 : 0 }}>
          {result.reasoning}
        </div>
      )}

      {/* Inline edit */}
      {editing && (
        <div style={{ marginBottom: 10 }}>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={3}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
              color: '#CBD5E1', fontSize: 12, padding: '8px 10px', lineHeight: 1.6,
              outline: 'none', fontFamily: 'Inter, sans-serif',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button className="btn-primary" onClick={() => act('confirmed')}
              style={{ flex: 1, padding: '7px 0', borderRadius: 6, fontSize: 12 }}>
              Save &amp; Confirm
            </button>
            <button className="btn-ghost" onClick={() => setEditing(false)}
              style={{ flex: 1, padding: '7px 0', borderRadius: 6, fontSize: 12 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {result.status === 'pending' && !editing && (
        <div style={{ display: 'flex', gap: 7, marginTop: 4 }}>
          {[
            { label: '✅ Confirm', color: '#10B981', fn: () => act('confirmed') },
            { label: '✏️ Edit',   color: '#F59E0B', fn: () => setEditing(true) },
            { label: '❌ Reject', color: '#EF4444', fn: () => act('rejected') },
          ].map(b => (
            <button key={b.label} onClick={b.fn} style={{
              flex: 1, padding: '7px 0', borderRadius: 6,
              background: `${b.color}12`, border: `1px solid ${b.color}28`,
              color: b.color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'background .15s', fontFamily: 'Inter, sans-serif',
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${b.color}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${b.color}12`}
            >{b.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
