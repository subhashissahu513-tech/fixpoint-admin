import { Zap, LayoutDashboard, ClipboardList, Users, CreditCard, Settings, AlertTriangle, MessageSquare, Tag, ShieldCheck, LogOut, Banknote, Star } from 'lucide-react';

interface SidebarProps {
  active: string;
  onNav: (page: string) => void;
  onLogout: () => void;
  bookingCount?: number;
  techCount?: number;
}

const navSections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'bookings', label: 'Bookings', icon: ClipboardList, badge: 3 },
      { id: 'technicians', label: 'Technicians', icon: Users, badge: 2 },
      { id: 'custom-items', label: 'Custom Items', icon: Star, badge: 1 },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'payouts', label: 'Payouts', icon: Banknote, badge: 2 },
      { id: 'coupons', label: 'Coupons', icon: Tag },
    ],
  },
  {
    label: 'Trust & Safety',
    items: [
      { id: 'fraud', label: 'Fraud Flags', icon: AlertTriangle, badge: 2 },
      { id: 'support', label: 'Support', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'rate-card', label: 'Rate Card', icon: ShieldCheck },
      { id: 'config', label: 'App Config', icon: Settings },
    ],
  },
];

export default function Sidebar({ active, onNav, onLogout, bookingCount = 0, techCount = 0 }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <Zap size={18} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">FixPoint</span>
          <span className="sidebar-logo-sub">Admin Console</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map(section => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map(item => {
              const badgeCount = item.id === 'bookings' ? bookingCount : item.id === 'technicians' ? techCount : 0;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => onNav(item.id)}
                >
                  <item.icon size={16} />
                  {item.label}
                  {badgeCount > 0 && (
                    <span className="nav-badge">{badgeCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sidebar-avatar">SA</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Super Admin</div>
              <div className="sidebar-user-role">admin@fixpoint.in</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 6,
              color: '#f87171',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
