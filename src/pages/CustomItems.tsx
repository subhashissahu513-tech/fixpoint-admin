import { useState } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import { mockCustomItems, CustomItemRequest, formatPaiseExact } from '../data/mockData';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const statusBadge: Record<string, string> = {
  pending:'badge-amber', approved:'badge-success', rejected:'badge-danger',
};

function ReviewModal({ item, onClose, onDecide }: {
  item: CustomItemRequest;
  onClose: () => void;
  onDecide: (id: string, action: 'approved' | 'rejected', note: string, price?: number) => void;
}) {
  const [note, setNote] = useState('');
  const [approvedPrice, setApprovedPrice] = useState(item.proposedPrice / 100);

  return (
    <Modal open title="Review Custom Item Request" onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDecide(item.id, 'rejected', note)}>
            <XCircle size={14} /> Reject
          </button>
          <button className="btn btn-success" onClick={() => onDecide(item.id, 'approved', note, approvedPrice * 100)}>
            <CheckCircle size={14} /> Approve
          </button>
        </>
      }
    >
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'var(--paper-soft)', borderRadius:'var(--r-sm)', padding:14 }}>
          <div style={{ fontSize:12, color:'var(--slate)', fontWeight:600, marginBottom:8 }}>REQUEST DETAILS</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:13 }}>
            <div><span className="text-slate">Booking:</span> <span className="text-mono fw-600">{item.bookingCode}</span></div>
            <div><span className="text-slate">Technician:</span> {item.technician}</div>
            <div style={{ gridColumn:'1/-1' }}><span className="text-slate">Item:</span> <strong>{item.title}</strong></div>
            <div><span className="text-slate">Qty:</span> {item.qty}</div>
            <div><span className="text-slate">Proposed:</span> <span className="text-mono fw-600 text-orange">{formatPaiseExact(item.proposedPrice)}</span></div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Approved Price (₹)</label>
          <input
            className="form-input text-mono"
            type="number"
            value={approvedPrice}
            onChange={e => setApprovedPrice(parseFloat(e.target.value || '0'))}
          />
          <span style={{ fontSize:11, color:'var(--slate)' }}>You can adjust the price before approving.</span>
        </div>
        <div className="form-group">
          <label className="form-label">Review Note</label>
          <textarea
            className="form-textarea"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note visible to the technician…"
          />
        </div>
      </div>
    </Modal>
  );
}

export default function CustomItems() {
  const [items, setItems] = useState<CustomItemRequest[]>([]);
  const [reviewing, setReviewing] = useState<CustomItemRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleDecide = (id: string, action: 'approved' | 'rejected', note: string, price?: number) => {
    setItems(prev => prev.map(i => i.id !== id ? i : {
      ...i,
      status: action,
      reviewNote: note,
      approvedPrice: price,
    } as CustomItemRequest));
    setReviewing(null);
  };

  const filtered = items.filter(i => filter === 'all' || i.status === filter);
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <>
      <TopBar title="Custom Item Requests" subtitle="Review technician-proposed items before they can be charged" />
      <div className="page-body">
        {pendingCount > 0 && (
          <div className="alert alert-warning mb-16">
            ⚠️ <strong>{pendingCount} custom item{pendingCount > 1 ? 's' : ''}</strong> pending review. These cannot be charged to the customer until approved.
          </div>
        )}

        <div className="tabs">
          {(['all','pending','approved','rejected'] as const).map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && ` (${items.filter(i => i.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Technician</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Proposed ₹</th>
                <th>Status</th>
                <th>Review Note</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 50, color: 'var(--slate)' }}>
                    No custom item requests. Technicians quoting extra items will appear here for review.
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td><span className="text-mono fw-600 text-orange" style={{ fontSize:13 }}>{item.bookingCode}</span></td>
                  <td style={{ fontSize:13 }}>{item.technician}</td>
                  <td style={{ fontSize:13, fontWeight:500, maxWidth:200 }}>{item.title}</td>
                  <td style={{ fontSize:13 }}>{item.qty}</td>
                  <td><span className="text-mono fw-600" style={{ fontSize:14 }}>{formatPaiseExact(item.proposedPrice)}</span></td>
                  <td><span className={`badge ${statusBadge[item.status]}`} style={{ fontSize:11 }}>{item.status}</span></td>
                  <td style={{ fontSize:12, color:'var(--slate)', maxWidth:200 }}>
                    {item.reviewNote || <span className="text-slate">—</span>}
                  </td>
                  <td style={{ fontSize:12, color:'var(--slate)' }}>
                    {new Date(item.createdAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                  </td>
                  <td>
                    {item.status === 'pending' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => setReviewing(item)}>
                        <Eye size={13} /> Review
                      </button>
                    ) : (
                      <button className="btn btn-ghost btn-icon" onClick={() => setReviewing(item)}>
                        <Eye size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {reviewing && (
        <ReviewModal item={reviewing} onClose={() => setReviewing(null)} onDecide={handleDecide} />
      )}
    </>
  );
}
