import { useState } from 'react';
import TopBar from '../components/TopBar';
import { MessageSquare, Send, Search, Clock } from 'lucide-react';

interface Ticket {
  id: string;
  user: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  bookingCode: string | null;
  lastMessage: string;
  createdAt: string;
  messages: { from: string; text: string; time: string }[];
}

const mockTickets: Ticket[] = [
  { id:'t001', user:'Rahul Sharma', subject:'Technician asked for extra cash', status:'open', priority:'high', bookingCode:'FX-24001', lastMessage:'He asked me to pay ₹500 in cash directly', createdAt:'2026-10-24T08:00:00Z', messages:[
    { from:'Rahul Sharma', text:'The technician asked me to pay ₹500 in cash directly outside the app.', time:'08:00' },
    { from:'Admin', text:'Thank you for reporting. We are investigating this immediately.', time:'08:15' },
  ]},
  { id:'t002', user:'Priya Mehta', subject:'Quote seems too high', status:'in_progress', priority:'medium', bookingCode:'FX-24002', lastMessage:'Is ₹2000 for a MCB replacement normal?', createdAt:'2026-10-24T07:30:00Z', messages:[
    { from:'Priya Mehta', text:'Is ₹2000 for a MCB replacement normal? Seems expensive.', time:'07:30' },
    { from:'Admin', text:'Hi Priya, the rate card for MCB replacement is ₹150–₹300. We\'re reviewing the quote now.', time:'07:45' },
    { from:'Priya Mehta', text:'Please fix this asap', time:'07:50' },
  ]},
  { id:'t003', user:'Mohan Das', subject:'Booking not confirmed after payment', status:'closed', priority:'low', bookingCode:'FX-24007', lastMessage:'Issue resolved — webhook was delayed', createdAt:'2026-10-23T15:00:00Z', messages:[
    { from:'Mohan Das', text:'I paid ₹99 but my booking still shows as pending.', time:'15:00' },
    { from:'Admin', text:'Webhook was delayed by 2 minutes due to gateway load. Booking is now confirmed. Sorry for the inconvenience!', time:'15:10' },
  ]},
];

const statusBadge: Record<string, string> = { open:'badge-danger', in_progress:'badge-amber', closed:'badge-success' };
const priorityBadge: Record<string, string> = { high:'badge-danger', medium:'badge-amber', low:'badge-slate' };

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    const newMsg = { from:'Admin', text:reply, time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    const updated = { ...selected, messages:[...selected.messages, newMsg], lastMessage:reply };
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelected(updated);
    setReply('');
  };

  const closeTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status:'closed' as const } : t));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status:'closed' } : null);
  };

  const filtered = tickets.filter(t =>
    !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar title="Support" subtitle="Manage customer and technician support tickets" />
      <div className="page-body">
        <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:16, height:'calc(100vh - 180px)', minHeight:500 }}>
          {/* Ticket list */}
          <div className="card" style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'12px 12px 8px', borderBottom:'1px solid var(--line)' }}>
              <div className="search-input-wrap" style={{ maxWidth:'100%' }}>
                <Search size={13} className="search-icon" />
                <input className="search-input" placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)} id="support-search" style={{ width:'100%' }} />
              </div>
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)', fontSize: 13 }}>
                  No support tickets open.
                </div>
              ) : filtered.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelected(t)}
                  style={{
                    padding:'12px 14px', cursor:'pointer', borderBottom:'1px solid var(--line)',
                    background: selected?.id === t.id ? 'var(--orange-dim)' : 'transparent',
                    transition:'background 150ms',
                  }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{t.user}</span>
                    <span className={`badge ${statusBadge[t.status]}`} style={{ fontSize:10 }}>{t.status.replace('_',' ')}</span>
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:500, color:'var(--ink)', marginBottom:2 }}>{t.subject}</div>
                  <div style={{ fontSize:11.5, color:'var(--slate)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.lastMessage}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:4 }}>
                    <Clock size={10} color="var(--slate)" />
                    <span style={{ fontSize:10, color:'var(--slate)' }}>{new Date(t.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                    <span className={`badge ${priorityBadge[t.priority]}`} style={{ fontSize:9 }}>{t.priority}</span>
                    {t.bookingCode && <span className="badge badge-blue" style={{ fontSize:9, fontFamily:'var(--font-mono)' }}>{t.bookingCode}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          {selected ? (
            <div className="card" style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
              {/* Header */}
              <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{selected.subject}</div>
                  <div style={{ fontSize:12, color:'var(--slate)', marginTop:2 }}>
                    {selected.user}
                    {selected.bookingCode && <> · <span className="text-mono">{selected.bookingCode}</span></>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <span className={`badge ${statusBadge[selected.status]}`}>{selected.status.replace('_',' ')}</span>
                  {selected.status !== 'closed' && (
                    <button className="btn btn-outline btn-sm" onClick={() => closeTicket(selected.id)}>Close Ticket</button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10 }}>
                {selected.messages.map((msg, i) => {
                  const isAdmin = msg.from === 'Admin';
                  return (
                    <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth:'70%', padding:'10px 14px', borderRadius:isAdmin ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: isAdmin ? 'var(--orange)' : 'var(--paper-soft)',
                        color: isAdmin ? '#fff' : 'var(--ink)',
                        fontSize:13.5, lineHeight:1.5,
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize:10, color:'var(--slate)', marginTop:3 }}>{msg.from} · {msg.time}</div>
                    </div>
                  );
                })}
              </div>

              {/* Reply */}
              {selected.status !== 'closed' ? (
                <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line)', display:'flex', gap:8 }}>
                  <textarea
                    className="form-textarea"
                    style={{ flex:1, minHeight:44, resize:'none' }}
                    placeholder="Type a reply…"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    id="support-reply"
                  />
                  <button className="btn btn-primary" onClick={sendReply} disabled={!reply.trim()}>
                    <Send size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ padding:12, borderTop:'1px solid var(--line)', textAlign:'center', color:'var(--slate)', fontSize:13 }}>
                  This ticket is closed.
                </div>
              )}
            </div>
          ) : (
            <div className="card empty-state">
              <div className="empty-state-icon"><MessageSquare size={28} /></div>
              <div className="empty-state-title">Select a ticket</div>
              <div className="empty-state-sub">Choose a support ticket to view the conversation.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
