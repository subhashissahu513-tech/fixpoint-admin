import { useState } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { mockBookings, Booking, BookingStatus, formatPaiseExact } from '../data/mockData';
import { Search, Filter, Eye, RefreshCw, X, MessageSquare, AlertTriangle } from 'lucide-react';

const statusColors: Record<string, string> = {
  CONFIRMED:'badge-blue', DISPATCHING:'badge-amber', ASSIGNED:'badge-purple',
  EN_ROUTE:'badge-teal', ARRIVED:'badge-teal', DIAGNOSING:'badge-teal',
  QUOTE_SENT:'badge-amber', IN_PROGRESS:'badge-blue', WORK_DONE:'badge-success',
  PAYMENT_DUE:'badge-orange', COMPLETED:'badge-success', CANCELLED:'badge-danger',
  DISPUTED:'badge-danger', REFUNDED:'badge-slate', PAYMENT_PENDING:'badge-amber',
};

const timeline = [
  { status:'CONFIRMED', label:'Confirmed' },
  { status:'DISPATCHING', label:'Dispatching' },
  { status:'ASSIGNED', label:'Assigned' },
  { status:'EN_ROUTE', label:'En Route' },
  { status:'ARRIVED', label:'Arrived' },
  { status:'DIAGNOSING', label:'Diagnosing' },
  { status:'QUOTE_SENT', label:'Quote Sent' },
  { status:'IN_PROGRESS', label:'In Progress' },
  { status:'WORK_DONE', label:'Work Done' },
  { status:'PAYMENT_DUE', label:'Payment Due' },
  { status:'COMPLETED', label:'Completed' },
];

function BookingDetail({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const currentIdx = timeline.findIndex(t => t.status === booking.status);

  return (
    <Modal open title={`Booking ${booking.code}`} onClose={onClose} size="lg"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          {booking.status === 'DISPUTED' && (
            <button className="btn btn-danger">Resolve Dispute</button>
          )}
          {!['COMPLETED','CANCELLED','REFUNDED'].includes(booking.status) && (
            <button className="btn btn-outline">Reassign Technician</button>
          )}
          {!['COMPLETED','CANCELLED','REFUNDED'].includes(booking.status) && (
            <button className="btn btn-danger btn-sm">Force Cancel</button>
          )}
        </>
      }
    >
      {/* Header info */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div style={{ background:'var(--paper-soft)', borderRadius:'var(--r-sm)', padding:14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Customer</div>
          <div style={{ fontWeight:600 }}>{booking.customer}</div>
          <div className="text-sm text-slate">{booking.phone}</div>
          <div className="text-sm text-slate mt-4">{booking.address}</div>
        </div>
        <div style={{ background:'var(--paper-soft)', borderRadius:'var(--r-sm)', padding:14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Technician</div>
          {booking.technician ? (
            <>
              <div style={{ fontWeight:600 }}>{booking.technician}</div>
              <div className="text-sm text-slate">Assigned</div>
            </>
          ) : (
            <div className="text-sm text-slate">Not yet assigned</div>
          )}
        </div>
        <div style={{ background:'var(--paper-soft)', borderRadius:'var(--r-sm)', padding:14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Services</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {booking.services.map(s => (
              <span key={s} className="badge badge-slate" style={{ fontSize:11 }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ background:'var(--paper-soft)', borderRadius:'var(--r-sm)', padding:14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Financials</div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span className="text-slate">Visit Charge</span>
              <span className="text-mono fw-600">{formatPaiseExact(booking.visitCharge)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span className="text-slate">Quote Total</span>
              <span className="text-mono fw-600">{booking.quoteTotal > 0 ? formatPaiseExact(booking.quoteTotal) : '—'}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span className="text-slate">Commission</span>
              <span className="text-mono fw-600 text-success">{booking.commission > 0 ? formatPaiseExact(booking.commission) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom:16 }}>
        <div className="text-xs text-slate fw-600" style={{ textTransform:'uppercase', letterSpacing:.5, marginBottom:12 }}>Booking Timeline</div>
        <div style={{ display:'flex', gap:0, overflowX:'auto', paddingBottom:4 }}>
          {timeline.map((step, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            const cancelled = booking.status === 'CANCELLED';
            return (
              <div key={step.status} style={{ display:'flex', alignItems:'center', minWidth:'fit-content' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700,
                    background: cancelled && active ? 'var(--danger-dim)' : active ? 'var(--orange-dim)' : done ? 'var(--success-dim)' : 'var(--paper-soft)',
                    border: `2px solid ${cancelled && active ? 'var(--danger)' : active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--line)'}`,
                    color: cancelled && active ? 'var(--danger)' : active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--slate)',
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize:9, fontWeight:600, color: active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--slate)', whiteSpace:'nowrap' }}>
                    {step.label}
                  </div>
                </div>
                {i < timeline.length - 1 && (
                  <div style={{ width:24, height:2, background: done ? 'var(--success)' : 'var(--line)', margin:'0 2px', marginBottom:20, flexShrink:0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <button className="btn btn-outline btn-sm"><MessageSquare size={13} /> View Chat</button>
        <button className="btn btn-outline btn-sm"><Eye size={13} /> View Invoice</button>
        {booking.status === 'DISPUTED' && (
          <div className="alert alert-danger" style={{ margin:0, flex:1, padding:'8px 12px', fontSize:12 }}>
            <AlertTriangle size={13} style={{ flexShrink:0 }} />
            This booking is under dispute. Review before taking action.
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState(mockBookings);

  const statuses: (BookingStatus | 'ALL')[] = [
    'ALL', 'CONFIRMED', 'DISPATCHING', 'ASSIGNED', 'EN_ROUTE',
    'ARRIVED', 'QUOTE_SENT', 'IN_PROGRESS', 'WORK_DONE', 'PAYMENT_DUE',
    'COMPLETED', 'CANCELLED', 'DISPUTED',
  ];

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      (b.technician || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <TopBar title="Bookings" subtitle="Search, filter, and manage all service bookings" />
      <div className="page-body">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by code, customer, technician…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="bookings-search"
            />
          </div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', flex:1 }}>
            {statuses.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All' : s.replace('_',' ')}
                {s !== 'ALL' && (
                  <span style={{ marginLeft:4, background:'rgba(255,255,255,0.25)', borderRadius:99, padding:'0 5px', fontSize:10 }}>
                    {bookings.filter(b => b.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={13} /> Filter</button>
          <button className="btn btn-outline btn-sm"><RefreshCw size={13} /> Refresh</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer</th>
                <th>Technician</th>
                <th>Services</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Visit ₹</th>
                <th>Quote ₹</th>
                <th>Commission ₹</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign:'center', padding:40, color:'var(--slate)' }}>
                    No bookings found
                  </td>
                </tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <span className="text-mono fw-600" style={{ color:'var(--orange)', fontSize:13 }}>{b.code}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight:600, fontSize:13 }}>{b.customer}</div>
                    <div className="text-xs text-slate">{b.phone}</div>
                  </td>
                  <td>
                    {b.technician ? (
                      <div style={{ fontSize:13 }}>{b.technician}</div>
                    ) : (
                      <span className="text-slate text-sm">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap', maxWidth:180 }}>
                      {b.services.slice(0,2).map(s => (
                        <span key={s} className="badge badge-slate" style={{ fontSize:10 }}>{s}</span>
                      ))}
                      {b.services.length > 2 && (
                        <span className="badge badge-slate" style={{ fontSize:10 }}>+{b.services.length-2}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize:12 }}>{new Date(b.slot).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                    <div className="text-xs text-slate">{new Date(b.slot).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
                  </td>
                  <td>
                    <span className={`badge ${statusColors[b.status] || 'badge-slate'}`} style={{ fontSize:11 }}>
                      {b.status.replace('_',' ')}
                    </span>
                  </td>
                  <td className="text-mono" style={{ fontSize:13 }}>{formatPaiseExact(b.visitCharge)}</td>
                  <td className="text-mono" style={{ fontSize:13 }}>{b.quoteTotal > 0 ? formatPaiseExact(b.quoteTotal) : '—'}</td>
                  <td className="text-mono text-success" style={{ fontSize:13 }}>{b.commission > 0 ? formatPaiseExact(b.commission) : '—'}</td>
                  <td>
                    <button className="btn btn-ghost btn-icon" onClick={() => setSelected(b)} title="View">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
