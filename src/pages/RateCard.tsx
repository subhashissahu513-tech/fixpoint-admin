import { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { mockRateCard, rateCardGroups, RateCardItem, formatPaiseExact } from '../data/mockData';
import { Search, Plus, Edit2, History, Camera, ToggleLeft, Download, Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

import { API_URL } from '../apiConfig';

function EditServiceModal({ item, onClose, onSave }: {
  item: RateCardItem | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (item: RateCardItem) => void;
}) {
  const [form, setForm] = useState<RateCardItem>(item || {
    id: `s${Date.now()}`, group:'Fan', name:'', unit:'per job',
    minPaise:0, maxPaise:0, defaultPaise:0,
    requiresPhoto:false, warrantyDays:30, isActive:true, sort:99,
  });

  const set = (k: keyof RateCardItem, v: RateCardItem[typeof k]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  return (
    <Modal
      open title={item ? `Edit Service Pricing` : 'Add New Service'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save to Live Catalog</button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div className="form-group">
          <label className="form-label">Group</label>
          <select className="form-select" value={form.group} onChange={e => set('group', e.target.value)}>
            {rateCardGroups.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Service Name</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Fan Repair (regulator, capacitor, bearing)" />
        </div>
        <div className="form-group">
          <label className="form-label">Unit</label>
          <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
            {['per job','per visit','per fan','per fixture','per unit','per point','per board','per pipe','per kit','per ft','per hour'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Min Price (₹)</label>
            <input className="form-input text-mono" type="number" value={form.minPaise / 100} onChange={e => set('minPaise', Math.round(parseFloat(e.target.value || '0') * 100))} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price (₹)</label>
            <input className="form-input text-mono" type="number" value={form.maxPaise / 100} onChange={e => set('maxPaise', Math.round(parseFloat(e.target.value || '0') * 100))} />
          </div>
          <div className="form-group">
            <label className="form-label">Default Price (₹) *</label>
            <input className="form-input text-mono" type="number" value={form.defaultPaise / 100} onChange={e => set('defaultPaise', Math.round(parseFloat(e.target.value || '0') * 100))} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Warranty (days)</label>
            <input className="form-input" type="number" value={form.warrantyDays} onChange={e => set('warrantyDays', parseInt(e.target.value || '0'))} />
          </div>
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input className="form-input" type="number" value={form.sort} onChange={e => set('sort', parseInt(e.target.value || '0'))} />
          </div>
        </div>
        <div style={{ display:'flex', gap:20 }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
            <input type="checkbox" checked={form.requiresPhoto} onChange={e => set('requiresPhoto', e.target.checked)} />
            Requires Photo Proof
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            Active on Apps
          </label>
        </div>
      </div>
    </Modal>
  );
}

export default function RateCard() {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [editing, setEditing] = useState<RateCardItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [items, setItems] = useState<RateCardItem[]>(mockRateCard);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from backend
  const fetchCatalog = async () => {
    try {
      const res = await fetch(`${API_URL}/api/catalog`);
      if (res.ok) {
        const data = await res.json();
        if (data.catalog && Array.isArray(data.catalog)) {
          setItems(data.catalog);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch catalog from backend, using local data:', err);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === 'All' || item.group === groupFilter;
    return matchSearch && matchGroup;
  });

  const handleSave = async (updated: RateCardItem) => {
    try {
      const res = await fetch(`${API_URL}/api/catalog/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Price for "${updated.name}" updated and synced to all apps!` });
      }
    } catch (e) {
      console.warn('Backend update failed:', e);
    }

    setItems(prev => {
      const exists = prev.find(i => i.id === updated.id);
      if (exists) return prev.map(i => i.id === updated.id ? updated : i);
      return [...prev, updated];
    });
    setEditing(null);
    setShowNew(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleExportCSV = () => {
    window.open(`${API_URL}/api/catalog/export-csv`, '_blank');
  };

  const handleDownloadTemplate = () => {
    window.open(`${API_URL}/api/catalog/template-csv`, '_blank');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const csvText = evt.target?.result as string;
      if (!csvText) return;

      try {
        const res = await fetch(`${API_URL}/api/catalog/import-csv`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvText })
        });
        const data = await res.json();
        if (data.success) {
          setStatusMsg({ type: 'success', text: `Successfully imported ${data.count} services! Pricing updated in all mobile apps.` });
          fetchCatalog();
        } else {
          setStatusMsg({ type: 'error', text: data.message || 'Import failed' });
        }
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: `Failed to upload: ${err.message}` });
      }
      setTimeout(() => setStatusMsg(null), 5000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <TopBar title="Rate Card & Pricing" subtitle="Live service catalog synced across Customer, Technician & Admin apps" />
      <div className="page-body">
        {statusMsg && (
          <div className={`alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-danger'} mb-16`} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>{statusMsg.type === 'success' ? '✓' : '⚠️'}</span>
            <strong>{statusMsg.text}</strong>
          </div>
        )}

        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)} id="ratecard-search" />
          </div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', flex:1 }}>
            {['All', ...rateCardGroups].map(g => (
              <button key={g} className={`btn btn-sm ${groupFilter === g ? 'btn-primary' : 'btn-outline'}`} onClick={() => setGroupFilter(g)}>{g}</button>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv"
            onChange={handleFileUpload}
          />

          <button className="btn btn-outline btn-sm" onClick={handleDownloadTemplate} title="Download clean Excel template">
            <FileSpreadsheet size={13} /> Price Template (Excel/CSV)
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} title="Upload modified CSV sheet">
            <Upload size={13} /> Import CSV
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleExportCSV} title="Export current live prices">
            <Download size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
            <Plus size={14} /> Add Service
          </button>
        </div>

        <div className="alert alert-info mb-16">
          ⚡ <strong>Live Real-Time Price Sync:</strong> Any changes made here or uploaded via CSV sheet immediately update the pricing tags in both the <strong>Customer Android App</strong> and <strong>Technician Android App</strong> without rebuilding the APKs! All values stored as integer paise.
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Service</th>
                <th>Unit</th>
                <th>Min ₹</th>
                <th>Max ₹</th>
                <th>Current Price (₹)</th>
                <th>Photo Proof</th>
                <th>Warranty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="badge badge-slate" style={{ fontSize:11 }}>{item.group}</span>
                  </td>
                  <td style={{ fontWeight:500, fontSize:13, maxWidth:260 }}>
                    <div>{item.name}</div>
                    {item.description && <div style={{ fontSize:11, color:'var(--slate)' }}>{item.description}</div>}
                  </td>
                  <td style={{ fontSize:12, color:'var(--slate)' }}>{item.unit}</td>
                  <td className="text-mono" style={{ fontSize:13 }}>{formatPaiseExact(item.minPaise)}</td>
                  <td className="text-mono" style={{ fontSize:13 }}>{formatPaiseExact(item.maxPaise)}</td>
                  <td>
                    <span className="text-mono fw-700 text-orange" style={{ fontSize:15 }}>{formatPaiseExact(item.defaultPaise)}</span>
                  </td>
                  <td>
                    {item.requiresPhoto ? (
                      <span className="badge badge-blue" style={{ fontSize:11 }}>Required</span>
                    ) : (
                      <span className="text-slate text-xs">—</span>
                    )}
                  </td>
                  <td style={{ fontSize:13 }}>{item.warrantyDays > 0 ? `${item.warrantyDays}d` : '—'}</td>
                  <td>
                    <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize:11 }}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(item)} title="Edit Price & Details">
                      <Edit2 size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || showNew) && (
        <EditServiceModal
          item={editing}
          isNew={showNew}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
