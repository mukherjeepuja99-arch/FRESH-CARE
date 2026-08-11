import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  ArrowRight,
  ShoppingBag,
  Building2,
  QrCode,
  FileText,
  Printer,
  Sparkles,
  Share2,
  Lock,
  Database
} from 'lucide-react';
import { CartItem, Order, OrderCustomerInfo, PaymentMethodType, PaymentDetails } from '../types';
import { InvoiceModal } from './InvoiceModal';
import { saveOrderToFirestore, saveCustomerToFirestore } from '../firebase/dbService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  defaultCustomer: OrderCustomerInfo;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  defaultCustomer,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<OrderCustomerInfo>({
    name: defaultCustomer.name || 'Priya Sharma',
    email: defaultCustomer.email || 'priya.sharma@example.com',
    phone: defaultCustomer.phone || '+91 98765 43210',
    address: defaultCustomer.address || 'House 14B, Station Road, Garalgacha',
    city: defaultCustomer.city || 'Dankuni',
    pincode: defaultCustomer.pincode || '712311',
  });

  const [deliveryNotes, setDeliveryNotes] = useState('Please call before delivery. Handover at doorstep.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  
  // Payment sub-forms state
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [bankTxnRef, setBankTxnRef] = useState('');
  
  const [cardNumber, setCardNumber] = useState('4532 8920 1823 4242');
  const [cardHolder, setCardHolder] = useState('Priya Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('821');

  const [codNotes, setCodNotes] = useState('Keep change of ₹500/₹1000 handy if paying cash.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Price & Charges Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 500;
  const deliveryFee = cartItems.length === 0 ? 0 : isFreeDelivery ? 0 : 40;
  const handlingFee = cartItems.length === 0 ? 0 : 15; // Standard packaging & hygiene handling fee
  const discount = 0;
  const totalAmount = subtotal + deliveryFee + handlingFee - discount;

  const handleInputChange = (field: keyof OrderCustomerInfo, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderRand = Math.floor(1000 + Math.random() * 9000);
      const orderNum = `FC-${orderRand}`;
      const invNum = `INV-FC-2026-${orderRand}`;
      const now = new Date();
      const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      let paymentDetails: PaymentDetails = {
        method: paymentMethod,
        status: paymentMethod === 'Cash on Delivery' ? 'Due on Delivery' : 'Paid',
        paidAt: paymentMethod === 'Cash on Delivery' ? undefined : `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
      };

      if (paymentMethod === 'UPI') {
        paymentDetails.upiId = upiOption === 'id' ? upiId : '7439915663@upi';
        paymentDetails.transactionRef = `UPI-TXN-${Date.now().toString().slice(-8)}`;
      } else if (paymentMethod === 'Bank Transfer') {
        paymentDetails.bankName = selectedBank;
        paymentDetails.accountNumber = '39482019482';
        paymentDetails.transactionRef = bankTxnRef || `NEFT-${selectedBank.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      } else if (paymentMethod === 'Credit Card') {
        paymentDetails.cardLast4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
        paymentDetails.cardHolderName = cardHolder;
        paymentDetails.transactionRef = `CC-AUTH-${Date.now().toString().slice(-6)}`;
      }

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        invoiceNumber: invNum,
        date: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
        customer: { ...formData },
        items: [...cartItems],
        subtotal,
        deliveryFee,
        handlingFee,
        discount,
        totalAmount,
        status: 'Order Placed',
        paymentMethod,
        paymentDetails,
        deliveryPartnerName: 'Rajesh Kumar (FreshCare Express)',
        deliveryNotes,
        timeline: [
          { status: 'Order Placed', time: timeString, completed: true },
          { status: 'Packed', time: 'Estimated 30 mins', completed: false },
          { status: 'Out for Delivery', time: 'Estimated 1-2 hours', completed: false },
          { status: 'Delivered', time: 'Pending', completed: false },
        ],
      };

      // Persist order & customer to Firestore Database
      try {
        saveOrderToFirestore(newOrder);
        saveCustomerToFirestore({
          id: `cust-${formData.phone.replace(/\D/g, '').slice(-10) || Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city} ${formData.pincode}`,
          totalOrders: 1,
          totalSpent: totalAmount,
          joinedDate: new Date().toISOString().split('T')[0],
          membershipTier: 'Prime',
        });
      } catch {
        // continues seamlessly
      }

      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
      onOrderPlaced(newOrder);
    }, 900);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
        <div 
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit']">Checkout & Order Dispatch</h2>
                <p className="text-xs text-slate-500">Fresh Care Hub: Garalgacha, Dankuni 712311 • WhatsApp: 7439915663</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess && createdOrder ? (
            /* Order Confirmation & Instant Invoice Generation Screen */
            <div className="p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce shadow-lg shadow-emerald-600/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-2">
                  Thank You, {createdOrder.customer.name}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Order ID: <span className="font-bold text-slate-800">#{createdOrder.orderNumber}</span> • Tax Invoice: <span className="font-bold text-emerald-800">{createdOrder.invoiceNumber}</span>
                </p>
              </div>

              {/* Order & Charges Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Assigned Delivery Partner:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Rajesh Kumar (Dankuni Hub)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Delivering to:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[240px]">
                    {createdOrder.customer.address}, {createdOrder.customer.city}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Subtotal</span>
                    <span className="font-bold text-slate-800">₹{createdOrder.subtotal}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Delivery Charge</span>
                    <span className="font-bold text-emerald-600">
                      {createdOrder.deliveryFee === 0 ? 'FREE' : `₹${createdOrder.deliveryFee}`}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Handling Fee</span>
                    <span className="font-bold text-slate-800">₹{createdOrder.handlingFee}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block">Grand Total</span>
                    <span className="font-bold text-emerald-800 text-sm">₹{createdOrder.totalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-600">
                  <span>Payment Mode: <strong className="text-slate-900">{createdOrder.paymentMethod}</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {createdOrder.paymentDetails?.status || 'Paid'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Invoice, WhatsApp, Close */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>View & Print Tax Invoice</span>
                </button>

                <button
                  onClick={() => {
                    const text = `Hi Fresh Care Dankuni, I just placed order #${createdOrder.orderNumber} for ₹${createdOrder.totalAmount}. Please confirm dispatch!`;
                    window.open(`https://wa.me/917439915663?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Updates (7439915663)</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
                >
                  Track in Order History
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Form: Address & Payment Selection */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Step 1: Delivery Address */}
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>1. Delivery Destination & Contact</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700 block mb-1">Phone Number (WhatsApp)</label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">House / Flat / Street Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House No., Street, Landmark (e.g. Garalgacha, Dankuni)"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700 block mb-1">City / Region</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Dankuni"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700 block mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="712311"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Payment Option Section */}
                  <div className="pt-5 border-t border-slate-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span>2. Select Payment Option</span>
                      </h3>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure Checkout
                      </span>
                    </div>

                    {/* 4 Payment Mode Selection Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Option 1: UPI */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === 'UPI'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                        <span className="text-xs block font-bold">UPI / QR</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">GPay, PhonePe</span>
                      </button>

                      {/* Option 2: Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bank Transfer')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === 'Bank Transfer'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Building2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <span className="text-xs block font-bold">Bank Transfer</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">NEFT / NetBanking</span>
                      </button>

                      {/* Option 3: Credit Card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Credit Card')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === 'Credit Card'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                        <span className="text-xs block font-bold">Credit Card</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Visa / Mastercard</span>
                      </button>

                      {/* Option 4: Cash on Delivery */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash on Delivery')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentMethod === 'Cash on Delivery'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Banknote className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                        <span className="text-xs block font-bold">Cash on Del.</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Pay at Doorstep</span>
                      </button>
                    </div>

                    {/* Sub-form 1: UPI Details */}
                    {paymentMethod === 'UPI' && (
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Choose UPI Method:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setUpiOption('qr')}
                              className={`px-2.5 py-1 rounded-lg font-semibold ${
                                upiOption === 'qr'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-200'
                              }`}
                            >
                              Scan Store QR
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiOption('id')}
                              className={`px-2.5 py-1 rounded-lg font-semibold ${
                                upiOption === 'id'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-200'
                              }`}
                            >
                              Enter UPI ID
                            </button>
                          </div>
                        </div>

                        {upiOption === 'qr' ? (
                          <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-emerald-200">
                            <div className="w-20 h-20 bg-slate-900 text-white rounded-lg p-1.5 flex flex-col items-center justify-center text-center flex-shrink-0">
                              <QrCode className="w-12 h-12 text-emerald-400" />
                              <span className="text-[8px] font-mono mt-0.5">7439915663</span>
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-slate-900">Fresh Care Dankuni Official UPI</p>
                              <p className="text-emerald-700 font-mono font-bold text-xs">7439915663@upi</p>
                              <p className="text-[11px] text-slate-500">Scan & pay ₹{totalAmount} with GPay, PhonePe, Paytm, or BHIM.</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">Your UPI ID (VPA)</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. mobile@upi or name@okhdfcbank"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:border-emerald-500 font-medium"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sub-form 2: Bank Transfer Details */}
                    {paymentMethod === 'Bank Transfer' && (
                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Fresh Care Official Bank Account (NEFT / IMPS):</span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Verified A/C</span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-1 text-slate-700">
                          <p className="flex justify-between">
                            <span className="text-slate-500">Account Name:</span>
                            <span className="font-bold text-slate-900">Fresh Care Groceries</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Bank & Branch:</span>
                            <span className="font-bold text-slate-900">State Bank of India, Garalgacha Dankuni</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Account Number:</span>
                            <span className="font-mono font-bold text-blue-700">39482019482</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">IFSC Code:</span>
                            <span className="font-mono font-bold text-slate-900">SBIN0001234</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">Your Bank Name</label>
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            >
                              <option value="State Bank of India">State Bank of India (SBI)</option>
                              <option value="HDFC Bank">HDFC Bank</option>
                              <option value="ICICI Bank">ICICI Bank</option>
                              <option value="Axis Bank">Axis Bank</option>
                              <option value="Punjab National Bank">Punjab National Bank</option>
                              <option value="Bank of Baroda">Bank of Baroda</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">Transaction / UTR Reference (Optional)</label>
                            <input
                              type="text"
                              value={bankTxnRef}
                              onChange={(e) => setBankTxnRef(e.target.value)}
                              placeholder="e.g. UTR-492819482"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sub-form 3: Credit Card */}
                    {paymentMethod === 'Credit Card' && (
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 text-xs">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 0000 0000 0000"
                              className="w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-xl outline-none font-mono focus:border-indigo-500"
                            />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-1">
                            <label className="text-slate-700 font-semibold block mb-1">Name on Card</label>
                            <input
                              type="text"
                              required
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="08/29"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="•••"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sub-form 4: Cash on Delivery */}
                    {paymentMethod === 'Cash on Delivery' && (
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs text-amber-950">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-amber-700" />
                          <span className="font-bold">Doorstep Cash or QR Payment</span>
                        </div>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                          Pay ₹{totalAmount} in cash or scan the delivery partner's QR code when Rajesh Kumar delivers your grocery package at your Garalgacha / Dankuni address.
                        </p>
                        <input
                          type="text"
                          value={codNotes}
                          onChange={(e) => setCodNotes(e.target.value)}
                          placeholder="Change note (e.g. Please bring change for ₹2000)"
                          className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-slate-700 outline-none text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar: Order Item Review, Charges & Final Action */}
                <div className="lg:col-span-5 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Ordered Items ({cartItems.length})
                    </h3>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-200/60">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedWeight}`}
                          className="flex items-center justify-between text-xs pt-2 first:pt-0"
                        >
                          <div className="truncate pr-2">
                            <span className="font-semibold text-slate-800">{item.product.name}</span>
                            <span className="text-[11px] text-slate-500 block">
                              ({item.selectedWeight} × {item.quantity})
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 flex-shrink-0">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Charges Calculation Breakdown */}
                    <div className="pt-4 mt-4 border-t border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{subtotal}</span>
                      </div>

                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Charge</span>
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                            FREE (Orders &gt; ₹500)
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                        )}
                      </div>

                      <div className="flex justify-between text-slate-600">
                        <span>Handling & Hygiene Packaging</span>
                        <span className="font-semibold text-slate-900">₹{handlingFee}</span>
                      </div>

                      <div className="flex justify-between text-base font-black text-slate-900 pt-2.5 border-t border-slate-300">
                        <span>Grand Total</span>
                        <span className="font-['Outfit'] text-lg text-emerald-700">₹{totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Instant Tax Invoice & WhatsApp order update generated automatically.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || cartItems.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Processing & Generating Invoice...</span>
                      ) : (
                        <>
                          <span>Confirm & Place Order (₹{totalAmount})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {showInvoiceModal && createdOrder && (
        <InvoiceModal
          order={createdOrder}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </>
  );
};
