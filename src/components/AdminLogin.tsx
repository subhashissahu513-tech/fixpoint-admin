import { useState } from 'react';
import { Zap, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@fixpoint.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter admin email or username');
      return;
    }
    if (!password) {
      setError('Please enter admin password');
      return;
    }

    setLoading(true);

    // Standard Super Admin credentials verification
    setTimeout(() => {
      if (
        (email.trim().toLowerCase() === 'admin@fixpoint.in' || email.trim().toLowerCase() === 'superadmin' || email.trim().toLowerCase() === 'admin') &&
        (password === 'admin' || password === 'admin123' || password === 'fixpoint2026')
      ) {
        const adminUser = {
          email: email.trim(),
          name: 'Super Admin',
          role: 'super_admin',
          token: 'fx_adm_' + Date.now(),
        };
        localStorage.setItem('fixpoint_admin_user', JSON.stringify(adminUser));
        onLoginSuccess(adminUser);
      } else {
        setError('Invalid credentials. Default is admin@fixpoint.in / admin');
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = () => {
    setEmail('admin@fixpoint.in');
    setPassword('admin');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #1a1e2d 0%, #0d0f18 100%)',
      padding: 20,
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#131622',
        border: '1px solid #23283b',
        borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,106,43,0.1)',
        padding: '36px 32px',
        color: '#fff',
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #FF6A2B 0%, #e05315 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(255,106,43,0.4)',
            marginBottom: 14,
          }}>
            <Zap size={28} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
            FixPoint Admin
          </h1>
          <p style={{ fontSize: 13, color: '#8d95ab', marginTop: 4 }}>
            Sign in to access Super Admin operations console
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(229, 62, 62, 0.15)',
            border: '1px solid rgba(229, 62, 62, 0.4)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            color: '#fc8181',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8d95ab', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Admin Email / Username
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, color: '#656e87' }} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fixpoint.in"
                style={{
                  width: '100%',
                  background: '#0a0c13',
                  border: '1px solid #23283b',
                  borderRadius: 10,
                  padding: '12px 14px 12px 40px',
                  fontSize: 14,
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8d95ab', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Password
              </label>
            </div>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, color: '#656e87' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin)"
                style={{
                  width: '100%',
                  background: '#0a0c13',
                  border: '1px solid #23283b',
                  borderRadius: 10,
                  padding: '12px 14px 12px 40px',
                  fontSize: 14,
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, #FF6A2B 0%, #e05315 100%)',
              border: 'none',
              borderRadius: 10,
              padding: '13px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(255,106,43,0.35)',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Console'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid #1f2434',
          textAlign: 'center',
        }}>
          <button
            type="button"
            onClick={handleQuickDemo}
            style={{
              background: 'rgba(255, 106, 43, 0.12)',
              border: '1px dashed rgba(255, 106, 43, 0.4)',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12,
              color: '#FF6A2B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={13} />
            Auto-fill Default Credentials (admin@fixpoint.in / admin)
          </button>
        </div>
      </div>
    </div>
  );
}
