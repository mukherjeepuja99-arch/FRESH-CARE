import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  Users, 
  Truck, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Search, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Filter,
  FileText,
  Phone,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  ExternalLink,
  ChevronRight,
  Eye,
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
  Database,
  Award,
  UserCheck,
  Bell
} from 'lucide-react';
import { 
  Product, 
  Order, 
  Customer, 
  DeliveryPartner, 
  OrderStatus, 
  CategoryType,
  MemberRecord,
  TrainerRecord,
  MembershipPlanRecord,
  AnnouncementRecord
} from '../types';
import { InvoiceModal } from './InvoiceModal';

interface OwnerDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  deliveryPartner: DeliveryPartner;
  members?: MemberRecord[];
  membershipPlans?: MembershipPlanRecord[];
  trainers?: TrainerRecord[];
  announcements?: AnnouncementRecord[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddMember?: (member: Omit<MemberRecord, 'id'>) => void;
  onAddTrainer?: (trainer: Omit<TrainerRecord, 'id'>) => void;
  onAddAnnouncement?: (announcement: Omit<AnnouncementRecord, 'id'>) => void;
  onLogoutOwner?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  products,
  orders,
  customers,
  deliveryPartner,
  members = [],
  membershipPlans = [],
  trainers = [],
  announcements = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddMember,
  onAddTrainer,
  onAddAnnouncement,
  onLogoutOwner,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'incoming-orders' | 'products' | 'orders' | 'customers' | 'deliveries' | 'firestore'>('overview');
  const [firestoreSubTab, setFirestoreSubTab] = useState<'members' | 'plans' | 'trainers' | 'announcements'>('members');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Fresh Care Prime Saver Plan');
  const [newMemberAddress, setNewMemberAddress] = useState('Garalgacha, Dankuni');

  // New Trainer Modal State
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerSpecialty, setNewTrainerSpecialty] = useState('');
  const [newTrainerExp, setNewTrainerExp] = useState('5+ Years');
  const [newTrainerBio, setNewTrainerBio] = useState('');

  // New Announcement Modal State
  const [showAddAnnounceModal, setShowAddAnnounceModal] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceMsg, setNewAnnounceMsg] = useState('');
  const [newAnnouncePriority, setNewAnnouncePriority] = useState<'High' | 'Normal' | 'Info'>('High');

  // Selected Order for Detailed Inspector & Invoice
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(orders[0] || null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  
  // Checklist items for packing physical orders
  const [packingChecklist, setPackingChecklist] = useState<Record<string, boolean>>({});

  // New Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'spices',
    categoryName: 'Spices',
    price: 150,
    originalPrice: 180,
    weight: '250g',
    availableWeights: ['250g', '500g', '1kg'],
    inStock: true,
    stockQuantity: 50,
    description: '',
    origin: 'Direct Farm Partner, Dankuni Region',
    organic: true,
    features: ['100% Pure', 'Naturally Processed'],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    shelfLife: '12 Months',
    storageTips: 'Store in an airtight jar in a cool pantry.',
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const newIncomingOrders = orders.filter(o => o.status === 'Order Placed');

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'spices',
      categoryName: 'Spices',
      price: 150,
      originalPrice: 180,
      weight: '250g',
      availableWeights: ['250g', '500g', '1kg'],
      inStock: true,
      stockQuantity: 50,
      description: '',
      origin: 'Garalgacha, Dankuni 712311',
      organic: true,
      features: ['100% Pure', 'Naturally Processed'],
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      shelfLife: '12 Months',
      storageTips: 'Store in an airtight jar in a cool pantry.',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const categoryNames: Record<string, string> = {
      spices: 'Spices',
      'dry-fruits': 'Dry Fruits',
      dals: 'Dals & Pulses',
      rice: 'Rice & Grains',
    };

    const targetCategory = formData.category || 'spices';
    const catName = categoryNames[targetCategory] || 'Spices';

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...formData,
        name: formData.name || editingProduct.name,
        category: targetCategory as any,
        categoryName: catName,
        price: Number(formData.price) || editingProduct.price,
        originalPrice: Number(formData.originalPrice) || editingProduct.originalPrice,
        stockQuantity: Number(formData.stockQuantity) || editingProduct.stockQuantity,
      } as Product);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name || 'New Grocery Item',
        category: targetCategory as any,
        categoryName: catName,
        price: Number(formData.price) || 150,
        originalPrice: Number(formData.originalPrice) || 180,
        weight: formData.weight || '500g',
        availableWeights: formData.availableWeights || ['250g', '500g', '1kg'],
        rating: 5.0,
        reviewsCount: 1,
        image: formData.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        inStock: formData.inStock ?? true,
        stockQuantity: Number(formData.stockQuantity) || 50,
        description: formData.description || 'Farm-fresh, chemical-free grocery essential.',
        origin: formData.origin || 'Garalgacha, Dankuni',
        organic: formData.organic ?? true,
        features: formData.features || ['Pure & Unadulterated'],
        storageTips: formData.storageTips || 'Store in dry place.',
        shelfLife: formData.shelfLife || '12 Months',
      };
      onAddProduct(newProduct);
    }

    setShowAddModal(false);
  };

  const toggleChecklistItem = (key: string) => {
    setPackingChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Bank Transfer':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'Credit Card':
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      case 'Cash on Delivery':
      default:
        return <Banknote className="w-4 h-4 text-amber-400" />;
    }
  };

  // Filtered Products for Table
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchesSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.origin.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wide">
                Store Owner Portal
              </span>
              <span className="text-xs text-slate-400">
                Fulfillment Hub: <span className="text-emerald-400 font-bold">Garalgacha, Dankuni 712311 • Calling / WhatsApp: 7439915663</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Fresh Care Live Order Receiving & Store Operations
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('incoming-orders')}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Receive Orders ({newIncomingOrders.length})</span>
              {newIncomingOrders.length > 0 && (
                <span className="bg-white text-slate-950 px-1.5 py-0.2 rounded-full font-black text-[10px] animate-pulse">
                  NEW
                </span>
              )}
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            {onLogoutOwner && (
              <button
                onClick={onLogoutOwner}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:border-rose-700/50 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs transition-all"
                title="Lock and sign out to General Portal"
              >
                <span>🔒 Lock & Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming-orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'incoming-orders'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Incoming Order Items ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Catalogue & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Orders & Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'deliveries'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('firestore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'firestore'
                ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400'
                : 'bg-slate-800/80 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>Cloud Database</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold border border-amber-500/30">
              Live
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-['Outfit'] mt-2">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% from Dankuni & Hooghly orders
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Orders to Pack & Dispatch</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-['Outfit'] mt-2">{pendingOrders} Orders</p>
            <p className="text-[11px] text-amber-300 mt-1 font-medium">
              {newIncomingOrders.length} New Unpacked Orders
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Inventory Catalogue</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-['Outfit'] mt-2">{products.length} Products</p>
            <p className="text-[11px] text-slate-400 mt-1">Spices, Dry Fruits, Dals & Rice</p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Courier</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-['Outfit'] mt-2">Rajesh Kumar</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">EV Scooter (WB-18-MJ-4592)</p>
          </div>
        </div>

        {/* SECTION: INCOMING RECEIVED ORDERS WITH ITEMIZED INSPECTION (Fulfills User Request Directly) */}
        {(activeTab === 'incoming-orders' || activeTab === 'overview') && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Section Header with live pulse */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                    Live Incoming Order Item Details & Packing Manager
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Receive orders in real-time, inspect itemized pack weights, verify payments, and print tax invoices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-900 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300">
                  Total Orders: <strong className="text-white">{orders.length}</strong>
                </span>
              </div>
            </div>

            {/* 2-Column Split: Left = Order Stream Selector, Right = Selected Order Item Details Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Column 1: List of Received Orders */}
              <div className="lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto pr-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Order to Receive & Inspect:
                </span>

                {orders.map((ord) => {
                  const isSelected = selectedOrderForDetails?.id === ord.id;
                  const itemCount = ord.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrderForDetails(ord)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-slate-900/80 border-slate-700 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-['Outfit']">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{ord.date}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          ord.status === 'Order Placed'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : ord.status === 'Packed'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : ord.status === 'Out for Delivery'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-200">{ord.customer.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{ord.customer.address}, {ord.customer.city}</p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          {getPaymentIcon(ord.paymentMethod)}
                          <span>{ord.paymentMethod}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px]">{itemCount} items</span>
                          <span className="font-black text-emerald-400">₹{ord.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: Detailed Line-Item Inspection Box */}
              {selectedOrderForDetails ? (
                <div className="lg:col-span-7 bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-6">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white font-['Outfit']">
                          Order #{selectedOrderForDetails.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({selectedOrderForDetails.invoiceNumber})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Placed on: {selectedOrderForDetails.date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrderForInvoice(selectedOrderForDetails)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Print Tax Invoice</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = `Hi ${selectedOrderForDetails.customer.name}, Fresh Care Dankuni has received your order #${selectedOrderForDetails.orderNumber} for ₹${selectedOrderForDetails.totalAmount}. Our team is packing your fresh groceries now!`;
                          window.open(`https://wa.me/91${selectedOrderForDetails.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Customer Contact:
                      </span>
                      <p className="font-bold text-white text-sm">{selectedOrderForDetails.customer.name}</p>
                      <p className="text-slate-300 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-400" /> {selectedOrderForDetails.customer.phone}
                      </p>
                      <p className="text-slate-400 text-[11px]">{selectedOrderForDetails.customer.email}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Delivery Destination:
                      </span>
                      <p className="text-slate-200 font-medium leading-snug flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{selectedOrderForDetails.customer.address}, {selectedOrderForDetails.customer.city} - {selectedOrderForDetails.customer.pincode}</span>
                      </p>
                      <p className="text-[11px] text-amber-300/90 mt-1 italic">
                        Note: {selectedOrderForDetails.deliveryNotes || 'Standard delivery at doorstep'}
                      </p>
                    </div>
                  </div>

                  {/* ITEM DETAILS TABLE (Ordered items receiving) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <span>Ordered Items Checklist & Stock Breakdown ({selectedOrderForDetails.items.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">Click item to verify during packaging</span>
                    </div>

                    <div className="border border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                            <th className="py-2.5 px-3">Pack Check</th>
                            <th className="py-2.5 px-3">Item Details</th>
                            <th className="py-2.5 px-3">Pack Size</th>
                            <th className="py-2.5 px-3 text-center">Qty</th>
                            <th className="py-2.5 px-3 text-right">Unit Rate</th>
                            <th className="py-2.5 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                          {selectedOrderForDetails.items.map((item, idx) => {
                            const checkKey = `${selectedOrderForDetails.id}-${item.product.id}-${item.selectedWeight}`;
                            const isChecked = packingChecklist[checkKey] || false;

                            return (
                              <tr 
                                key={idx} 
                                onClick={() => toggleChecklistItem(checkKey)}
                                className={`cursor-pointer transition-colors ${
                                  isChecked ? 'bg-emerald-950/30' : 'hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-2.5 px-3">
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                    isChecked 
                                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                                      : 'border-slate-600 bg-slate-800 text-transparent'
                                  }`}>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-slate-700"
                                    />
                                    <div>
                                      <span className={`font-semibold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                                        {item.product.name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 capitalize">
                                        {item.product.categoryName} • Stock: {item.product.stockQuantity} units
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-300 font-medium">{item.selectedWeight}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-white">{item.quantity}</td>
                                <td className="py-2.5 px-3 text-right text-slate-400">₹{item.product.price}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                                  ₹{item.product.price * item.quantity}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial & Charges Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                    {/* Payment Info */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Payment & Verification:
                      </span>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(selectedOrderForDetails.paymentMethod)}
                        <span className="font-bold text-white">{selectedOrderForDetails.paymentMethod}</span>
                      </div>
                      {selectedOrderForDetails.paymentDetails?.transactionRef && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Ref: {selectedOrderForDetails.paymentDetails.transactionRef}
                        </p>
                      )}
                      {selectedOrderForDetails.paymentDetails?.upiId && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          UPI: {selectedOrderForDetails.paymentDetails.upiId}
                        </p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                        {selectedOrderForDetails.paymentDetails?.status || 'Paid'}
                      </span>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Items Subtotal:</span>
                        <span className="font-semibold text-white">₹{selectedOrderForDetails.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Delivery Charge:</span>
                        <span className="font-semibold text-emerald-400">
                          {selectedOrderForDetails.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderForDetails.deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Handling & Packaging:</span>
                        <span className="font-semibold text-white">₹{selectedOrderForDetails.handlingFee || 15}</span>
                      </div>
                      {selectedOrderForDetails.discount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>Discount:</span>
                          <span>-₹{selectedOrderForDetails.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-slate-800">
                        <span>Total Collected:</span>
                        <span className="text-emerald-400 font-['Outfit'] text-base">₹{selectedOrderForDetails.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Quick Update Action */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Update Order State:</span>
                      <select
                        value={selectedOrderForDetails.status}
                        onChange={(e) => {
                          const newSt = e.target.value as OrderStatus;
                          onUpdateOrderStatus(selectedOrderForDetails.id, newSt);
                          setSelectedOrderForDetails({
                            ...selectedOrderForDetails,
                            status: newSt,
                          });
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
                      >
                        <option value="Order Placed">📦 1. Order Placed</option>
                        <option value="Packed">🏷️ 2. Packed & Sealed</option>
                        <option value="Out for Delivery">🚚 3. Out for Delivery (Rajesh Kumar)</option>
                        <option value="Delivered">✅ 4. Delivered to Customer</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(selectedOrderForDetails.id, 'Packed');
                          setSelectedOrderForDetails({
                            ...selectedOrderForDetails,
                            status: 'Packed',
                          });
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                      >
                        Mark as Packed
                      </button>

                      <button
                        onClick={() => {
                          onUpdateOrderStatus(selectedOrderForDetails.id, 'Out for Delivery');
                          setSelectedOrderForDetails({
                            ...selectedOrderForDetails,
                            status: 'Out for Delivery',
                          });
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                      >
                        Dispatch Order
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-7 bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Package className="w-12 h-12 text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">No order selected</p>
                  <p className="text-xs">Click on any received order on the left to inspect item details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Grocery Products Inventory</h3>
                <p className="text-xs text-slate-400">Manage pricing, stocks, weights, and catalogue items</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="spices">🌶️ Spices</option>
                  <option value="dry-fruits">🌰 Dry Fruits</option>
                  <option value="dals">🫘 Dals</option>
                  <option value="rice">🍚 Rice</option>
                </select>

                <button
                  onClick={handleOpenAdd}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Base Price</th>
                    <th className="pb-3">Pack Sizes</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Origin</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-white block">{prod.name}</span>
                            {prod.organic && (
                              <span className="text-[10px] text-emerald-400 font-medium">🌱 Organic</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-medium border border-slate-700">
                          {prod.categoryName}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-white text-sm">₹{prod.price}</span>
                        {prod.originalPrice && (
                          <span className="text-slate-500 line-through ml-1.5 text-[11px]">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-300">
                        {prod.availableWeights.join(', ')}
                      </td>
                      <td className="py-3">
                        <span className={`font-bold ${prod.stockQuantity < 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {prod.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{prod.origin}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 rounded-md bg-slate-700 hover:bg-rose-900/60 text-rose-300 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ALL ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">All Customer Orders ({orders.length})</h3>
                <p className="text-xs text-slate-400">Review line items, payment methods, delivery charges, and invoices</p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-white text-base font-['Outfit']">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">{ord.date}</span>
                      <span className="text-xs text-emerald-400 font-mono">({ord.invoiceNumber})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrderForInvoice(ord)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                      >
                        <FileText className="w-3 h-3 text-emerald-400" />
                        <span>Tax Invoice</span>
                      </button>

                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Customer Info */}
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Customer & Address:
                      </span>
                      <p className="font-bold text-white">{ord.customer.name}</p>
                      <p className="text-slate-300">{ord.customer.phone}</p>
                      <p className="text-slate-400 leading-snug">{ord.customer.address}, {ord.customer.city}</p>
                    </div>

                    {/* Ordered Items list */}
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Items Ordered ({ord.items.length}):
                      </span>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>{it.product.name} ({it.selectedWeight} × {it.quantity})</span>
                            <span className="font-bold text-white">₹{it.product.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Charges */}
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Charges & Payment Mode:
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                        {getPaymentIcon(ord.paymentMethod)}
                        <span>{ord.paymentMethod}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Subtotal: ₹{ord.subtotal} • Delivery: ₹{ord.deliveryFee} • Handling: ₹{ord.handlingFee || 15}
                      </p>
                      <p className="text-slate-300">Grand Total: <span className="font-bold text-emerald-400 text-sm">₹{ord.totalAmount}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Customer Directory ({customers.length})</h3>
              <p className="text-xs text-slate-400">Verified shoppers registered on Fresh Care (Garalgacha & Dankuni Hub)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Delivery Address</th>
                    <th className="pb-3">Total Orders</th>
                    <th className="pb-3">Lifetime Spent</th>
                    <th className="pb-3">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-3">
                        <p className="text-slate-200">{c.phone}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </td>
                      <td className="py-3 text-slate-300 max-w-xs truncate">{c.address}</td>
                      <td className="py-3 font-bold text-slate-200">{c.totalOrders} Orders</td>
                      <td className="py-3 font-bold text-emerald-400">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="py-3 text-slate-400">{c.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: DELIVERIES */}
        {activeTab === 'deliveries' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Fresh Care Express Fleet</h3>
                <p className="text-xs text-slate-400">Single Dedicated Delivery Partner System (Dankuni Region)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                ● 1 Partner Assigned
              </span>
            </div>

            {/* Delivery Partner Profile Card */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Driver Name</span>
                <p className="text-base font-bold text-white mt-0.5">{deliveryPartner.name}</p>
                <p className="text-slate-400">{deliveryPartner.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Vehicle Assigned</span>
                <p className="font-bold text-slate-200 mt-0.5">{deliveryPartner.vehicleNumber}</p>
                <p className="text-emerald-400 font-semibold">Rating: {deliveryPartner.rating} ⭐</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Today's Deliveries</span>
                <p className="font-bold text-white text-base mt-0.5">{deliveryPartner.completedToday} Delivered</p>
                <p className="text-amber-400 font-semibold">{deliveryPartner.activeDeliveriesCount} In-Transit</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Today's Payout</span>
                <p className="font-black text-emerald-400 text-base mt-0.5">₹{deliveryPartner.totalEarnings}</p>
                <p className="text-slate-400">Direct wallet credit</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FIRESTORE DATABASE (DAY 3 BACKEND INTEGRATION) */}
        {activeTab === 'firestore' && (
          <div className="space-y-6">
            {/* Header / Project Callout */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    Cloud Firestore • Project: freshcare-f488b
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Live Realtime Sync
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  Firebase Firestore Database Collections
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time synchronization for customer members, subscription plans, dietitians/trainers, and live store announcements.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {firestoreSubTab === 'members' && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                )}
                {firestoreSubTab === 'trainers' && (
                  <button
                    onClick={() => setShowAddTrainerModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Advisor / Trainer</span>
                  </button>
                )}
                {firestoreSubTab === 'announcements' && (
                  <button
                    onClick={() => setShowAddAnnounceModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Announcement</span>
                  </button>
                )}
              </div>
            </div>

            {/* Firestore Collection Sub-navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setFirestoreSubTab('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  firestoreSubTab === 'members'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Collection: members ({members.length})</span>
              </button>

              <button
                onClick={() => setFirestoreSubTab('plans')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  firestoreSubTab === 'plans'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Collection: membershipPlans ({membershipPlans.length})</span>
              </button>

              <button
                onClick={() => setFirestoreSubTab('trainers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  firestoreSubTab === 'trainers'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Collection: trainers ({trainers.length})</span>
              </button>

              <button
                onClick={() => setFirestoreSubTab('announcements')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  firestoreSubTab === 'announcements'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Collection: announcements ({announcements.length})</span>
              </button>
            </div>

            {/* SUBTAB 1: MEMBERS */}
            {firestoreSubTab === 'members' && (
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Registered Members (Cloud Firestore: <code>members</code>)
                    </h4>
                    <p className="text-xs text-slate-400">
                      All registrations submitted from the customer login/register modal are written directly to this collection.
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                    {members.length} Active Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                        <th className="pb-3">Member Name</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Membership Plan</th>
                        <th className="pb-3">Address</th>
                        <th className="pb-3">Join Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {members.map((m, idx) => (
                        <tr key={m.id || idx} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                              {m.name.charAt(0)}
                            </div>
                            <div>
                              <span>{m.name}</span>
                              {m.id && <span className="block text-[10px] text-slate-400 font-mono">ID: {m.id}</span>}
                            </div>
                          </td>
                          <td className="py-3">
                            <p className="text-slate-200">{m.phone}</p>
                            <p className="text-[10px] text-slate-400">{m.email}</p>
                          </td>
                          <td className="py-3 font-semibold text-amber-300">
                            {m.membershipPlan || 'Standard'}
                          </td>
                          <td className="py-3 text-slate-300 max-w-xs truncate">
                            {m.address || 'Garalgacha, Dankuni'}
                          </td>
                          <td className="py-3 text-slate-400">{m.joinDate}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {String(m.activeStatus || 'Active')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 2: MEMBERSHIP PLANS */}
            {firestoreSubTab === 'plans' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                  <div>
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Plans Collection (<code>membershipPlans</code>)
                    </h4>
                    <p className="text-xs text-slate-400">Available subscription packages displayed to customer storefront.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {membershipPlans.map((p, idx) => (
                    <div key={p.id || idx} className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-base font-bold text-white">{p.planName}</h5>
                        {p.recommended && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-400">
                        {p.price} <span className="text-xs text-slate-400 font-normal">/ {p.duration}</span>
                      </div>
                      <div className="space-y-2 text-xs border-t border-slate-700 pt-3">
                        <span className="text-slate-400 font-semibold block text-[11px]">Benefits:</span>
                        {p.benefits.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2 text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: TRAINERS / WELLNESS ADVISORS */}
            {firestoreSubTab === 'trainers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                  <div>
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Trainers & Nutritionists Collection (<code>trainers</code>)
                    </h4>
                    <p className="text-xs text-slate-400">Holistic wellness experts offering organic food diets and training guidance.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trainers.map((t, idx) => (
                    <div key={t.id || idx} className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-base font-bold text-white">{t.trainerName}</h5>
                          <p className="text-emerald-400 font-semibold">{t.specialty}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t.availability}
                        </span>
                      </div>
                      <p className="text-slate-300"><strong>Experience:</strong> {t.experience}</p>
                      {t.bio && <p className="text-slate-400 leading-relaxed">{t.bio}</p>}
                      {t.phone && <p className="text-slate-300"><strong>Contact:</strong> {t.phone}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 4: ANNOUNCEMENTS */}
            {firestoreSubTab === 'announcements' && (
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Live Store Announcements (<code>announcements</code>)
                    </h4>
                    <p className="text-xs text-slate-400">Broadcast updates to customer store banner in real time.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {announcements.map((a, idx) => (
                    <div key={a.id || idx} className="p-4 bg-slate-900 border border-slate-700 rounded-xl flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{a.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {a.priority || 'Normal'}
                          </span>
                        </div>
                        <p className="text-slate-300">{a.message}</p>
                        <p className="text-[11px] text-slate-500">Date: {a.date}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        a.activeStatus ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {a.activeStatus ? 'Active on Storefront' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Member to Firestore Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white font-['Outfit']">Add Member to Firestore</h4>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onAddMember) {
                  onAddMember({
                    name: newMemberName,
                    phone: newMemberPhone,
                    email: newMemberEmail,
                    membershipPlan: newMemberPlan,
                    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    activeStatus: 'Active',
                    address: newMemberAddress,
                    city: 'Dankuni',
                    pincode: '712311',
                  });
                }
                setShowAddMemberModal(false);
                setNewMemberName('');
                setNewMemberPhone('');
                setNewMemberEmail('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rahul Sen"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Membership Plan</label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                >
                  <option value="Fresh Care Prime Saver Plan">Fresh Care Prime Saver Plan</option>
                  <option value="Gold VIP Super Shopper Plan">Gold VIP Super Shopper Plan</option>
                  <option value="Standard Community Member">Standard Community Member</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Save Member Record to Firestore
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Trainer Modal */}
      {showAddTrainerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white font-['Outfit']">Add Wellness Coach / Trainer</h4>
              <button onClick={() => setShowAddTrainerModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onAddTrainer) {
                  onAddTrainer({
                    trainerName: newTrainerName,
                    specialty: newTrainerSpecialty,
                    experience: newTrainerExp,
                    availability: 'Available',
                    bio: newTrainerBio,
                  });
                }
                setShowAddTrainerModal(false);
                setNewTrainerName('');
                setNewTrainerSpecialty('');
                setNewTrainerBio('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Coach / Trainer Name</label>
                <input
                  type="text"
                  required
                  value={newTrainerName}
                  onChange={(e) => setNewTrainerName(e.target.value)}
                  placeholder="e.g. Dr. Kuntal Bose"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Specialty</label>
                <input
                  type="text"
                  required
                  value={newTrainerSpecialty}
                  onChange={(e) => setNewTrainerSpecialty(e.target.value)}
                  placeholder="e.g. Sports Nutrition & Herbal Supplements"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Experience</label>
                <input
                  type="text"
                  value={newTrainerExp}
                  onChange={(e) => setNewTrainerExp(e.target.value)}
                  placeholder="6 Years"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={newTrainerBio}
                  onChange={(e) => setNewTrainerBio(e.target.value)}
                  placeholder="Brief credentials..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Add Coach to Firestore
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white font-['Outfit']">Create Store Announcement</h4>
              <button onClick={() => setShowAddAnnounceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onAddAnnouncement) {
                  onAddAnnouncement({
                    title: newAnnounceTitle,
                    message: newAnnounceMsg,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    activeStatus: true,
                    priority: newAnnouncePriority,
                  });
                }
                setShowAddAnnounceModal(false);
                setNewAnnounceTitle('');
                setNewAnnounceMsg('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newAnnounceTitle}
                  onChange={(e) => setNewAnnounceTitle(e.target.value)}
                  placeholder="e.g. 🌾 New Harvest Basmati Rice Batch Arrived!"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Message</label>
                <textarea
                  rows={2}
                  required
                  value={newAnnounceMsg}
                  onChange={(e) => setNewAnnounceMsg(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Priority</label>
                <select
                  value={newAnnouncePriority}
                  onChange={(e) => setNewAnnouncePriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                >
                  <option value="High">High (Urgent Highlight)</option>
                  <option value="Normal">Normal</option>
                  <option value="Info">Info Notice</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Publish to Storefront
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit'] mb-4">
              {editingProduct ? 'Edit Grocery Product' : 'Add New Grocery Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Kashmiri Saffron"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="spices">🌶️ Spices</option>
                    <option value="dry-fruits">🌰 Dry Fruits</option>
                    <option value="dals">🫘 Dals (Pulses)</option>
                    <option value="rice">🍚 Rice & Grains</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Default Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 500g, 1kg"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Farm Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Garalgacha, Dankuni 712311"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe farm origin, aroma, purity, and culinary use..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal for Owner */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          isOpen={!!selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};
