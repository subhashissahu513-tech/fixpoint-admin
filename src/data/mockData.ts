// ─── FixPoint Admin — Mock Data ───────────────────────────────────────────────

export const mockStats = {
  todayBookings: 47,
  todayBookingsDelta: +18,
  gmv: 184350, // paise
  gmvDelta: +12,
  commission: 27652,
  commissionDelta: +15,
  pendingPayouts: 8,
  conversionRate: 73,
  conversionDelta: +4,
  avgEta: 28,
  cancelRate: 6,
  addonRate: 64,
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

export const mockBookings: Booking[] = [
  { id:'b001', code:'FX-24001', customer:'Rahul Sharma', phone:'98765XXXXX', technician:'Suresh Kumar', technicianId:'t001', category:'Electrician', services:['Fan Repair','Switch Replacement'], address:'DLF Phase 2, Gurugram', slot:'2026-10-24 10:00', status:'IN_PROGRESS', visitCharge:9900, quoteTotal:45000, commission:6750, createdAt:'2026-10-24T07:30:00Z', updatedAt:'2026-10-24T09:45:00Z' },
  { id:'b002', code:'FX-24002', customer:'Priya Mehta', phone:'91234XXXXX', technician:'Ramesh Singh', technicianId:'t002', category:'Electrician', services:['MCB Replacement'], address:'Sector 56, Gurugram', slot:'2026-10-24 11:00', status:'QUOTE_SENT', visitCharge:9900, quoteTotal:20000, commission:3000, createdAt:'2026-10-24T08:00:00Z', updatedAt:'2026-10-24T10:10:00Z' },
  { id:'b003', code:'FX-24003', customer:'Amit Gupta', phone:'99887XXXXX', technician:'Vijay Yadav', technicianId:'t003', category:'Electrician', services:['Geyser Installation'], address:'Sector 14, Gurugram', slot:'2026-10-24 12:00', status:'EN_ROUTE', visitCharge:9900, quoteTotal:100000, commission:15000, createdAt:'2026-10-24T09:00:00Z', updatedAt:'2026-10-24T10:30:00Z' },
  { id:'b004', code:'FX-24004', customer:'Sneha Patel', phone:'87654XXXXX', technician:null, technicianId:null, category:'Electrician', services:['Light Fixture Installation'], address:'Sector 29, Gurugram', slot:'2026-10-24 14:00', status:'DISPATCHING', visitCharge:9900, quoteTotal:0, commission:0, createdAt:'2026-10-24T10:00:00Z', updatedAt:'2026-10-24T10:35:00Z' },
  { id:'b005', code:'FX-24005', customer:'Deepak Nair', phone:'76543XXXXX', technician:'Suresh Kumar', technicianId:'t001', category:'Electrician', services:['Wiring','AC Point'], address:'Golf Course Rd, Gurugram', slot:'2026-10-23 15:00', status:'COMPLETED', visitCharge:9900, quoteTotal:220000, commission:33000, createdAt:'2026-10-23T12:00:00Z', updatedAt:'2026-10-23T18:30:00Z' },
  { id:'b006', code:'FX-24006', customer:'Kavita Roy', phone:'65432XXXXX', technician:'Ramesh Singh', technicianId:'t002', category:'Electrician', services:['Chandelier Installation'], address:'MG Road, Gurugram', slot:'2026-10-23 11:00', status:'COMPLETED', visitCharge:9900, quoteTotal:65000, commission:9750, createdAt:'2026-10-23T08:00:00Z', updatedAt:'2026-10-23T15:20:00Z' },
  { id:'b007', code:'FX-24007', customer:'Mohan Das', phone:'54321XXXXX', technician:null, technicianId:null, category:'Electrician', services:['Fan Installation'], address:'Sushant Lok, Gurugram', slot:'2026-10-24 16:00', status:'CONFIRMED', visitCharge:9900, quoteTotal:0, commission:0, createdAt:'2026-10-24T10:15:00Z', updatedAt:'2026-10-24T10:15:00Z' },
  { id:'b008', code:'FX-24008', customer:'Anjali Verma', phone:'43210XXXXX', technician:null, technicianId:null, category:'Electrician', services:['Switchboard Replacement'], address:'Palam Vihar, Gurugram', slot:'2026-10-24 17:00', status:'CANCELLED', visitCharge:9900, quoteTotal:0, commission:0, createdAt:'2026-10-24T07:00:00Z', updatedAt:'2026-10-24T08:30:00Z' },
  { id:'b009', code:'FX-24009', customer:'Rajesh Kumar', phone:'32109XXXXX', technician:'Vijay Yadav', technicianId:'t003', category:'Electrician', services:['DB Fitting'], address:'Nirvana Country, Gurugram', slot:'2026-10-24 10:30', status:'WORK_DONE', visitCharge:9900, quoteTotal:135000, commission:20250, createdAt:'2026-10-24T06:30:00Z', updatedAt:'2026-10-24T10:00:00Z' },
  { id:'b010', code:'FX-24010', customer:'Sunita Joshi', phone:'21098XXXXX', technician:'Suresh Kumar', technicianId:'t001', category:'Electrician', services:['Earthing Installation'], address:'DLF City, Gurugram', slot:'2026-10-24 09:00', status:'DISPUTED', visitCharge:9900, quoteTotal:525000, commission:78750, createdAt:'2026-10-24T05:00:00Z', updatedAt:'2026-10-24T09:30:00Z' },
];

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

export const mockTechnicians: Technician[] = [
  { id:'t001', name:'Suresh Kumar', phone:'98765XXXXX', status:'approved', skills:['Electrician'], rating:4.8, ratingCount:124, jobsCompleted:156, acceptanceRate:0.94, commissionBps:null, isOnline:true, lastSeen:'2 min ago', joinedAt:'2025-03-15', earnings:8450000, strikes:0, area:'DLF Phase 1-4', kyc:'approved' },
  { id:'t002', name:'Ramesh Singh', phone:'91234XXXXX', status:'approved', skills:['Electrician'], rating:4.5, ratingCount:87, jobsCompleted:102, acceptanceRate:0.88, commissionBps:1200, isOnline:false, lastSeen:'45 min ago', joinedAt:'2025-05-20', earnings:4200000, strikes:1, area:'Sector 40-70', kyc:'approved' },
  { id:'t003', name:'Vijay Yadav', phone:'99887XXXXX', status:'approved', skills:['Electrician'], rating:4.7, ratingCount:63, jobsCompleted:78, acceptanceRate:0.91, commissionBps:null, isOnline:true, lastSeen:'Online', joinedAt:'2025-07-10', earnings:3150000, strikes:0, area:'Sohna Rd', kyc:'approved' },
  { id:'t004', name:'Manoj Thakur', phone:'87654XXXXX', status:'pending', skills:['Electrician'], rating:0, ratingCount:0, jobsCompleted:0, acceptanceRate:1, commissionBps:null, isOnline:false, lastSeen:'Never', joinedAt:'2026-10-20', earnings:0, strikes:0, area:'MG Road', kyc:'pending' },
  { id:'t005', name:'Prakash Gupta', phone:'76543XXXXX', status:'suspended', skills:['Electrician'], rating:3.2, ratingCount:15, jobsCompleted:18, acceptanceRate:0.65, commissionBps:null, isOnline:false, lastSeen:'3 days ago', joinedAt:'2025-09-01', earnings:720000, strikes:3, area:'Palam Vihar', kyc:'approved' },
  { id:'t006', name:'Ravi Shankar', phone:'65432XXXXX', status:'pending', skills:['Electrician'], rating:0, ratingCount:0, jobsCompleted:0, acceptanceRate:1, commissionBps:null, isOnline:false, lastSeen:'Never', joinedAt:'2026-10-23', earnings:0, strikes:0, area:'Sector 14-30', kyc:'pending' },
];

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

export const mockPayments: Payment[] = [
  { id:'p001', bookingCode:'FX-24005', customer:'Deepak Nair', kind:'visit', amount:9900, status:'captured', method:'UPI', gatewayId:'pay_XXXXXXA1', date:'2026-10-23T12:05:00Z' },
  { id:'p002', bookingCode:'FX-24005', customer:'Deepak Nair', kind:'balance', amount:210000, status:'captured', method:'Card', gatewayId:'pay_XXXXXXA2', date:'2026-10-23T18:25:00Z' },
  { id:'p003', bookingCode:'FX-24006', customer:'Kavita Roy', kind:'visit', amount:9900, status:'captured', method:'UPI', gatewayId:'pay_XXXXXXB1', date:'2026-10-23T08:10:00Z' },
  { id:'p004', bookingCode:'FX-24006', customer:'Kavita Roy', kind:'balance', amount:55100, status:'captured', method:'NetBanking', gatewayId:'pay_XXXXXXB2', date:'2026-10-23T15:10:00Z' },
  { id:'p005', bookingCode:'FX-24001', customer:'Rahul Sharma', kind:'visit', amount:9900, status:'captured', method:'UPI', gatewayId:'pay_XXXXXXC1', date:'2026-10-24T07:35:00Z' },
  { id:'p006', bookingCode:'FX-24007', customer:'Mohan Das', kind:'visit', amount:9900, status:'captured', method:'Card', gatewayId:'pay_XXXXXXD1', date:'2026-10-24T10:16:00Z' },
  { id:'p007', bookingCode:'FX-24008', customer:'Anjali Verma', kind:'visit', amount:9900, status:'refunded', method:'UPI', gatewayId:'pay_XXXXXXE1', date:'2026-10-24T07:05:00Z' },
  { id:'p008', bookingCode:'FX-24002', customer:'Priya Mehta', kind:'visit', amount:9900, status:'captured', method:'Wallet', gatewayId:'pay_XXXXXXF1', date:'2026-10-24T08:05:00Z' },
];

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

export const mockPayouts: Payout[] = [
  { id:'po001', bookingCode:'FX-24005', technician:'Suresh Kumar', gross:210000, commission:31500, net:178500, status:'paid', transferId:'rout_XXXXX01', settledAt:'2026-10-23T19:00:00Z', createdAt:'2026-10-23T18:30:00Z' },
  { id:'po002', bookingCode:'FX-24006', technician:'Ramesh Singh', gross:55100, commission:8265, net:46835, status:'paid', transferId:'rout_XXXXX02', settledAt:'2026-10-23T16:00:00Z', createdAt:'2026-10-23T15:25:00Z' },
  { id:'po003', bookingCode:'FX-24009', technician:'Vijay Yadav', gross:125100, commission:18765, net:106335, status:'pending', transferId:null, settledAt:null, createdAt:'2026-10-24T10:05:00Z' },
  { id:'po004', bookingCode:'FX-24010', technician:'Suresh Kumar', gross:515100, commission:77265, net:437835, status:'held', transferId:null, settledAt:null, createdAt:'2026-10-24T09:35:00Z' },
];

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

export const mockCustomItems: CustomItemRequest[] = [
  { id:'ci001', bookingCode:'FX-24001', technician:'Suresh Kumar', title:'Custom LED strip wiring (5m)', qty:1, proposedPrice:120000, status:'pending', reviewNote:null, createdAt:'2026-10-24T09:00:00Z' },
  { id:'ci002', bookingCode:'FX-24009', technician:'Vijay Yadav', title:'3-phase manual changeover switch installation', qty:1, proposedPrice:350000, status:'approved', reviewNote:'Approved at ₹3500 — standard market rate', createdAt:'2026-10-24T07:30:00Z' },
  { id:'ci003', bookingCode:'FX-24005', technician:'Suresh Kumar', title:'UPS bypass panel wiring', qty:1, proposedPrice:500000, status:'rejected', reviewNote:'Out of scope for standard service', createdAt:'2026-10-23T14:00:00Z' },
];

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

export const chartDataRevenue = [
  { date:'Oct 18', gmv:62000, commission:9300 },
  { date:'Oct 19', gmv:78000, commission:11700 },
  { date:'Oct 20', gmv:95000, commission:14250 },
  { date:'Oct 21', gmv:71000, commission:10650 },
  { date:'Oct 22', gmv:112000, commission:16800 },
  { date:'Oct 23', gmv:143000, commission:21450 },
  { date:'Oct 24', gmv:184350, commission:27652 },
];

export const chartDataBookings = [
  { date:'Oct 18', total:18, completed:14, cancelled:2 },
  { date:'Oct 19', total:24, completed:19, cancelled:3 },
  { date:'Oct 20', total:31, completed:26, cancelled:2 },
  { date:'Oct 21', total:22, completed:17, cancelled:4 },
  { date:'Oct 22', total:38, completed:33, cancelled:3 },
  { date:'Oct 23', total:43, completed:39, cancelled:2 },
  { date:'Oct 24', total:47, completed:35, cancelled:1 },
];

export const funnelData = [
  { stage:'Visited', count:1240 },
  { stage:'Added to Cart', count:634 },
  { stage:'Reached Checkout', count:312 },
  { stage:'Confirmed Booking', count:228 },
  { stage:'Completed', count:175 },
];

export interface FraudFlag {
  id: string;
  type: string;
  subject: string;
  reason: string;
  score: number;
  resolved: boolean;
  createdAt: string;
}

export const mockFraudFlags: FraudFlag[] = [
  { id:'f001', type:'technician', subject:'Ramesh Singh', reason:'Add-on ratio > 3x average (82% of bookings)', score:0.78, resolved:false, createdAt:'2026-10-24T06:00:00Z' },
  { id:'f002', type:'customer', subject:'91234XXXXX', reason:'6 cancellations in 7 days (all after chat)', score:0.65, resolved:false, createdAt:'2026-10-23T22:00:00Z' },
  { id:'f003', type:'technician', subject:'Prakash Gupta', reason:'Location mismatch on 3 "Arrived" events', score:0.91, resolved:true, createdAt:'2026-10-22T14:00:00Z' },
];

export const formatPaise = (paise: number) => {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees/100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees/1000).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
};

export const formatPaiseExact = (paise: number) => {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
};
