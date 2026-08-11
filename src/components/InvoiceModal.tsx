import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2, Phone, MapPin, Mail, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*Fresh Care Grocery Invoice*\nInvoice No: ${order.invoiceNumber}\nOrder No: #${order.orderNumber}\nCustomer: ${order.customer.name}\nTotal Amount: ₹${order.totalAmount}\nPayment: ${order.paymentMethod}\nStore: Garalgacha, Dankuni 712311 (WhatsApp: 7439915663)`;
    window.open(`https://wa.me/917439915663?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:shadow-none print:border-none print:my-0 print:w-full print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Header (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <div>
              <h3 className="text-sm font-bold font-['Outfit']">Official Tax Invoice & Bill of Supply</h3>
              <p className="text-[11px] text-slate-300">Invoice Ref: {order.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INVOICE SHEET (Formatted for Screen & Print) */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs print:p-6 print:space-y-4">
          
          {/* Header & Store Information */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                  🌿
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">
                  Fresh<span className="text-emerald-600">Care</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Tax Invoice
                </span>
              </div>
              <p className="text-slate-600 text-xs font-semibold">Fresh Care Agro & Direct Grocery Supply</p>
              <p className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>Garalgacha, Dankuni 712311, West Bengal</span>
              </p>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Calling & WhatsApp Orders: +91 74399 15663</span>
              </p>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-600" />
                <span>care@freshcaregrocery.com | GSTIN: 19AABCF9281Q1Z4</span>
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-200 w-full sm:w-auto">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-extrabold mb-1.5 font-['Outfit']">
                {order.invoiceNumber}
              </div>
              <p className="text-[11px] text-slate-500">Order ID: <span className="font-bold text-slate-800">#{order.orderNumber}</span></p>
              <p className="text-[11px] text-slate-500">Invoice Date: <span className="font-semibold text-slate-800">{order.date}</span></p>
              <p className="text-[11px] text-slate-500">
                Payment Mode: <span className="font-bold text-emerald-700">{order.paymentMethod}</span>
              </p>
              <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                {order.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery (Due)' : 'Payment Verified ✓'}
              </span>
            </div>
          </div>

          {/* Billed To & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To & Customer Details:
              </span>
              <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
              <p className="text-slate-600 text-xs">{order.customer.phone}</p>
              <p className="text-slate-600 text-xs">{order.customer.email}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Delivery Destination:
              </span>
              <p className="text-slate-800 font-medium leading-snug">{order.customer.address}</p>
              <p className="text-slate-600 text-xs">{order.customer.city} - {order.customer.pincode}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Dispatch Courier: <span className="font-semibold text-slate-700">{order.deliveryPartnerName || 'Rajesh Kumar (FreshCare Express)'}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-slate-300 bg-slate-100/80 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Pack Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.product.name}
                      {item.product.organic && (
                        <span className="ml-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">Organic</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 capitalize">{item.product.categoryName}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{item.selectedWeight}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">₹{item.product.price}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ₹{item.product.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-slate-200">
            {/* Left: Notes & Payment Info */}
            <div className="sm:col-span-7 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Details & Store Guarantee:
              </span>
              <div className="space-y-1 text-slate-600 text-xs">
                <p>
                  <span className="font-semibold text-slate-800">Payment Option:</span> {order.paymentMethod}
                </p>
                {order.paymentDetails?.transactionRef && (
                  <p>
                    <span className="font-semibold text-slate-800">Ref / Txn ID:</span> {order.paymentDetails.transactionRef}
                  </p>
                )}
                {order.paymentDetails?.bankName && (
                  <p>
                    <span className="font-semibold text-slate-800">Bank Name:</span> {order.paymentDetails.bankName}
                  </p>
                )}
                {order.paymentDetails?.upiId && (
                  <p>
                    <span className="font-semibold text-slate-800">UPI ID:</span> {order.paymentDetails.upiId}
                  </p>
                )}
                {order.paymentDetails?.cardLast4 && (
                  <p>
                    <span className="font-semibold text-slate-800">Card ending in:</span> **** **** **** {order.paymentDetails.cardLast4}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>100% Quality & Freshness Guarantee. In case of any query, contact Garalgacha Hub at <strong>7439915663</strong>.</span>
              </div>
            </div>

            {/* Right: Bill Breakdown */}
            <div className="sm:col-span-5 space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                {order.deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                    FREE
                  </span>
                ) : (
                  <span className="font-semibold text-slate-900">₹{order.deliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Handling & Packaging</span>
                </span>
                <span className="font-semibold text-slate-900">₹{order.handlingFee || 15}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Amount</span>
                <span className="font-['Outfit'] text-base text-emerald-700 font-bold">
                  ₹{order.totalAmount}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">Inclusive of all local taxes & packaging</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-slate-200 text-slate-400 text-[10px] space-y-1">
            <p>Thank you for choosing Fresh Care! Pure Spices • Fresh Nuts • Unpolished Dals • Aged Rice.</p>
            <p>Garalgacha, Dankuni 712311 | WhatsApp Orders: +91 74399 15663 | Computer Generated Invoice</p>
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Close Invoice
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Order Details</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
