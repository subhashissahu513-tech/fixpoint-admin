import { useState } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { mockFraudFlags, FraudFlag } from '../data/mockData';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export default function Fraud() {
  const [flags, setFlags] = useState(mockFraudFlags);
  const [viewed, setViewed] = useState<FraudFlag | null>(null);
  const [tab, setTab] = useState<'open' | 'resolved'>('open');

  const resolve = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, resolved: true } : f));
    setViewed(null);
  };

  const filtered = flags.filter(f => tab === 'open' ? !f.resolved : f.resolved);
  const openCount = flags.filter(f => !f.resolved).length;

  const scoreColor = (score: number) => {
    if (score >= 0.8) return 'var(--danger)';
    if (score >= 0.6) return '#e88c00';
    return 'var(--slate)';
  };

  return (
    <>
      <TopBar title="Fraud Flags" subtitle="AI-detected anomalies and risk signals" />
      <div className="page-body">
        {openCount > 0 && (
          <div className="alert alert-danger mb-16">
            <AlertTriangle size={15} style={{ flexShrink:0 }} />
            <div><strong>{openCount} open flag{openCount > 1 ? 's' : ''}</strong> require your attention. High-score flags should be reviewed immediately.</div>
          </div>
        )}

        <div className="tabs">
          <button className={`tab-btn ${tab === 'open' ? 'active' : ''}`} onClick={() => setTab('open')}>
            Open ({flags.filter(f => !f.resolved).length})
          </button>
          <button className={`tab-btn ${tab === 'resolved' ? 'active' : ''}`} onClick={() => setTab('resolved')}>
            Resolved ({flags.filter(f => f.resolved).length})
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CheckCircle size={28} color="var(--success)" /></div>
            <div className="empty-state-title">{tab === 'open' ? 'No open flags' : 'No resolved flags'}</div>
            <div className="empty-state-sub">{tab === 'open' ? 'All caught up — no anomalies detected.' : 'Resolve flags to see them here.'}</div>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map(flag => (
              <div key={flag.id} className="card" style={{ padding:16, borderLeft:`3px solid ${scoreColor(flag.score)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <span className={`badge ${flag.type === 'technician' ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize:11 }}>
                    {flag.type}
                  </span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:700, color:scoreColor(flag.score) }}>
                    Risk {(flag.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{flag.subject}</div>
                <div style={{ fontSize:12.5, color:'var(--slate)', lineHeight:1.5, marginBottom:12 }}>{flag.reason}</div>
                <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'var(--slate)' }}>
                    {new Date(flag.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                  </span>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setViewed(flag)}><Eye size={12} /> Details</button>
                    {!flag.resolved && (
                      <button className="btn btn-success btn-sm" onClick={() => resolve(flag.id)}>
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewed && (
        <Modal open title="Fraud Flag Details" onClose={() => setViewed(null)} size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setViewed(null)}>Close</button>
              {!viewed.resolved && (
                <button className="btn btn-success" onClick={() => resolve(viewed.id)}>
                  <CheckCircle size={14} /> Mark Resolved
                </button>
              )}
            </>
          }
        >
          <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:13 }}>
            <div><span className="text-slate">Type:</span> <span className={`badge ${viewed.type === 'technician' ? 'badge-orange' : 'badge-purple'}`}>{viewed.type}</span></div>
            <div><span className="text-slate">Subject:</span> <strong>{viewed.subject}</strong></div>
            <div><span className="text-slate">Risk Score:</span> <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:scoreColor(viewed.score) }}>{(viewed.score * 100).toFixed(0)}%</span></div>
            <div><span className="text-slate">Reason:</span> {viewed.reason}</div>
            <div><span className="text-slate">Detected:</span> {new Date(viewed.createdAt).toLocaleString('en-IN')}</div>
            <div><span className="text-slate">Status:</span> <span className={`badge ${viewed.resolved ? 'badge-success' : 'badge-danger'}`}>{viewed.resolved ? 'Resolved' : 'Open'}</span></div>
            <div className="alert alert-info" style={{ margin:0 }}>
              ℹ️ Review the related bookings and take appropriate action (suspend technician, issue warning, or dismiss).
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
