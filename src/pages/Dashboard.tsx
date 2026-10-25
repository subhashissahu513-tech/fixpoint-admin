import TopBar from '../components/TopBar';
import {
  mockStats, chartDataRevenue, chartDataBookings, funnelData,
  mockBookings, formatPaise, formatPaiseExact
} from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Zap, Users, IndianRupee, Clock, Package, AlertCircle, CheckCircle } from 'lucide-react';

function StatCard({ icon, iconBg, iconColor, value, label, delta, deltaLabel }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  delta: number;
  deltaLabel?: string;
}) {
  const isUp = delta >= 0;
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="stat-card-value text-mono">{value}</div>
      <div className="stat-card-label">{label}</div>
      <div className={`stat-card-delta ${isUp ? 'delta-up' : 'delta-down'}`}>
        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {isUp ? '+' : ''}{delta}% {deltaLabel || 'vs yesterday'}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--line)', borderRadius:'var(--r-sm)', padding:'10px 14px', boxShadow:'var(--shadow-md)' }}>
      <div style={{ fontWeight:600, fontSize:12, marginBottom:6, color:'var(--slate)' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, marginBottom:2 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block' }} />
          <span style={{ color:'var(--slate)' }}>{p.name}:</span>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:600 }}>{formatPaise(p.value * 100)}</span>
        </div>
      ))}
    </div>
  );
};

const BookingTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--line)', borderRadius:'var(--r-sm)', padding:'10px 14px', boxShadow:'var(--shadow-md)' }}>
      <div style={{ fontWeight:600, fontSize:12, marginBottom:6, color:'var(--slate)' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, marginBottom:2 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block' }} />
          <span style={{ color:'var(--slate)' }}>{p.name}:</span>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const statusBadgeClass: Record<string, string> = {
  IN_PROGRESS:'badge-blue', QUOTE_SENT:'badge-amber', EN_ROUTE:'badge-teal',
  DISPATCHING:'badge-amber', CONFIRMED:'badge-blue', COMPLETED:'badge-success',
  CANCELLED:'badge-danger', DISPUTED:'badge-danger', WORK_DONE:'badge-success',
  PAYMENT_DUE:'badge-orange', ASSIGNED:'badge-purple',
};

export default function Dashboard() {
  const activeBookings = mockBookings.filter(b =>
    !['COMPLETED','CANCELLED','REFUNDED'].includes(b.status)
  );

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Today, ${new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}`}
      />
      <div className="page-body">

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={<Zap size={20} />}
            iconBg="var(--orange-dim)" iconColor="var(--orange)"
            value={String(mockStats.todayBookings)}
            label="Bookings Today"
            delta={mockStats.todayBookingsDelta}
          />
          <StatCard
            icon={<IndianRupee size={20} />}
            iconBg="rgba(31,170,110,.12)" iconColor="var(--success)"
            value={formatPaise(mockStats.gmv * 100)}
            label="GMV Today"
            delta={mockStats.gmvDelta}
          />
          <StatCard
            icon={<IndianRupee size={20} />}
            iconBg="var(--amber-dim)" iconColor="#8a6000"
            value={formatPaise(mockStats.commission * 100)}
            label="Commission Earned"
            delta={mockStats.commissionDelta}
          />
          <StatCard
            icon={<Users size={20} />}
            iconBg="rgba(29,111,209,.12)" iconColor="#1D6FD1"
            value={`${mockStats.conversionRate}%`}
            label="Conversion Rate"
            delta={mockStats.conversionDelta}
          />
          <StatCard
            icon={<Clock size={20} />}
            iconBg="rgba(123,63,228,.12)" iconColor="#7B3FE4"
            value={`${mockStats.avgEta} min`}
            label="Avg Dispatch ETA"
            delta={-8}
            deltaLabel="faster"
          />
          <StatCard
            icon={<Package size={20} />}
            iconBg="rgba(14,156,129,.12)" iconColor="#0E9C81"
            value={`${mockStats.addonRate}%`}
            label="Add-on Rate"
            delta={+6}
          />
        </div>

        {/* Charts Row */}
        <div className="grid-2 mb-24">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Revenue (7 days)</span>
              <span className="text-sm text-slate">GMV vs Commission</span>
            </div>
            <div className="card-body">
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataRevenue}>
                    <defs>
                      <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--orange)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--slate)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'var(--slate)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="gmv" name="GMV" stroke="var(--orange)" strokeWidth={2} fill="url(#gmvGrad)" />
                    <Area type="monotone" dataKey="commission" name="Commission" stroke="var(--success)" strokeWidth={2} fill="url(#comGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Bookings (7 days)</span>
              <span className="text-sm text-slate">Total / Completed / Cancelled</span>
            </div>
            <div className="card-body">
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataBookings} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--slate)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'var(--slate)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BookingTooltip />} />
                    <Bar dataKey="total" name="Total" fill="var(--orange)" radius={[4,4,0,0]} />
                    <Bar dataKey="completed" name="Completed" fill="var(--success)" radius={[4,4,0,0]} />
                    <Bar dataKey="cancelled" name="Cancelled" fill="var(--danger)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Funnel + Active Bookings */}
        <div className="grid-2">
          {/* Funnel */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <span className="card-title">Conversion Funnel</span>
              <span className="text-sm text-slate">Last 7 days</span>
            </div>
            <div className="card-body">
              {funnelData.map((stage, i) => {
                const pct = Math.round((stage.count / funnelData[0].count) * 100);
                const colors = ['var(--orange)','#FF8C42','var(--amber)','var(--success)','#1FAA6E'];
                return (
                  <div key={stage.stage} style={{ marginBottom: 14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:500 }}>{stage.stage}</span>
                      <span style={{ fontSize:13, fontFamily:'var(--font-mono)', fontWeight:600 }}>
                        {stage.count.toLocaleString()} <span style={{ color:'var(--slate)', fontSize:11 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width:`${pct}%`, background:colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Bookings */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <span className="card-title">Active Bookings ({activeBookings.length})</span>
              <span className="flex gap-4">
                {[...new Set(activeBookings.map(b => b.status))].map(s => (
                  <span key={s} className={`badge badge-sm ${statusBadgeClass[s] || 'badge-slate'}`} style={{ fontSize:10 }}>
                    {s.replace('_', ' ')}
                  </span>
                ))}
              </span>
            </div>
            <div style={{ padding: '0 20px 20px', display:'flex', flexDirection:'column', gap:10 }}>
              {activeBookings.slice(0,6).map(b => (
                <div key={b.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'var(--paper-soft)', borderRadius:'var(--r-sm)' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {b.code} · {b.customer}
                    </div>
                    <div style={{ fontSize:11.5, color:'var(--slate)', marginTop:1 }}>
                      {b.technician || 'Unassigned'} · {b.address.split(',')[0]}
                    </div>
                  </div>
                  <span className={`badge ${statusBadgeClass[b.status] || 'badge-slate'}`} style={{ fontSize:10.5 }}>
                    {b.status.replace('_',' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div style={{ marginTop: 24 }}>
          <div className="alert alert-warning" style={{ marginBottom:8 }}>
            <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }} />
            <div>
              <strong>2 fraud flags</strong> require your review — technician add-on anomaly and customer cancellation pattern detected.
            </div>
          </div>
          <div className="alert alert-info" style={{ marginBottom:8 }}>
            <CheckCircle size={16} style={{ flexShrink:0, marginTop:1 }} />
            <div>
              <strong>2 technician applications</strong> are pending KYC review. Approve to expand dispatch capacity.
            </div>
          </div>
          <div className="alert alert-warning">
            <AlertCircle size={16} style={{ flexShrink:0, marginTop:1 }} />
            <div>
              <strong>Booking FX-24004</strong> has been in DISPATCHING for 8 minutes with no technician assigned.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
