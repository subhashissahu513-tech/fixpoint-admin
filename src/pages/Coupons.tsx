import { useState } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { Plus, Search, Edit2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minAmount: number;
  maxDiscount: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  used: number;
  isActive: boolean;
}

const mockCoupons: Coupon[] = [];


function formatRupees(paise: number) { return `₹${(paise/100).toLocaleString('en-IN')}`; }

function CouponModal({ coupon, onClose, onSave }: { coupon: Coupon | null; onClose: () => void; onSave: (c: Coupon) => void }) {
  const [form, setForm] = useState<Coupon>(coupon || {
    id: `c${Date.now()}`, code:'', type:'flat', value:0, minAmount:0, maxDiscount:null,
    validFrom:'', validTo:'', usageLimit:100, used:0, isActive:true,
  });
  const set = <K extends keyof Coupon>(k: K, v: Coupon[K]) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal open title={coupon ? 'Edit Coupon' : 'Create Coupon'} onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save Coupon</button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div className="form-group">
          <label className="form-label">Coupon Code</label>
          <input className="form-input text-mono" style={{ textTransform:'uppercase', fontSize:16, letterSpacing:1 }} value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="e.g. SAVE15" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => set('type', e.target.value as 'percent' | 'flat')}>
              <option value="flat">Flat (₹)</option>
              <option value="percent">Percent (%)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Value ({form.type === 'percent' ? '%' : '₹'})</label>
            <input className="form-input text-mono" type="number" value={form.type === 'flat' ? form.value / 100 : form.value} onChange={e => set('value', form.type === 'flat' ? Math.round(parseFloat(e.target.value || '0') * 100) : parseFloat(e.target.value || '0'))} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Min Order Amount (₹)</label>
            <input className="form-input text-mono" type="number" value={form.minAmount / 100} onChange={e => set('minAmount', Math.round(parseFloat(e.target.value || '0') * 100))} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Discount (₹, optional)</label>
            <input className="form-input text-mono" type="number" value={form.maxDiscount ? form.maxDiscount / 100 : ''} onChange={e => set('maxDiscount', e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null)} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Valid From</label>
            <input className="form-input" type="date" value={form.validFrom} onChange={e => set('validFrom', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Valid To</label>
            <input className="form-input" type="date" value={form.validTo} onChange={e => set('validTo', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Usage Limit</label>
          <input className="form-input text-mono" type="number" value={form.usageLimit} onChange={e => set('usageLimit', parseInt(e.target.value || '100'))} />
        </div>
      </div>
    </Modal>
  );
}

export default function Coupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');

  const handleSave = (c: Coupon) => {
    setCoupons(prev => {
      const exists = prev.find(x => x.id === c.id);
      return exists ? prev.map(x => x.id === c.id ? c : x) : [...prev, c];
    });
    setEditing(null);
    setShowNew(false);
  };

  const toggleActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const filtered = coupons.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <TopBar title="Coupons & Campaigns" subtitle="Create and manage discount codes" />
      <div className="page-body">
        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search coupon code…" value={search} onChange={e => setSearch(e.target.value)} id="coupons-search" />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}><Plus size={14} /> Create Coupon</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Tag size={28} color="var(--orange)" /></div>
              <div className="empty-state-title">No coupons created yet</div>
              <div className="empty-state-sub">Click "Create Coupon" above to launch marketing promotions and discounts.</div>
            </div>
          ) : filtered.map(c => {
            const pctUsed = Math.round((c.used / c.usageLimit) * 100);
            return (
              <div key={c.id} className="card" style={{ padding:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:44, height:44, borderRadius:'var(--r-sm)', background:'var(--orange-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Tag size={20} color="var(--orange)" />
                    </div>
                    <div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:18, fontWeight:700, letterSpacing:1, color:'var(--orange)' }}>{c.code}</div>
                      <div style={{ fontSize:12, color:'var(--slate)', marginTop:2 }}>
                        {c.type === 'flat' ? `Flat ${formatRupees(c.value)} off` : `${c.value}% off`}
                        {c.maxDiscount ? ` (max ${formatRupees(c.maxDiscount)})` : ''}
                        {' · '}Min order {formatRupees(c.minAmount)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span className={`badge ${c.isActive ? 'badge-success' : 'badge-slate'}`} style={{ fontSize:11 }}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button className="btn btn-ghost btn-icon" onClick={() => toggleActive(c.id)} title={c.isActive ? 'Deactivate' : 'Activate'}>
                      {c.isActive ? <ToggleRight size={18} color="var(--success)" /> : <ToggleLeft size={18} color="var(--slate)" />}
                    </button>
                    <button className="btn btn-ghost btn-icon" onClick={() => setEditing(c)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ marginTop:12, display:'flex', gap:24, fontSize:12, color:'var(--slate)' }}>
                  <span>Valid: {new Date(c.validFrom).toLocaleDateString('en-IN')} → {new Date(c.validTo).toLocaleDateString('en-IN')}</span>
                  <span>Used: <strong style={{ color:'var(--ink)', fontFamily:'var(--font-mono)' }}>{c.used}</strong> / {c.usageLimit}</span>
                </div>
                <div style={{ marginTop:8 }}>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width:`${pctUsed}%`, background: pctUsed > 80 ? 'var(--danger)' : pctUsed > 50 ? 'var(--amber)' : 'var(--success)' }} />
                  </div>
                  <div style={{ fontSize:11, color:'var(--slate)', marginTop:3 }}>{pctUsed}% of quota used</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {(editing || showNew) && (
        <CouponModal coupon={editing} onClose={() => { setEditing(null); setShowNew(false); }} onSave={handleSave} />
      )}
    </>
  );
}
