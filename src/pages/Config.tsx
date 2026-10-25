import { useState } from 'react';
import TopBar from '../components/TopBar';
import { appConfig } from '../data/mockData';

type ConfigKey = keyof typeof appConfig;

export default function Config() {
  const [config, setConfig] = useState(appConfig);
  const [saved, setSaved] = useState(false);

  const set = <K extends ConfigKey>(key: K, value: typeof appConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <TopBar title="App Config" subtitle="Edit platform-wide business rules and thresholds" />
      <div className="page-body">
        <div className="alert alert-warning mb-16">
          ⚠️ Changes here take effect immediately for <strong>new bookings</strong>. Existing bookings use their snapshotted values. Always double-check before saving.
        </div>

        <div className="grid-2">
          {/* Pricing */}
          <div className="card">
            <div className="card-header"><span className="card-title">💰 Pricing & Commission</span></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Visit Charge (₹)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.visit_charge_paise / 100}
                  onChange={e => set('visit_charge_paise', Math.round(parseFloat(e.target.value || '0') * 100))}
                />
                <span className="text-xs text-slate">Currently: <span className="text-mono">₹{config.visit_charge_paise/100}</span></span>
              </div>
              <div className="form-group">
                <label className="form-label">Platform Commission (%)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  step="0.1"
                  value={config.commission_bps / 100}
                  onChange={e => set('commission_bps', Math.round(parseFloat(e.target.value || '0') * 100))}
                />
                <span className="text-xs text-slate">On labour only. Materials: 0% commission.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Visit Charge Policy</label>
                <select className="form-select" value={config.visit_policy} onChange={e => set('visit_policy', e.target.value)}>
                  <option value="adjust">Adjust (credit against bill)</option>
                  <option value="waive">Waive (free if work proceeds)</option>
                  <option value="retain">Retain (always keep)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cancellation Fee (₹)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.cancellation_fee_paise / 100}
                  onChange={e => set('cancellation_fee_paise', Math.round(parseFloat(e.target.value || '0') * 100))}
                />
              </div>
            </div>
          </div>

          {/* Operations */}
          <div className="card">
            <div className="card-header"><span className="card-title">⚙️ Operations</span></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Photo Proof Threshold (₹ per line)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.photo_threshold_paise / 100}
                  onChange={e => set('photo_threshold_paise', Math.round(parseFloat(e.target.value || '0') * 100))}
                />
                <span className="text-xs text-slate">Add-ons above this require photo proof.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Quote Admin Review Cap (₹ per booking)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.quote_cap_paise / 100}
                  onChange={e => set('quote_cap_paise', Math.round(parseFloat(e.target.value || '0') * 100))}
                />
                <span className="text-xs text-slate">Quotes above this trigger admin review.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Quote Expiry (minutes)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.quote_expiry_min}
                  onChange={e => set('quote_expiry_min', parseInt(e.target.value || '30'))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Warranty Period (days)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.warranty_days}
                  onChange={e => set('warranty_days', parseInt(e.target.value || '30'))}
                />
              </div>
            </div>
          </div>

          {/* Dispatch */}
          <div className="card">
            <div className="card-header"><span className="card-title">📍 Dispatch</span></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Offer Timeout (seconds)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.dispatch_timeout_sec}
                  onChange={e => set('dispatch_timeout_sec', parseInt(e.target.value || '30'))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">OTP TTL (seconds)</label>
                <input
                  className="form-input text-mono"
                  type="number"
                  value={config.otp_ttl_sec}
                  onChange={e => set('otp_ttl_sec', parseInt(e.target.value || '300'))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Search Radius Steps (km)</label>
                <div style={{ display:'flex', gap:8 }}>
                  {config.dispatch_radius_km.map((r, i) => (
                    <div key={i} style={{ flex:1 }}>
                      <input
                        className="form-input text-mono"
                        type="number"
                        value={r}
                        onChange={e => {
                          const newR = [...config.dispatch_radius_km];
                          newR[i] = parseInt(e.target.value || '5');
                          set('dispatch_radius_km', newR);
                        }}
                        placeholder={`Step ${i+1}`}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate">Expanding search: Step 1 → Step 2 → Step 3 → broadcast</span>
              </div>
            </div>
          </div>

          {/* Serviceable Pincodes */}
          <div className="card">
            <div className="card-header"><span className="card-title">📌 Serviceable Pincodes</span></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Pincode List (comma-separated)</label>
                <textarea
                  className="form-textarea text-mono"
                  style={{ minHeight:120 }}
                  value={config.serviceable_pincodes.join(', ')}
                  onChange={e => set('serviceable_pincodes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
                <span className="text-xs text-slate">{config.serviceable_pincodes.length} pincodes configured</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:8 }}>
                {config.serviceable_pincodes.map(pin => (
                  <span key={pin} className="badge badge-blue" style={{ fontSize:11, fontFamily:'var(--font-mono)' }}>
                    {pin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:24, gap:12 }}>
          <button className="btn btn-outline" onClick={() => setConfig(appConfig)}>Reset to Defaults</button>
          <button className="btn btn-primary" onClick={save}>
            {saved ? '✓ Saved!' : 'Save Configuration'}
          </button>
        </div>

        {/* Current values preview */}
        <div className="card" style={{ marginTop:24 }}>
          <div className="card-header"><span className="card-title">🔍 Current Live Config (JSON)</span></div>
          <div className="card-body">
            <pre style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--ink)', background:'var(--paper-soft)', padding:16, borderRadius:'var(--r-sm)', overflowX:'auto', lineHeight:1.6 }}>
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
