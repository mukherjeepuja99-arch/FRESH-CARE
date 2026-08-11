import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  RefreshCw, 
  Phone, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Banknote,
  UserCheck,
  User,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Sparkles,
  Award,
  HelpCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Order, CartItem, UserProfile, Customer } from '../types';
import { InvoiceModal } from './InvoiceModal';

interface OrderHistoryViewProps {
  orders: Order[];
  userProfile?: UserProfile;
  customers?: Customer[];
  onReorder: (items: CartItem[]) => void;
  onShopNow: () => void;
  onOpenAuth?: () => void;
  onSelectCustomer?: (customer: Customer | UserProfile) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  userProfile,
  customers = [],
  onReorder,
  onShopNow,
  onOpenAuth,
  onSelectCustomer,
}) => {
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Order Placed' | 'Packed' | 'Out for Delivery' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected member state (defaults to logged-in user, or "Swapnil Mukherjee", or first customer)
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>(() => {
    if (userProfile?.isLoggedIn && userProfile.email) {
      return userProfile.email.toLowerCase();
    }
    // Default to Swapnil Mukherjee if available
    const swapnil = customers.find(c => c.name.toLowerCase().includes('swapnil') || c.email.toLowerCase().includes('swapnil'));
    if (swapnil) return swapnil.email.toLowerCase();
    return customers[0]?.email?.toLowerCase() || 'swapnil.mukherjee@example.com';
  });

  // Active member details
  const activeMember = useMemo(() => {
    if (userProfile?.isLoggedIn && userProfile.email && userProfile.email.toLowerCase() === selectedMemberEmail.toLowerCase()) {
      return {
        name: userProfile.name || 'Member',
        email: userProfile.email,
        phone: userProfile.phone || '+91 98300 45678',
        address: userProfile.address || 'House 22, Station Road, Garalgacha',
        city: userProfile.city || 'Dankuni',
        pincode: userProfile.pincode || '712311',
        membershipPlan: userProfile.membershipPlan || 'Fresh Care Prime Saver Plan',
        tier: 'Prime',
        isLoggedIn: true,
      };
    }

    const matchedCustomer = customers.find(c => c.email.toLowerCase() === selectedMemberEmail.toLowerCase());
    if (matchedCustomer) {
      return {
        name: matchedCustomer.name,
        email: matchedCustomer.email,
        phone: matchedCustomer.phone,
        address: matchedCustomer.address || 'Station Road, Garalgacha',
        city: 'Dankuni',
        pincode: '712311',
        membershipPlan: matchedCustomer.membershipTier === 'Prime' ? 'Fresh Care Prime Saver Plan' : matchedCustomer.membershipTier === 'Gold' ? 'Gold VIP Super Shopper' : 'Standard Community Member',
        tier: matchedCustomer.membershipTier || 'Prime',
        isLoggedIn: false,
      };
    }

    // Default fallback (Swapnil Mukherjee)
    return {
      name: 'Swapnil Mukherjee',
      email: 'swapnil.mukherjee@example.com',
      phone: '+91 98300 45678',
      address: 'House 22, Station Road, Garalgacha',
      city: 'Dankuni',
      pincode: '712311',
      membershipPlan: 'Fresh Care Prime Saver Plan',
      tier: 'Prime',
      isLoggedIn: userProfile?.isLoggedIn || false,
    };
  }, [userProfile, selectedMemberEmail, customers]);

  // STRICT PER-MEMBER ORDERS FILTERING
  const memberOrders = useMemo(() => {
    const targetEmail = activeMember.email.trim().toLowerCase();
    const targetName = activeMember.name.trim().toLowerCase();
    const targetPhoneDigits = activeMember.phone.replace(/\D/g, '').slice(-10);

    return orders.filter(order => {
      const orderEmail = (order.customer.email || '').trim().toLowerCase();
      const orderName = (order.customer.name || '').trim().toLowerCase();
      const orderPhoneDigits = (order.customer.phone || '').replace(/\D/g, '').slice(-10);

      // Match by email (exact)
      if (targetEmail && orderEmail && targetEmail === orderEmail) {
        return true;
      }

      // Match by full name
      if (targetName && orderName) {
        if (targetName === orderName) return true;
        // Check partial match for names like Swapnil Mukherjee
        const targetParts = targetName.split(' ');
        const orderParts = orderName.split(' ');
        if (targetParts[0] && orderParts[0] && targetParts[0] === orderParts[0] && targetParts[targetParts.length - 1] === orderParts[orderParts.length - 1]) {
          return true;
        }
      }

      // Match by 10-digit phone
      if (targetPhoneDigits && orderPhoneDigits && targetPhoneDigits === orderPhoneDigits) {
        return true;
      }

      return false;
    });
  }, [orders, activeMember]);

  // Filter member orders by status and search query
  const filteredOrders = useMemo(() => {
    return memberOrders.filter(order => {
      // Status filter
      if (statusFilter !== 'All' && order.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesOrderNum = order.orderNumber.toLowerCase().includes(query);
        const matchesInvoiceNum = order.invoiceNumber.toLowerCase().includes(query);
        const matchesProduct = order.items.some(i => i.product.name.toLowerCase().includes(query));
        const matchesPayment = order.paymentMethod.toLowerCase().includes(query);
        return matchesOrderNum || matchesInvoiceNum || matchesProduct || matchesPayment;
      }

      return true;
    });
  }, [memberOrders, statusFilter, searchQuery]);

  // Member Order Summary Metrics
  const memberSummary = useMemo(() => {
    const totalOrders = memberOrders.length;
    const totalSpent = memberOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeOrders = memberOrders.filter(o => o.status !== 'Delivered').length;
    const deliveredOrders = memberOrders.filter(o => o.status === 'Delivered').length;
    const totalSavings = memberOrders.reduce((sum, o) => sum + (o.discount || 0) + (o.deliveryFee === 0 ? 40 : 0), 0);

    return {
      totalOrders,
      totalSpent,
      activeOrders,
      deliveredOrders,
      totalSavings,
    };
  }, [memberOrders]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Bank Transfer':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Credit Card':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Cash on Delivery':
      default:
        return <Banknote className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <section className="py-8 lg:py-12 bg-slate-50 min-h-[700px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>Personalized Member Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Member Order History & Summary
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Private order summary, live tracking, delivery breakdown, and official tax invoices specific to your account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const text = `Hi Fresh Care Dankuni, I am ${activeMember.name}. I need an update on my grocery orders.`;
                window.open(`https://wa.me/917439915663?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Helpline (7439915663)</span>
            </button>

            <button
              onClick={onShopNow}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop More Groceries</span>
            </button>
          </div>
        </div>

        {/* Member Profile Switcher / Quick-Select Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Member Account:
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                (Switch between customers to preview specific order summaries)
              </span>
            </div>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>{userProfile?.isLoggedIn ? 'Manage Your Login' : 'Sign In with Email & Password'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Member Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {/* Swapnil Mukherjee (Featured Primary Button) */}
            <button
              id="select-member-swapnil"
              onClick={() => {
                setSelectedMemberEmail('swapnil.mukherjee@example.com');
                if (onSelectCustomer) {
                  onSelectCustomer({
                    id: 'cust-swapnil',
                    name: 'Swapnil Mukherjee',
                    email: 'swapnil.mukherjee@example.com',
                    phone: '+91 98300 45678',
                    address: 'House 22, Station Road, Garalgacha, Dankuni 712311',
                    totalOrders: 2,
                    totalSpent: 2640,
                    joinedDate: '2026-07-10',
                    membershipTier: 'Prime',
                  });
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMemberEmail.toLowerCase().includes('swapnil')
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                SM
              </span>
              <span>Swapnil Mukherjee</span>
              {selectedMemberEmail.toLowerCase().includes('swapnil') && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-normal">Active</span>
              )}
            </button>

            {/* Other Customers from Database */}
            {customers
              .filter(c => !c.name.toLowerCase().includes('swapnil'))
              .slice(0, 5)
              .map((c) => {
                const isSelected = selectedMemberEmail.toLowerCase() === c.email.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedMemberEmail(c.email.toLowerCase());
                      if (onSelectCustomer) onSelectCustomer(c);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-normal">Active</span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* MEMBER PROFILE & ORDER SUMMARY DASHBOARD CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Member Card Header */}
          <div className="p-6 sm:p-8 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              {/* Left Profile Info */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-2xl sm:text-3xl font-black font-['Outfit'] shadow-inner shrink-0">
                  {getInitials(activeMember.name)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Outfit']">
                      {activeMember.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Sparkles className="w-3 h-3" />
                      <span>{activeMember.membershipPlan}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                    <span className="font-mono">{activeMember.email}</span>
                    <span>•</span>
                    <span>{activeMember.phone}</span>
                  </p>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{activeMember.address}, {activeMember.city} - {activeMember.pincode}</span>
                  </p>
                </div>
              </div>

              {/* Right Privacy & Account Status */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2 border-t lg:border-t-0 border-slate-700/60 pt-3 lg:pt-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] text-emerald-300 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private Member Order Summary</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Showing confidential records for <strong>{activeMember.name}</strong> only
                </p>
              </div>

            </div>
          </div>

          {/* 5 KPI Summary Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200">
            {/* Metric 1: Total Orders */}
            <div className="p-4 sm:p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Orders
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {memberSummary.totalOrders}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Lifetime Placed</span>
            </div>

            {/* Metric 2: Total Spent */}
            <div className="p-4 sm:p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Spent
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-700 font-['Outfit']">
                  ₹{memberSummary.totalSpent}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Invoices Paid</span>
            </div>

            {/* Metric 3: Active Orders */}
            <div className="p-4 sm:p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                In Transit / Active
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-600" />
                <span className="text-xl sm:text-2xl font-black text-purple-700 font-['Outfit']">
                  {memberSummary.activeOrders}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Out for Delivery</span>
            </div>

            {/* Metric 4: Delivered */}
            <div className="p-4 sm:p-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Delivered
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {memberSummary.deliveredOrders}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Completed Orders</span>
            </div>

            {/* Metric 5: Prime Savings */}
            <div className="p-4 sm:p-5 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Member Savings
              </span>
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xl sm:text-2xl font-black text-amber-600 font-['Outfit']">
                  ₹{memberSummary.totalSavings}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Free Express Deliveries</span>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            {(['All', 'Out for Delivery', 'Packed', 'Delivered'] as const).map((status) => {
              const count = status === 'All' 
                ? memberOrders.length 
                : memberOrders.filter(o => o.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{status}</span>
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, invoice, item..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>
        </div>

        {/* MEMBER-SPECIFIC ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
              📦
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                No Orders Found for {activeMember.name}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {searchQuery || statusFilter !== 'All'
                  ? 'No orders match your current filters. Try resetting the search or status filter.'
                  : `There are currently no orders placed under ${activeMember.email}. Place your first grocery order to track deliveries and access official tax invoices.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {(searchQuery || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}

              <button
                onClick={onShopNow}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Shop Pure Spices & Groceries
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                id={`order-card-${order.orderNumber}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      📦
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm font-['Outfit']">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({order.invoiceNumber})
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>Placed: {order.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {getPaymentIcon(order.paymentMethod)}
                          <strong className="text-slate-700">{order.paymentMethod}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">Customer: {order.customer.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-right pr-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Grand Total</span>
                      <span className="text-base sm:text-lg font-black text-emerald-700 font-['Outfit']">
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    <button
                      id={`btn-invoice-${order.orderNumber}`}
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tax Invoice</span>
                    </button>

                    <button
                      id={`btn-reorder-${order.orderNumber}`}
                      onClick={() => onReorder(order.items)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      title="Reorder these items"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-order</span>
                    </button>
                  </div>
                </div>

                {/* Live Timeline Tracker */}
                <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live Delivery Progress:
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Assigned Rider: <strong className="text-slate-800">{order.deliveryPartnerName || 'Rajesh Kumar (FreshCare Express)'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center relative max-w-3xl mx-auto py-1">
                    {/* Connecting Bar */}
                    <div className="absolute top-3.5 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{
                          width:
                            order.status === 'Delivered'
                              ? '100%'
                              : order.status === 'Out for Delivery'
                              ? '66%'
                              : order.status === 'Packed'
                              ? '33%'
                              : '0%',
                        }}
                      />
                    </div>

                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-1">Order Placed</span>
                      <span className="text-[10px] text-slate-400">Received at Hub</span>
                    </div>

                    {/* Step 2: Packed */}
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          ['Packed', 'Out for Delivery', 'Delivered'].includes(order.status)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {['Packed', 'Out for Delivery', 'Delivered'].includes(order.status) ? '✓' : '2'}
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-1">Packed</span>
                      <span className="text-[10px] text-slate-400">Quality Checked</span>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          ['Out for Delivery', 'Delivered'].includes(order.status)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {order.status === 'Delivered' ? '✓' : '🚚'}
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-1">Dispatched</span>
                      <span className="text-[10px] text-slate-400">With Rajesh Kumar</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {order.status === 'Delivered' ? '🎉' : '4'}
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-1">Delivered</span>
                      <span className="text-[10px] text-slate-400">At Doorstep</span>
                    </div>
                  </div>
                </div>

                {/* Items & Address + Bill Charges Breakdown Details */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/40">
                  {/* Items list */}
                  <div className="md:col-span-7 space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      Ordered Grocery Items ({order.items.length}):
                    </span>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {item.product.name}
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Weight: {item.selectedWeight} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-slate-900 shrink-0">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location & Bill Breakdown */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Delivery Destination (Dankuni Hub):
                      </span>
                      <p className="font-bold text-slate-900">{order.customer.name}</p>
                      <p className="text-slate-600 leading-snug">{order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{order.customer.phone}</p>
                    </div>

                    {/* Financial Bill Details */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Charges & Invoice Summary:
                      </span>
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-slate-800">₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Charge</span>
                        <span className="font-semibold text-emerald-700">
                          {order.deliveryFee === 0 ? 'FREE (Prime Saver)' : `₹${order.deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Handling & Packaging</span>
                        <span className="font-semibold text-slate-800">₹{order.handlingFee || 15}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Member Discount</span>
                          <span>-₹{order.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Grand Total Paid</span>
                        <span className="text-emerald-700 font-['Outfit'] text-sm sm:text-base">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Invoice Modal for Customer */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </section>
  );
};
