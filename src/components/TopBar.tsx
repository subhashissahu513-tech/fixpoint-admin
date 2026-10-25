import { Search, Bell, RefreshCw } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-search">
          <Search size={14} className="topbar-search-icon" />
          <input
            className="topbar-search-input"
            placeholder="Search bookings, technicians…"
            id="topbar-search"
          />
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn" title="Refresh" id="topbar-refresh">
            <RefreshCw size={15} />
          </button>
          <button className="topbar-btn" title="Notifications" id="topbar-notifications">
            <Bell size={15} />
            <span className="topbar-notif-dot" />
          </button>
        </div>
      </div>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </>
  );
}
