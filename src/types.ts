export type CategoryType = 'all' | 'spices' | 'dry-fruits' | 'dals' | 'rice';

export type UserRole = 'portal' | 'member' | 'owner' | 'delivery';

export interface OwnerAuth {
  isAuthenticated: boolean;
  username: string;
  lastLogin?: string;
}

export interface DeliveryAuth {
  isAuthenticated: boolean;
  riderId: string;
  riderName: string;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  itemCount: number;
  badgeColor: string;
  accentColor: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'spices' | 'dry-fruits' | 'dals' | 'rice';
  categoryName: string;
  price: number;
  originalPrice?: number;
  weight: string;
  availableWeights: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  description: string;
  origin: string;
  organic: boolean;
  features: string[];
  storageTips: string;
  shelfLife: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export type OrderStatus = 'Order Placed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentMethodType = 'UPI' | 'Bank Transfer' | 'Credit Card' | 'Cash on Delivery';

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface PaymentDetails {
  method: PaymentMethodType;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  transactionRef?: string;
  cardLast4?: string;
  cardHolderName?: string;
  status: 'Paid' | 'Pending Verification' | 'Due on Delivery';
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentDetails?: PaymentDetails;
  deliveryPartnerName?: string;
  deliveryNotes?: string;
  timeline: {
    status: OrderStatus;
    time: string;
    completed: boolean;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  membershipTier?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  activeDeliveriesCount: number;
  completedToday: number;
  totalEarnings: number;
  status: 'Active' | 'On Break';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isLoggedIn: boolean;
  membershipPlan?: string;
}

// Day 3 Firestore Data Schema Types
export interface MemberRecord {
  id?: string;
  name: string;
  phone: string;
  email: string;
  membershipPlan: string;
  joinDate: string;
  activeStatus: boolean | 'Active' | 'Inactive';
  address?: string;
  city?: string;
  pincode?: string;
  createdAt?: string;
}

export interface TrainerRecord {
  id?: string;
  trainerName: string;
  specialty: string;
  experience: string;
  availability: 'Available' | 'Slots Open' | 'Busy' | 'On Leave';
  bio?: string;
  phone?: string;
  image?: string;
}

export interface MembershipPlanRecord {
  id?: string;
  planName: string;
  price: string;
  duration: string;
  benefits: string[];
  recommended?: boolean;
}

export interface AnnouncementRecord {
  id?: string;
  title: string;
  message: string;
  date: string;
  activeStatus: boolean;
  priority?: 'High' | 'Normal' | 'Info';
}
