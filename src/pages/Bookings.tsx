import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { formatPaiseExact } from '../data/mockData';
import { API_URL } from '../apiConfig';
import { Search, Filter, Eye, RefreshCw, MessageSquare, AlertTriangle, ClipboardList, CheckCircle2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  CONFIRMED: 'badge-blue',
  DISPATCHING: 'badge-amber',
  ASSIGNED: 'badge-purple',
  EN_ROUTE: 'badge-teal',
  ARRIVED: 'badge-teal',
  DIAGNOSING: 'badge-teal',
  QUOTE_SENT: 'badge-amber',
  IN_PROGRESS: 'badge-blue',
  WORK_DONE: 'badge-success',
  PAYMENT_DUE: 'badge-orange',
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-danger',
  DISPUTED: 'badge-danger',
  REFUNDED: 'badge-slate',
  PAYMENT_PENDING: 'badge-amber',
};

const timeline = [
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'DISPATCHING', label: 'Dispatching' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'EN_ROUTE', label: 'En Route' },
  { status: 'ARRIVED', label: 'Arrived' },
  { status: 'DIAGNOSING', label: 'Diagnosing' },
  { status: 'QUOTE_SENT', label: 'Quote Sent' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'WORK_DONE', label: 'Work Done' },
  { status: 'PAYMENT_DUE', label: 'Payment Due' },
  { status: 'COMPLETED', label: 'Completed' },
];

export interface LiveBooking {
  id: string;
  code: string;
  status: string;
  slot: string;
  visitFeePaise: number;
  finalTotalPaise: number;
  customer?: { name?: string; phone?: string; email?: string };
  address?: { flatNo?: string; building?: string; street?: string; city?: string; pincode?: string };
  services?: Array<{ id?: string; name: string; pricePaise?: number; qty?: number }>;
  technician?: { id?: string; name?: string; phone?: string; vehicle?: string; rating?: number };
  assignedTechnicianId?: string;
  assignedQueueNumber?: number;
  startOtp?: string;
  notes?: string;
  createdAt: string;
}

function BookingDetail({ booking, onClose, onRefresh }: { booking: LiveBooking; onClose: () => void; onRefresh: () => void }) {
  const currentIdx = timeline.findIndex(t => t.status === booking.status);
  const [cancelling, setCancelling] = useState(false);

  const handleForceCancel = async () => {
    if (!confirm(`Are you sure you want to cancel booking ${booking.code}?`)) return;
    setCancelling(true);
    try {
      await fetch(`${API_URL}/api/bookings/${booking.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      onRefresh();
      onClose();
    } catch (e) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const services = Array.isArray(booking.services)
    ? booking.services.map(s => (typeof s === 'string' ? s : s.name))
    : [];

  const addressStr = booking.address
    ? `${booking.address.flatNo || ''} ${booking.address.building || ''}, ${booking.address.street || ''}, ${booking.address.city || ''} ${booking.address.pincode || ''}`.trim()
    : 'Address not specified';

  return (
    <Modal open title={`Booking ${booking.code}`} onClose={onClose} size="lg"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          {!['COMPLETED', 'CANCELLED'].includes(booking.status) && (
            <button className="btn btn-danger btn-sm" onClick={handleForceCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Force Cancel'}
            </button>
          )}
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Customer Info */}
        <div style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-sm)', padding: 14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Customer Details</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{booking.customer?.name || 'Customer'}</div>
          <div className="text-sm text-slate">{booking.customer?.phone || 'No phone'}</div>
          <div className="text-xs text-slate" style={{ marginTop: 6 }}>{addressStr}</div>
          {booking.startOtp && (
            <div style={{ marginTop: 8, display: 'inline-block', background: 'rgba(255,106,43,0.1)', color: 'var(--orange)', padding: '4px 8px', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
              Start Job OTP: {booking.startOtp}
            </div>
          )}
        </div>

        {/* Technician Info */}
        <div style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-sm)', padding: 14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Assigned Technician</div>
          {booking.technician ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{booking.technician.name}</div>
              <div className="text-sm text-slate">Phone: {booking.technician.phone || '—'}</div>
              <div className="text-xs text-slate" style={{ marginTop: 4 }}>
                Vehicle: {booking.technician.vehicle || 'Not specified'} • Queue #{booking.assignedQueueNumber || '—'}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate" style={{ marginTop: 8 }}>Automated dispatch in progress / Unassigned</div>
          )}
        </div>

        {/* Services */}
        <div style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-sm)', padding: 14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Services</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {services.map((s, idx) => (
              <span key={idx} className="badge badge-slate" style={{ fontSize: 12 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div style={{ background: 'var(--paper-soft)', borderRadius: 'var(--r-sm)', padding: 14 }}>
          <div className="text-xs text-slate fw-600" style={{ textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Financials</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span className="text-slate">Visit Charge</span>
              <span className="text-mono fw-600">{formatPaiseExact(booking.visitFeePaise || 9900)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span className="text-slate">Total Amount</span>
              <span className="text-mono fw-600">{formatPaiseExact(booking.finalTotalPaise || booking.visitFeePaise || 9900)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span className="text-slate">Platform Commission (15%)</span>
              <span className="text-mono fw-600 text-success">
                {formatPaiseExact(Math.round((booking.finalTotalPaise || booking.visitFeePaise || 9900) * 0.15))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 16 }}>
        <div className="text-xs text-slate fw-600" style={{ textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>Booking Timeline</div>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
          {timeline.map((step, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            const cancelled = booking.status === 'CANCELLED';
            return (
              <div key={step.status} style={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                    background: cancelled && active ? 'var(--danger-dim)' : active ? 'var(--orange-dim)' : done ? 'var(--success-dim)' : 'var(--paper-soft)',
                    border: `2px solid ${cancelled && active ? 'var(--danger)' : active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--line)'}`,
                    color: cancelled && active ? 'var(--danger)' : active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--slate)',
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--slate)', whiteSpace: 'nowrap' }}>
                    {step.label}
                  </div>
                </div>
                {i < timeline.length - 1 && (
                  <div style={{ width: 24, height: 2, background: done ? 'var(--success)' : 'var(--line)', margin: '0 2px', marginBottom: 20, flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selected, setSelected] = useState<LiveBooking | null>(null);
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.warn('Failed to fetch live bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const statuses = [
    'ALL', 'CONFIRMED', 'DISPATCHING', 'ASSIGNED', 'EN_ROUTE',
    'ARRIVED', 'QUOTE_SENT', 'IN_PROGRESS', 'WORK_DONE', 'PAYMENT_DUE',
    'COMPLETED', 'CANCELLED'
  ];

  const filtered = bookings.filter(b => {
    const custName = b.customer?.name || '';
    const techName = b.technician?.name || '';
    const matchSearch = !search ||
      b.code?.toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      techName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <TopBar title="Bookings" subtitle="Live customer service bookings and status tracking" />
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
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 }}>
            {statuses.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                {s !== 'ALL' && (
                  <span style={{ marginLeft: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 99, padding: '0 5px', fontSize: 10 }}>
                    {bookings.filter(b => b.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm" onClick={fetchBookings}>
            <RefreshCw size={13} /> Refresh
          </button>
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
                <th>Total ₹</th>
                <th>Commission ₹</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 50, color: 'var(--slate)' }}>
                    Loading live bookings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 60, color: 'var(--slate)' }}>
                    <ClipboardList size={36} style={{ margin: '0 auto 12px', opacity: 0.35, display: 'block' }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                      {search || statusFilter !== 'ALL' ? 'No matching bookings' : 'No Bookings Created Yet'}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      {search || statusFilter !== 'ALL'
                        ? 'Try clearing your search or filters'
                        : 'Bookings placed from the FixPoint Customer App will appear here in real time.'}
                    </div>
                  </td>
                </tr>
              ) : filtered.map(b => {
                const sList = Array.isArray(b.services)
                  ? b.services.map(s => (typeof s === 'string' ? s : s.name))
                  : [];
                const totalPaise = b.finalTotalPaise || b.visitFeePaise || 9900;
                const commissionPaise = Math.round(totalPaise * 0.15);

                return (
                  <tr key={b.id}>
                    <td>
                      <span className="text-mono fw-600" style={{ color: 'var(--orange)', fontSize: 13 }}>{b.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{b.customer?.name || 'Customer'}</div>
                      <div className="text-xs text-slate">{b.customer?.phone || '—'}</div>
                    </td>
                    <td>
                      {b.technician ? (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{b.technician.name}</div>
                          <div className="text-xs text-slate">#{b.assignedQueueNumber || '—'}</div>
                        </div>
                      ) : (
                        <span className="text-slate text-sm">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 180 }}>
                        {sList.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="badge badge-slate" style={{ fontSize: 10 }}>{s}</span>
                        ))}
                        {sList.length > 2 && (
                          <span className="badge badge-slate" style={{ fontSize: 10 }}>+{sList.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{b.slot || 'Immediate'}</div>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[b.status] || 'badge-slate'}`} style={{ fontSize: 11 }}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-mono" style={{ fontSize: 13 }}>{formatPaiseExact(b.visitFeePaise || 9900)}</td>
                    <td className="text-mono" style={{ fontSize: 13 }}>{formatPaiseExact(totalPaise)}</td>
                    <td className="text-mono text-success" style={{ fontSize: 13 }}>{formatPaiseExact(commissionPaise)}</td>
                    <td>
                      <button className="btn btn-ghost btn-icon" onClick={() => setSelected(b)} title="View">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} onRefresh={fetchBookings} />}
    </>
  );
}
