import { useState } from 'react';
import { Search, Bell, RefreshCw, Trash2 } from 'lucide-react';
import { API_URL } from '../apiConfig';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function TopBar({ title, subtitle, onRefresh }: TopBarProps) {
  const [resetting, setResetting] = useState(false);

  const handleClearStaleData = async () => {
    if (!confirm('⚠️ Are you sure you want to wipe all stale bookings and technicians to start 100% fresh?')) {
      return;
    }
    setResetting(true);
    try {
      await fetch(`${API_URL}/api/admin/reset-data`, { method: 'POST' });
    } catch {
      // offline fallback
    } finally {
      window.location.reload();
    }
  };

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
        <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleClearStaleData}
            disabled={resetting}
            style={{
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              background: 'rgba(239, 68, 68, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '6px 12px',
            }}
            title="Wipe stale bookings and technicians"
          >
            <Trash2 size={13} />
            <span>{resetting ? 'Wiping...' : 'Clear All Stale Data'}</span>
          </button>

          <button
            className="topbar-btn"
            title="Refresh"
            id="topbar-refresh"
            onClick={onRefresh || (() => window.location.reload())}
          >
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
