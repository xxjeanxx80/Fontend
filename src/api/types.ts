export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta?: PaginationMeta;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  userId?: number;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Spa {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  heroImageUrl?: string;
  coverImageUrl?: string;
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
  categories?: string[];
  amenities?: string[];
  openingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  ownerId?: number;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  spaId?: number;
  category?: string;
  imageUrl?: string;
  currency?: string;
  serviceType?: 'AT_SPA' | 'AT_HOME';
  availableAtHome?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  avatarUrl?: string;
  rating?: number;
  spaId?: number;
  bio?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffShift {
  id: number;
  staffId: number;
  startTime: string;
  endTime: string;
  createdAt?: string;
}

export interface StaffTimeOff {
  id: number;
  staffId: number;
  startAt: string;
  endAt: string;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export interface Booking {
  id: number;
  spaId: number;
  serviceId: number;
  customerId: number;
  staffId?: number;
  status?: BookingStatus;
  scheduledAt: string;
  createdAt?: string;
  updatedAt?: string;
  spa?: Spa;
  service?: Service;
  staff?: Staff;
  customer?: Customer;
  totalPrice?: number;
  couponCode?: string;
  locationType?: 'AT_HOME' | 'AT_SPA';
  notes?: string;
}

export interface LoyaltySummary {
  points: number;
  rank?: string;
  tierName?: string;
  nextTierPoints?: number;
  history?: Array<{
    id: number;
    points: number;
    reason?: string;
    createdAt: string;
  }>;
}

export interface Feedback {
  id: number;
  bookingId: number;
  customerId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface OAuthProviderConfig {
  provider: 'google' | 'facebook';
  authorizeUrl: string;
  enabled: boolean;
}

export interface Payout {
  id: number;
  ownerId?: number;
  spaId?: number;
  amount: number;
  status: 'REQUESTED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  notes?: string;
  requestedAt?: string;
  processedAt?: string;
}

export interface DashboardSnapshot {
  totalRevenue: number;
  completedBookings: number;
  averageRating: number;
  pendingPayouts?: number;
  upcomingBookings?: number;
}
