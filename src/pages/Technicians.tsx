import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { formatPaiseExact } from '../data/mockData';
import { Search, CheckCircle, XCircle, AlertTriangle, Eye, Star, MapPin, UserCheck, ShieldCheck, DollarSign, ArrowRight, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';

import { API_URL } from '../apiConfig';

interface TechnicianItem {
  id: string;
  queueNumber: number | null;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  area: string;
  vehicleNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  kycStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
  isOnline: boolean;
  isOnLeave: boolean;
  jobsCompleted: number;
  rating: number;
  totalBillingsPaise: number;
  platformProfitPaise: number;
  technicianPayoutPaise: number;
  joinedAt: string;
}

export default function Technicians() {
  const [technicians, setTechnicians] = useState<TechnicianItem[]>([]);
  const [nextQueueNum, setNextQueueNum] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'on_leave'>('all');
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState<TechnicianItem | null>(null);
  const [assignNumInput, setAssignNumInput] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTechs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/technicians`);
      if (res.ok) {
        const data = await res.json();
        setTechnicians(data.technicians || []);
        setNextQueueNum(data.nextQueueNumber || 1);
      }
    } catch (e) {
      console.warn('Failed to fetch technicians from server:', e);
    }
  };

  useEffect(() => {
    fetchTechs();
    const interval = setInterval(fetchTechs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (techId: string, assignedQueueNum?: number) => {
    const queueNum = assignedQueueNum || parseInt(assignNumInput) || (technicians.filter(t => t.queueNumber !== null).length + 1);

    try {
      const res = await fetch(`${API_URL}/api/technicians/${techId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueNumber: queueNum })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Technician approved successfully and assigned Queue ID #${queueNum}!` });
        setSelectedTech(null);
        fetchTechs();
      }
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: e.message || 'Approval failed' });
    }
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleToggleLeave = async (tech: TechnicianItem) => {
    try {
      const res = await fetch(`${API_URL}/api/technicians/${tech.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnLeave: !tech.isOnLeave })
      });
      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: `Technician ${tech.name} marked as ${!tech.isOnLeave ? 'ON LEAVE (jobs will auto-skip to next ID)' : 'ACTIVE (ready for queue jobs)'}`
        });
        fetchTechs();
      }
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: 'Status update failed' });
    }
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const filtered = technicians.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search);
    if (filter === 'pending') return matchSearch && t.kycStatus === 'PENDING_APPROVAL';
    if (filter === 'approved') return matchSearch && t.kycStatus === 'APPROVED';
    if (filter === 'on_leave') return matchSearch && t.isOnLeave;
    return matchSearch;
  });

  const pendingCount = technicians.filter(t => t.kycStatus === 'PENDING_APPROVAL').length;
  const totalBillings = technicians.reduce((sum, t) => sum + (t.totalBillingsPaise || 0), 0);
  const totalPlatformProfit = technicians.reduce((sum, t) => sum + (t.platformProfitPaise || 0), 0);
  const totalTechPayouts = technicians.reduce((sum, t) => sum + (t.technicianPayoutPaise || 0), 0);

  return (
    <>
      <TopBar title="Technician Management & KYC" subtitle="Queue Numbering, Round-Robin Automated Dispatch & Profit Analysis" onRefresh={fetchTechs} />
      <div className="page-body">
        {statusMsg && (
          <div className={`alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-danger'} mb-16`} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>{statusMsg.type === 'success' ? '✓' : '⚠️'}</span>
            <strong>{statusMsg.text}</strong>
          </div>
        )}

        {/* Financial Profit Summary from Technicians */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:20 }}>
          <div className="stat-card">
            <div className="stat-card-title">Total Customer Billings</div>
            <div className="stat-card-val text-mono">{formatPaiseExact(totalBillings)}</div>
            <div className="stat-card-meta">All completed electrician orders</div>
          </div>
          <div className="stat-card" style={{ borderLeft:'4px solid var(--orange)' }}>
            <div className="stat-card-title">FixPoint Platform Profit (15%)</div>
            <div className="stat-card-val text-mono text-orange" style={{ fontSize:22 }}>{formatPaiseExact(totalPlatformProfit)}</div>
            <div className="stat-card-meta text-success fw-600">Company Revenue Collected</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Technician Net Payouts</div>
            <div className="stat-card-val text-mono text-success">{formatPaiseExact(totalTechPayouts)}</div>
            <div className="stat-card-meta">85% Labor + 100% Spares</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Next Round-Robin Queue ID</div>
            <div className="stat-card-val text-mono" style={{ color:'var(--blue)' }}>ID #{nextQueueNum}</div>
            <div className="stat-card-meta">Auto-redirects if on leave</div>
          </div>
        </div>

        {/* Round-Robin Queue Explanation Banner */}
        <div className="alert alert-info mb-16" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            🔄 <strong>Automated Queue Dispatch Rule:</strong> When customer books an electrician, the system automatically checks who is next in line by ID number. If <strong>ID #1</strong> is active, they take it. If <strong>ID #2</strong> is on leave or offline, the job <strong>automatically jumps to ID #3</strong>!
          </div>
          <button className="btn btn-outline btn-sm" onClick={fetchTechs}>
            <RefreshCw size={13} /> Refresh Queue
          </button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search technician name, phone, area..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>
              All ({technicians.length})
            </button>
            <button className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('pending')}>
              Pending KYC {pendingCount > 0 && <span className="badge badge-amber" style={{ marginLeft:4 }}>{pendingCount}</span>}
            </button>
            <button className={`btn btn-sm ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('approved')}>
              Approved Technicians
            </button>
            <button className={`btn btn-sm ${filter === 'on_leave' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('on_leave')}>
              On Leave
            </button>
          </div>
        </div>

        {/* Technicians Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Queue ID</th>
                <th>Technician</th>
                <th>KYC Documents</th>
                <th>Area & Vehicle</th>
                <th>Queue Status</th>
                <th>Jobs Done</th>
                <th>Total Billings</th>
                <th>FixPoint Profit (15%)</th>
                <th>Tech Payout</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 60, color: 'var(--slate)' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>👷</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                      No Technicians Registered Yet
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Technicians who submit KYC in the Technician Android App will appear here for Super Admin approval and Queue assignment.
                    </div>
                  </td>
                </tr>
              ) : filtered.map(tech => (
                <tr key={tech.id} style={{ background: tech.kycStatus === 'PENDING_APPROVAL' ? '#FFFBEB' : undefined }}>
                  <td>
                    {tech.queueNumber !== null ? (
                      <span className="badge badge-blue" style={{ fontSize:12, fontWeight:800 }}>
                        ID #{tech.queueNumber}
                      </span>
                    ) : (
                      <span className="badge badge-slate" style={{ fontSize:11 }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight:700, fontSize:14 }}>{tech.name}</div>
                    <div style={{ fontSize:12, color:'var(--slate)' }}>{tech.phone}</div>
                    <div style={{ fontSize:11, color:'var(--slate)' }}>{tech.email}</div>
                  </td>
                  <td>
                    <div style={{ fontSize:12 }}>
                      <span className="text-slate">Aadhaar:</span> <strong className="text-mono">{tech.aadhaarNumber}</strong>
                    </div>
                    <div style={{ fontSize:12 }}>
                      <span className="text-slate">PAN:</span> <strong className="text-mono">{tech.panNumber}</strong>
                    </div>
                    <span className={`badge ${tech.kycStatus === 'APPROVED' ? 'badge-success' : 'badge-amber'}`} style={{ fontSize:10, marginTop:4 }}>
                      {tech.kycStatus}
                    </span>
                  </td>
                  <td style={{ fontSize:12 }}>
                    <div>{tech.area}</div>
                    <div className="text-slate text-xs">Vehicle: {tech.vehicleNumber}</div>
                  </td>
                  <td>
                    {tech.kycStatus === 'PENDING_APPROVAL' ? (
                      <span className="badge badge-amber" style={{ fontSize:11 }}>Under Review</span>
                    ) : tech.isOnLeave ? (
                      <span className="badge badge-danger" style={{ fontSize:11 }}>🌴 On Leave (Auto-Skipped)</span>
                    ) : tech.isOnline ? (
                      <span className="badge badge-success" style={{ fontSize:11 }}>🟢 Online & Ready</span>
                    ) : (
                      <span className="badge badge-slate" style={{ fontSize:11 }}>⚪ Offline</span>
                    )}
                  </td>
                  <td className="text-mono fw-600" style={{ fontSize:13 }}>{tech.jobsCompleted}</td>
                  <td className="text-mono fw-600" style={{ fontSize:13 }}>{formatPaiseExact(tech.totalBillingsPaise || 0)}</td>
                  <td>
                    <span className="text-mono fw-700 text-orange" style={{ fontSize:14 }}>
                      {formatPaiseExact(tech.platformProfitPaise || 0)}
                    </span>
                  </td>
                  <td>
                    <span className="text-mono fw-600 text-success" style={{ fontSize:13 }}>
                      {formatPaiseExact(tech.technicianPayoutPaise || 0)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {tech.kycStatus === 'PENDING_APPROVAL' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedTech(tech);
                            setAssignNumInput(String(technicians.filter(t => t.queueNumber !== null).length + 1));
                          }}
                        >
                          <CheckCircle size={13} /> Approve KYC
                        </button>
                      ) : (
                        <button
                          className={`btn btn-sm ${tech.isOnLeave ? 'btn-outline' : 'btn-danger'}`}
                          onClick={() => handleToggleLeave(tech)}
                          title="Toggle On Leave to test auto-skip to next technician"
                        >
                          {tech.isOnLeave ? 'Mark Available' : 'Put On Leave'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Approval Modal */}
      {selectedTech && (
        <Modal
          open
          title={`Approve KYC & Assign Queue Number: ${selectedTech.name}`}
          onClose={() => setSelectedTech(null)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSelectedTech(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => handleApprove(selectedTech.id)}>
                <CheckCircle size={14} /> Approve & Activate Queue ID #{assignNumInput}
              </button>
            </>
          }
        >
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="alert alert-info">
              Verify Aadhaar and PAN details. Upon approval, this technician will immediately be added to the automatic round-robin work dispatcher.
            </div>

            <div style={{ background:'var(--paper-soft)', padding:14, borderRadius:'var(--r-sm)' }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{selectedTech.name}</div>
              <div style={{ fontSize:13, color:'var(--slate)' }}>Phone: {selectedTech.phone} · Area: {selectedTech.area}</div>
              <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:13 }}>
                <div><strong>Aadhaar Number:</strong> {selectedTech.aadhaarNumber}</div>
                <div><strong>PAN Number:</strong> {selectedTech.panNumber}</div>
                <div><strong>Vehicle Number:</strong> {selectedTech.vehicleNumber}</div>
                <div><strong>Applied On:</strong> {selectedTech.joinedAt}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight:700 }}>
                Assign Sequence Queue Number (ID #) *
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={assignNumInput}
                  onChange={e => setAssignNumInput(e.target.value)}
                  style={{ width:120, fontSize:16, fontWeight:700 }}
                />
                <span className="text-slate text-sm">
                  (Next available queue sequence number in line)
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
