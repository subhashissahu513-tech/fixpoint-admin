import { useState } from 'react';
import { Search, Bell, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { API_URL } from '../apiConfig';
import Modal from './Modal';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function TopBar({ title, subtitle, onRefresh }: TopBarProps) {
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const executeClear = async () => {
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
            onClick={() => setShowConfirm(true)}
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

      {showConfirm && (
        <Modal
          open
          title="Reset All Stale Data"
          onClose={() => setShowConfirm(false)}
          size="sm"
          footer={
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowConfirm(false)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={executeClear}
                disabled={resetting}
              >
                {resetting ? 'Wiping...' : 'Yes, Wipe Everything'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                Wipe all test data?
              </div>
              <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4, lineHeight: 1.5 }}>
                This will delete all bookings and registered technicians from the database, resetting your admin console to 0 active jobs and 0 revenue so you can start 100% fresh.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
