import { useState } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { mockPayments, mockPayouts, Payment, Payout, formatPaiseExact } from '../data/mockData';
import { Search, Play, AlertCircle } from 'lucide-react';

const paymentStatusBadge: Record<string, string> = {
  captured:'badge-success', failed:'badge-danger', refunded:'badge-amber', created:'badge-blue',
};

const payoutStatusBadge: Record<string, string> = {
  paid:'badge-success', pending:'badge-amber', processing:'badge-blue',
  failed:'badge-danger', held:'badge-danger',
};

function PayoutsTab({ payouts, onRunPayout }: { payouts: Payout[]; onRunPayout: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const pending = payouts.filter(p => p.status === 'pending').length;
  const pendingAmt = payouts.filter(p => p.status === 'pending').reduce((a, p) => a + p.net, 0);

  return (
    <>
      {pending > 0 && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, background:'var(--amber-dim)', border:'1px solid rgba(185,121,11,0.2)', borderRadius:'var(--r-sm)', padding:'12px 16px' }}>
          <div>
            <span style={{ fontWeight:600, fontSize:14 }}>{pending} pending payout{pending > 1 ? 's' : ''}</span>
            <span style={{ color:'var(--slate)', fontSize:13, marginLeft:8 }}>Total: <span className="text-mono fw-600">{formatPaiseExact(pendingAmt)}</span></span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setConfirm(true)}>
            <Play size={13} /> Run Payouts
          </button>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Technician</th>
              <th>Gross ₹</th>
              <th>Commission ₹</th>
              <th>Net Payout ₹</th>
              <th>Status</th>
              <th>Transfer ID</th>
              <th>Settled At</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id}>
                <td><span className="text-mono fw-600 text-orange" style={{ fontSize:13 }}>{p.bookingCode}</span></td>
                <td style={{ fontSize:13, fontWeight:500 }}>{p.technician}</td>
                <td className="text-mono" style={{ fontSize:13 }}>{formatPaiseExact(p.gross)}</td>
                <td className="text-mono text-danger" style={{ fontSize:13 }}>−{formatPaiseExact(p.commission)}</td>
                <td><span className="text-mono fw-600 text-success" style={{ fontSize:14 }}>{formatPaiseExact(p.net)}</span></td>
                <td><span className={`badge ${payoutStatusBadge[p.status]}`} style={{ fontSize:11 }}>{p.status}</span></td>
                <td style={{ fontSize:12 }}>{p.transferId || <span className="text-slate">—</span>}</td>
                <td style={{ fontSize:12, color:'var(--slate)' }}>
                  {p.settledAt ? new Date(p.settledAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <Modal open title="Run Payouts" onClose={() => setConfirm(false)} size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="btn btn-success" onClick={() => { onRunPayout(); setConfirm(false); }}>
                Confirm & Run
              </button>
            </>
          }
        >
          <div className="alert alert-warning">
            <AlertCircle size={15} style={{ flexShrink:0 }} />
            This will initiate Razorpay Route transfers for <strong>{pending} payout{pending > 1 ? 's' : ''}</strong> totalling <strong>{formatPaiseExact(pendingAmt)}</strong>. This action cannot be undone.
          </div>
        </Modal>
      )}
    </>
  );
}

export default function Payments() {
  const [tab, setTab] = useState<'payments' | 'payouts'>('payments');
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState(mockPayments);
  const [payouts, setPayouts] = useState(mockPayouts);

  const filteredPayments = payments.filter(p =>
    !search ||
    p.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    p.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleRunPayouts = () => {
    setPayouts(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'processing' as const } : p));
  };

  const totalGmv = payments.filter(p => p.status === 'captured').reduce((a, p) => a + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <TopBar title="Payments & Payouts" subtitle="Track all payment transactions and technician payouts" />
      <div className="page-body">
        {/* Summary cards */}
        <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4, 1fr)', marginBottom:24 }}>
          {[
            { label:'Total Captured', value: formatPaiseExact(totalGmv), color:'var(--success)' },
            { label:'Total Refunded', value: formatPaiseExact(totalRefunded), color:'var(--danger)' },
            { label:'Pending Payouts', value: String(payouts.filter(p => p.status === 'pending').length), color:'var(--amber)' },
            { label:'Failed Payments', value: String(payments.filter(p => p.status === 'failed').length), color:'var(--danger)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:16 }}>
              <div style={{ fontSize:12, color:'var(--slate)', fontWeight:600, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
          <button className={`tab-btn ${tab === 'payouts' ? 'active' : ''}`} onClick={() => setTab('payouts')}>Payouts</button>
        </div>

        {tab === 'payments' && (
          <>
            <div className="filter-bar">
              <div className="search-input-wrap">
                <Search size={14} className="search-icon" />
                <input className="search-input" placeholder="Search by booking, customer…" value={search} onChange={e => setSearch(e.target.value)} id="payments-search" />
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Kind</th>
                    <th>Amount ₹</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Gateway ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(p => (
                    <tr key={p.id}>
                      <td><span className="text-mono fw-600 text-orange" style={{ fontSize:13 }}>{p.bookingCode}</span></td>
                      <td style={{ fontSize:13 }}>{p.customer}</td>
                      <td><span className={`badge ${p.kind === 'refund' ? 'badge-danger' : 'badge-blue'}`} style={{ fontSize:11 }}>{p.kind}</span></td>
                      <td><span className="text-mono fw-600" style={{ fontSize:14 }}>{formatPaiseExact(p.amount)}</span></td>
                      <td><span className={`badge ${paymentStatusBadge[p.status]}`} style={{ fontSize:11 }}>{p.status}</span></td>
                      <td style={{ fontSize:12 }}>{p.method}</td>
                      <td style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--slate)' }}>{p.gatewayId}</td>
                      <td style={{ fontSize:12, color:'var(--slate)' }}>
                        {new Date(p.date).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'payouts' && (
          <PayoutsTab payouts={payouts} onRunPayout={handleRunPayouts} />
        )}
      </div>
    </>
  );
}
