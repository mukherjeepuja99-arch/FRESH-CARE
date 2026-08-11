import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Check, 
  Package, 
  DollarSign, 
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order, DeliveryPartner, OrderStatus } from '../types';

interface DeliveryDashboardProps {
  deliveryPartner: DeliveryPartner;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onLogoutDelivery?: () => void;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  deliveryPartner,
  orders,
  onUpdateOrderStatus,
  onLogoutDelivery,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [calledNotice, setCalledNotice] = useState<string | null>(null);

  // Filter orders relevant to deliveries
  const deliveryOrders = orders.filter((o) => {
    if (activeFilter === 'pending') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (activeFilter === 'completed') return o.status === 'Delivered';
    return true;
  });

  const activeDeliveries = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');

  const handleCallCustomer = (phone: string, name: string) => {
    setCalledNotice(`Calling ${name} (${phone})...`);
    setTimeout(() => setCalledNotice(null), 3000);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'Order Placed':
        return 'Packed';
      case 'Packed':
        return 'Out for Delivery';
      case 'Out for Delivery':
        return 'Delivered';
      default:
        return null;
    }
  };

  const getStatusButtonLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case 'Order Placed':
        return 'Mark Order as Packed 📦';
      case 'Packed':
        return 'Pickup & Start Delivery 🚚';
      case 'Out for Delivery':
        return 'Mark as Delivered at Doorstep 🎉';
      case 'Delivered':
        return 'Order Completed ✓';
      default:
        return 'Update Status';
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen pb-16">
      {/* Driver Header Banner */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-600/30">
              🚚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 uppercase tracking-wide">
                  Sole Delivery Partner
                </span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  ● {deliveryPartner.status}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">
                {deliveryPartner.name} • Fresh Care Express
              </h1>
              <p className="text-xs text-slate-400">
                {deliveryPartner.vehicleNumber} • Driver Rating: {deliveryPartner.rating} ⭐
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Earnings
              </span>
              <span className="text-xl font-black text-emerald-400 font-['Outfit']">
                ₹{deliveryPartner.totalEarnings + (completedDeliveries.length * 70)}
              </span>
            </div>

            {onLogoutDelivery && (
              <button
                onClick={onLogoutDelivery}
                className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-900/60 hover:border-rose-700/50 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
                title="Sign out to General Portal"
              >
                <span>🔒 Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="max-w-5xl mx-auto flex gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Assigned ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pending / In-Transit ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Delivered Today ({completedDeliveries.length})
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Calling simulated Toast */}
        {calledNotice && (
          <div className="p-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-in fade-in">
            <span>📞 {calledNotice}</span>
            <span className="text-[10px] bg-blue-800 px-2 py-0.5 rounded">Simulating Call</span>
          </div>
        )}

        {/* Deliveries list */}
        {deliveryOrders.length === 0 ? (
          <div className="py-16 text-center bg-slate-800/60 rounded-2xl border border-slate-700 p-8">
            <p className="text-4xl mb-2">🎉</p>
            <h3 className="text-base font-bold text-white">No Deliveries in this view</h3>
            <p className="text-xs text-slate-400 mt-1">
              All assigned grocery orders for this tab are up to date.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {deliveryOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const isDelivered = order.status === 'Delivered';

              return (
                <div
                  key={order.id}
                  id={`delivery-task-${order.orderNumber}`}
                  className={`rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                    isDelivered
                      ? 'bg-slate-800/40 border-slate-700 opacity-90'
                      : 'bg-slate-800/90 border-slate-700 shadow-xl'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-white font-['Outfit']">
                        Order #{order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          isDelivered
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : order.status === 'Out for Delivery'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Collect on Delivery</span>
                      <span className="text-base font-black text-emerald-400 font-['Outfit']">
                        ₹{order.totalAmount}
                        <span className="text-xs text-slate-400 font-normal ml-1">
                          ({order.paymentMethod})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Customer Information & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Customer Destination Card */}
                    <div className="md:col-span-7 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer Destination:
                        </span>
                        <button
                          onClick={() => handleCallCustomer(order.customer.phone, order.customer.name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Customer</span>
                        </button>
                      </div>

                      <p className="text-sm font-bold text-white">{order.customer.name}</p>
                      <p className="text-slate-300 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</span>
                      </p>

                      {order.deliveryNotes && (
                        <div className="bg-slate-950 p-2 rounded text-[11px] text-amber-300 border border-slate-800">
                          📌 Notes: {order.deliveryNotes}
                        </div>
                      )}
                    </div>

                    {/* Package Contents */}
                    <div className="md:col-span-5 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Package Contents ({order.items.length} items):
                      </span>
                      <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-300">
                            <span className="truncate pr-1">• {it.product.name} ({it.selectedWeight})</span>
                            <span className="font-bold text-slate-200">×{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Button */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {isDelivered
                        ? 'Package delivered successfully.'
                        : 'Tap button when action is completed:'}
                    </span>

                    {nextStatus ? (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, nextStatus)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        {getStatusButtonLabel(order.status)}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed & Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
