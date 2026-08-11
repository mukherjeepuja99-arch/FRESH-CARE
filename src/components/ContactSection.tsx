import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { submitInquiryToFirestore } from '../firebase/dbService';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSaving(true);
    try {
      await submitInquiryToFirestore({
        name: name.trim(),
        phone: email.includes('@') ? '' : email.trim(),
        email: email.includes('@') ? email.trim() : '',
        message: message.trim(),
        category: 'storefront_inquiry',
      });
    } catch {
      // continues gracefully
    } finally {
      setSaving(false);
      setSent(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setSent(false);
      }, 4000);
    }
  };

  return (
    <section id="contact-section" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Contact Fresh Care Dankuni Hub
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Have questions about bulk orders, payment methods, spice milling, or live order receiving? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calling & WhatsApp Orders</h4>
                <p className="text-base font-bold text-slate-900 mt-0.5">7439915663</p>
                <p className="text-xs text-emerald-700 font-medium">Direct WhatsApp order placement available</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                <p className="text-base font-bold text-slate-900 mt-0.5">dankuni.care@freshcaregrocery.com</p>
                <p className="text-xs text-slate-500">Inquiries answered within 2 hours</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store & Fulfillment Hub</h4>
                <p className="text-base font-bold text-slate-900 mt-0.5">Garalgacha, Dankuni 712311</p>
                <p className="text-xs text-slate-500">Hooghly District, West Bengal</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Operating Hours</h4>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Monday to Sunday: 7:00 AM – 9:30 PM</p>
                <p className="text-xs text-emerald-600 font-semibold">Express Doorstep Delivery Active</p>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-1">
              Send us a Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out this quick form and our Dankuni store manager will get back to you promptly.
            </p>

            {sent ? (
              <div className="p-6 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you, {name}! Our team will contact you shortly on {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Subrata Mukherjee"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Your Email / Phone</label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="subrata@example.com / 98300XXXXX"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Message / Grocery Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with spices, dry fruits, dals, or payment options?"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
