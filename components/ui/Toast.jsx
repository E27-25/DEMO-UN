'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type, exiting: false }]);
    setTimeout(() => {
      setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x));
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 320);
    }, 3200);
  }, []);

  const icon  = { success: '✓', error: '✕', info: 'ℹ' };
  const color = { success: '#10B981', error: '#EF4444', info: '#6366F1' };

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} className={t.exiting ? 'toast-exit' : 'toast-enter'} style={{
            padding: '11px 16px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#12121E', border: `1px solid ${color[t.type]}30`,
            boxShadow: `0 4px 20px rgba(0,0,0,.5), 0 0 0 1px ${color[t.type]}20`,
            fontSize: 13, color: '#E2E8F0', minWidth: 220, maxWidth: 340,
          }}>
            <span style={{ color: color[t.type], fontWeight: 700, fontSize: 14 }}>{icon[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
