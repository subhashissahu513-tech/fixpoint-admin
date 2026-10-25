// ─── FixPoint Admin — Data Definitions & Clean Zero States ──────────────────────

export const mockStats = {
  todayBookings: 0,
  todayBookingsDelta: 0,
  gmv: 0,
  gmvDelta: 0,
  commission: 0,
  commissionDelta: 0,
  pendingPayouts: 0,
  conversionRate: 0,
  conversionDelta: 0,
  avgEta: 0,
  cancelRate: 0,
  addonRate: 0,
};

export const bookingStatuses = [
  'CONFIRMED','DISPATCHING','ASSIGNED','EN_ROUTE','ARRIVED',
  'DIAGNOSING','QUOTE_SENT','IN_PROGRESS','WORK_DONE','PAYMENT_DUE',
  'COMPLETED','CANCELLED','DISPUTED',
] as const;

export type BookingStatus = typeof bookingStatuses[number];

export interface Booking {
  id: string;
  code: string;
  customer: string;
  phone: string;
  technician: string | null;
  technicianId: string | null;
  category: string;
  services: string[];
  address: string;
  slot: string;
  status: BookingStatus;
  visitCharge: number;
  quoteTotal: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
}

export const mockBookings: Booking[] = [];

export interface Technician {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  skills: string[];
  rating: number;
  ratingCount: number;
  jobsCompleted: number;
  acceptanceRate: number;
  commissionBps: number | null;
  isOnline: boolean;
  lastSeen: string;
  joinedAt: string;
  earnings: number;
  strikes: number;
  area: string;
  kyc: 'pending' | 'approved' | 'rejected';
}

export const mockTechnicians: Technician[] = [];

export interface RateCardItem {
  id: string;
  group: string;
  name: string;
  unit: string;
  minPaise: number;
  maxPaise: number;
  defaultPaise: number;
  requiresPhoto: boolean;
  warrantyDays: number;
  isActive: boolean;
  sort: number;
  description?: string;
  image?: string;
  mrpPaise?: number;
  badge?: string;
}

export const rateCardGroups = ['Visit','Light','Fan','Switch & socket','MCB & fuse','Appliance points','Geyser','Earthing','Wiring','Service line','Inverter & stabilizer','Diagnosis','Major'];

export const mockRateCard: RateCardItem[] = [
  { id:'s001', group:'Visit', name:'Visit & diagnosis', unit:'per visit', minPaise:9900, maxPaise:9900, defaultPaise:9900, requiresPhoto:false, warrantyDays:0, isActive:true, sort:0 },
  { id:'s002', group:'Light', name:'Light fixture / tube installation', unit:'per fixture', minPaise:15000, maxPaise:40000, defaultPaise:28000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:1 },
  { id:'s003', group:'Light', name:'Chandelier / decorative installation', unit:'per fixture', minPaise:40000, maxPaise:90000, defaultPaise:65000, requiresPhoto:true, warrantyDays:30, isActive:true, sort:2 },
  { id:'s004', group:'Light', name:'Ceiling rose / holder replacement', unit:'per unit', minPaise:5000, maxPaise:15000, defaultPaise:10000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:3 },
  { id:'s005', group:'Light', name:'LED panel / downlight installation', unit:'per unit', minPaise:15000, maxPaise:35000, defaultPaise:25000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:4 },
  { id:'s006', group:'Fan', name:'Ceiling / wall / exhaust fan installation', unit:'per fan', minPaise:20000, maxPaise:45000, defaultPaise:33000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:5 },
  { id:'s007', group:'Fan', name:'Fan repair (regulator, capacitor, bearing)', unit:'per fan', minPaise:15000, maxPaise:35000, defaultPaise:25000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:6 },
  { id:'s008', group:'Fan', name:'Ceiling fan regulator replacement', unit:'per unit', minPaise:10000, maxPaise:25000, defaultPaise:17000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:7 },
  { id:'s009', group:'Switch & socket', name:'Switch / socket replacement (basic)', unit:'per point', minPaise:9000, maxPaise:30000, defaultPaise:20000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:8 },
  { id:'s010', group:'Switch & socket', name:'15A switch + socket replacement', unit:'per point', minPaise:20000, maxPaise:50000, defaultPaise:35000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:9 },
  { id:'s011', group:'MCB & fuse', name:'Single MCB replacement', unit:'per unit', minPaise:10000, maxPaise:30000, defaultPaise:20000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:10 },
  { id:'s012', group:'MCB & fuse', name:'ELCB / RCCB replacement', unit:'per unit', minPaise:30000, maxPaise:50000, defaultPaise:40000, requiresPhoto:true, warrantyDays:30, isActive:true, sort:11 },
  { id:'s013', group:'MCB & fuse', name:'New DB with multiple MCBs', unit:'per board', minPaise:80000, maxPaise:150000, defaultPaise:115000, requiresPhoto:true, warrantyDays:30, isActive:true, sort:12 },
  { id:'s014', group:'Geyser', name:'Geyser installation (electrical + mount)', unit:'per unit', minPaise:50000, maxPaise:150000, defaultPaise:100000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:13 },
  { id:'s015', group:'Geyser', name:'Geyser service (descale + minor wiring)', unit:'per unit', minPaise:40000, maxPaise:90000, defaultPaise:65000, requiresPhoto:false, warrantyDays:30, isActive:true, sort:14 },
  { id:'s016', group:'Earthing', name:'Complete earthing kit installation', unit:'per kit', minPaise:250000, maxPaise:800000, defaultPaise:525000, requiresPhoto:true, warrantyDays:30, isActive:true, sort:15 },
  { id:'s017', group:'Wiring', name:'1.5 sq mm wire laying', unit:'per ft', minPaise:600, maxPaise:800, defaultPaise:700, requiresPhoto:false, warrantyDays:30, isActive:true, sort:16 },
  { id:'s018', group:'Wiring', name:'2.5 sq mm wire laying', unit:'per ft', minPaise:800, maxPaise:1000, defaultPaise:900, requiresPhoto:false, warrantyDays:30, isActive:true, sort:17 },
  { id:'s019', group:'Appliance points', name:'AC point wiring (dedicated 15A)', unit:'per point', minPaise:80000, maxPaise:250000, defaultPaise:165000, requiresPhoto:true, warrantyDays:30, isActive:true, sort:18 },
  { id:'s020', group:'Diagnosis', name:'Fault-finding (hidden/buried joint)', unit:'per hour', minPaise:20000, maxPaise:70000, defaultPaise:45000, requiresPhoto:false, warrantyDays:0, isActive:true, sort:19 },
];

export interface Payment {
  id: string;
  bookingCode: string;
  customer: string;
  kind: 'visit' | 'balance' | 'refund';
  amount: number;
  status: 'captured' | 'failed' | 'refunded' | 'created';
  method: string;
  gatewayId: string;
  date: string;
}

export const mockPayments: Payment[] = [];

export interface Payout {
  id: string;
  bookingCode: string;
  technician: string;
  gross: number;
  commission: number;
  net: number;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'held';
  transferId: string | null;
  settledAt: string | null;
  createdAt: string;
}

export const mockPayouts: Payout[] = [];

export interface CustomItemRequest {
  id: string;
  bookingCode: string;
  technician: string;
  title: string;
  qty: number;
  proposedPrice: number;
  approvedPrice?: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote: string | null;
  createdAt: string;
}

export const mockCustomItems: CustomItemRequest[] = [];

export const appConfig = {
  commission_bps: 1500,
  visit_charge_paise: 9900,
  visit_policy: 'adjust',
  photo_threshold_paise: 15000,
  quote_cap_paise: 300000,
  quote_expiry_min: 30,
  otp_ttl_sec: 300,
  dispatch_radius_km: [5, 8, 12],
  dispatch_timeout_sec: 30,
  warranty_days: 30,
  cancellation_fee_paise: 4900,
  serviceable_pincodes: ['122001','122002','122003','122010','122011','122016','122018'],
};

export const chartDataRevenue: { date: string; gmv: number; commission: number }[] = [];
export const chartDataBookings: { date: string; total: number; completed: number; cancelled: number }[] = [];
export const funnelData: { stage: string; count: number }[] = [];

export interface FraudFlag {
  id: string;
  type: string;
  subject: string;
  reason: string;
  score: number;
  resolved: boolean;
  createdAt: string;
}

export const mockFraudFlags: FraudFlag[] = [];

export const formatPaise = (paise: number) => {
  const rupees = (paise || 0) / 100;
  if (rupees >= 100000) return `₹${(rupees/100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees/1000).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
};

export const formatPaiseExact = (paise: number) => {
  return `₹${((paise || 0) / 100).toLocaleString('en-IN')}`;
};
