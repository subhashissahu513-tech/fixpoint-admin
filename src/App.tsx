import { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
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
  const [page, setPage] = useState<Page>('dashboard');
  const PageComponent = pageComponents[page];

  return (
    <div className="app-layout">
      <Sidebar active={page} onNav={(p) => setPage(p as Page)} />
      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  );
}
