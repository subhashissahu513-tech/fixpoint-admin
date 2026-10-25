import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { formatPaise, formatPaiseExact } from '../data/mockData';
import { API_URL } from '../apiConfig';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Zap, Users, IndianRupee, Clock, Package, CheckCircle, ClipboardList, ShieldCheck } from 'lucide-react';

function StatCard({ icon, iconBg, iconColor, value, label, sub }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="stat-card-value text-mono">{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/technicians`)
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData.bookings || []);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        setTechnicians(tData.technicians || []);
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalBookings = bookings.length;
  const gmvPaise = bookings.reduce((sum, b) => sum + (b.finalTotalPaise || b.visitFeePaise || 9900), 0);
  const commissionPaise = Math.round(gmvPaise * 0.15);
  const approvedTechs = technicians.filter(t => t.kycStatus === 'APPROVED').length;
  const pendingKycTechs = technicians.filter(t => t.kycStatus === 'PENDING_APPROVAL').length;
  const activeJobs = bookings.filter(b => ['IN_PROGRESS', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE'].includes(b.status));

  // 7-day revenue chart data generated dynamically from real bookings
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const dayBookings = bookings.filter(b => {
      if (!b.createdAt) return false;
      const bDate = new Date(b.createdAt);
      return bDate.toDateString() === d.toDateString();
    });
    const dayGmv = dayBookings.reduce((sum, b) => sum + (b.finalTotalPaise || b.visitFeePaise || 9900), 0) / 100;
    return {
      date: dateStr,
      gmv: dayGmv,
      commission: Math.round(dayGmv * 0.15),
      count: dayBookings.length,
    };
  });

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Live Operations • ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />
      <div className="page-body">
        {/* Real Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={<Zap size={20} />}
            iconBg="var(--orange-dim)"
            iconColor="var(--orange)"
            value={String(totalBookings)}
            label="Total Bookings"
            sub={activeJobs.length > 0 ? `${activeJobs.length} active in progress` : 'Real-time bookings'}
          />
          <StatCard
            icon={<IndianRupee size={20} />}
            iconBg="rgba(31,170,110,.12)"
            iconColor="var(--success)"
            value={formatPaise(gmvPaise)}
            label="Gross Booking Value"
            sub="Live customer billings"
          />
          <StatCard
            icon={<IndianRupee size={20} />}
            iconBg="var(--amber-dim)"
            iconColor="#8a6000"
            value={formatPaise(commissionPaise)}
            label="Platform Profit (15%)"
            sub="Auto-calculated commission"
          />
          <StatCard
            icon={<Users size={20} />}
            iconBg="rgba(29,111,209,.12)"
            iconColor="#1D6FD1"
            value={String(approvedTechs)}
            label="Active Technicians"
            sub={pendingKycTechs > 0 ? `${pendingKycTechs} pending KYC approval` : 'All KYC verified'}
          />
          <StatCard
            icon={<ShieldCheck size={20} />}
            iconBg="rgba(123,63,228,.12)"
            iconColor="#7B3FE4"
            value={String(pendingKycTechs)}
            label="KYC Verifications"
            sub="Aadhaar & PAN reviews"
          />
          <StatCard
            icon={<Package size={20} />}
            iconBg="rgba(14,156,129,.12)"
            iconColor="#0E9C81"
            value={String(activeJobs.length)}
            label="Live Active Jobs"
            sub="Technicians dispatched"
          />
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-24">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Real-Time Revenue Trends</span>
              <span className="text-sm text-slate">GMV vs Commission</span>
            </div>
            <div className="card-body">
              <div className="chart-wrap" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--orange)" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--slate)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--slate)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="gmv" name="GMV (₹)" stroke="var(--orange)" strokeWidth={2} fill="url(#gmvGrad)" />
                    <Area type="monotone" dataKey="commission" name="Commission (₹)" stroke="var(--success)" strokeWidth={2} fill="url(#comGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Technician Fleet Status</span>
              <span className="text-sm text-slate">Queue & KYC Health</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--paper-soft)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Approved Technicians Ready</span>
                  </div>
                  <span className="text-mono fw-600" style={{ fontSize: 14 }}>{approvedTechs}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--paper-soft)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Pending Super Admin Review</span>
                  </div>
                  <span className="text-mono fw-600" style={{ fontSize: 14, color: pendingKycTechs > 0 ? 'var(--orange)' : 'inherit' }}>
                    {pendingKycTechs}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--paper-soft)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D6FD1' }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Active Dispatch Round-Robin</span>
                  </div>
                  <span className="text-mono fw-600" style={{ fontSize: 14, color: 'var(--success)' }}>
                    Enabled (Automated)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Bookings Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Dispatched Bookings</span>
            <span className="text-sm text-slate">{bookings.length} total bookings recorded</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Slot</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--slate)' }}>
                      <ClipboardList size={30} style={{ margin: '0 auto 8px', opacity: 0.35, display: 'block' }} />
                      <div style={{ fontWeight: 600 }}>No live bookings yet</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Place a booking in the customer app to see real-time dispatch here.</div>
                    </td>
                  </tr>
                ) : (
                  bookings.slice(0, 5).map(b => (
                    <tr key={b.id}>
                      <td>
                        <span className="text-mono fw-600" style={{ color: 'var(--orange)' }}>{b.code}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.customer?.name || 'Customer'}</div>
                        <div className="text-xs text-slate">{b.customer?.phone || '—'}</div>
                      </td>
                      <td>
                        {b.technician ? (
                          <span style={{ fontWeight: 500 }}>{b.technician.name} (#{b.assignedQueueNumber || '—'})</span>
                        ) : (
                          <span className="text-slate">Unassigned</span>
                        )}
                      </td>
                      <td style={{ fontSize: 12 }}>{b.slot || 'Immediate'}</td>
                      <td>
                        <span className="badge badge-blue">{b.status}</span>
                      </td>
                      <td className="text-mono fw-600">
                        {formatPaiseExact(b.finalTotalPaise || b.visitFeePaise || 9900)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
