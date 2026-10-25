import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'rgba(9, 13, 22, 0.75)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: '#131622',
        border: '1px solid #23283b',
        borderRadius: 18,
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(239, 68, 68, 0.1)',
        padding: '28px 24px',
        color: '#fff',
        fontFamily: 'var(--font-body)',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#656e87',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171',
            flexShrink: 0,
          }}>
            <LogOut size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>
              Sign Out of Admin Console?
            </h3>
            <p style={{ fontSize: 13, color: '#8d95ab', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to end your Super Admin session? You will be redirected to the secure login screen.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid #1f2434',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#1a1f30',
              border: '1px solid #283049',
              borderRadius: 9,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: 9,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            }}
          >
            <LogOut size={14} />
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
