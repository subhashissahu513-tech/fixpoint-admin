import { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import AdminLogin from './components/AdminLogin';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Technicians from './pages/Technicians';
import RateCard from './pages/RateCard';
import Payments from './pages/Payments';
import CustomItems from './pages/CustomItems';
import Coupons from './pages/Coupons';
import Config from './pages/Config';
import Fraud from './pages/Fraud';
import Support from './pages/Support';
import { API_URL } from './apiConfig';

type Page =
  | 'dashboard'
  | 'bookings'
  | 'technicians'
  | 'rate-card'
  | 'payments'
  | 'payouts'
  | 'custom-items'
  | 'coupons'
  | 'config'
  | 'fraud'
  | 'support';

const pageComponents: Record<Page, React.ComponentType> = {
  'dashboard': Dashboard,
  'bookings': Bookings,
  'technicians': Technicians,
  'rate-card': RateCard,
  'payments': Payments,
  'payouts': Payments,
  'custom-items': CustomItems,
  'coupons': Coupons,
  'config': Config,
  'fraud': Fraud,
  'support': Support,
};

export default function App() {
  const [admin, setAdmin] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('fixpoint_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState<Page>('dashboard');
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [techCount, setTechCount] = useState<number>(0);

  const fetchCounts = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/technicians`)
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        const active = (bData.bookings || []).filter((b: any) =>
          ['CONFIRMED', 'DISPATCHING', 'ASSIGNED', 'IN_PROGRESS'].includes(b.status)
        );
        setBookingCount(active.length);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        const pending = (tData.technicians || []).filter((t: any) =>
          t.kycStatus === 'PENDING_APPROVAL'
        );
        setTechCount(pending.length);
      }
    } catch (e) {
      // offline or server starting
    }
  };

  useEffect(() => {
    if (admin) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 4000);
      return () => clearInterval(interval);
    }
  }, [admin]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of the FixPoint Admin Console?')) {
      localStorage.removeItem('fixpoint_admin_user');
      setAdmin(null);
    }
  };

  if (!admin) {
    return <AdminLogin onLoginSuccess={setAdmin} />;
  }

  const PageComponent = pageComponents[page];

  return (
    <div className="app-layout">
      <Sidebar
        active={page}
        onNav={(p) => setPage(p as Page)}
        onLogout={handleLogout}
        bookingCount={bookingCount}
        techCount={techCount}
      />
      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  );
}
