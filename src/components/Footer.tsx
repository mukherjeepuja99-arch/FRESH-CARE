import React from 'react';
import { Leaf, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onNavigate: (section: string) => void;
  onSelectCategory: (cat: CategoryType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/30">
                🌿
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-['Outfit']">
                Fresh<span className="text-emerald-500">Care</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Fresh Care is a dedicated online grocery portal delivering 100% pure stone-ground spices, sun-dried dry fruits, unpolished high-protein dals, and aged grains direct from farm partners to your doorstep.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://wa.me/917439915663?text=Hi%20Fresh%20Care%20Dankuni,%20I%20want%20to%20place%20an%20order." 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 flex items-center gap-1.5 text-xs font-semibold"
              >
                <span>💬 WhatsApp Orders: 7439915663</span>
              </a>
            </div>
          </div>

          {/* Core Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Grocery Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onNavigate('products');
                    onSelectCategory('spices');
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>🌶️</span> <span>Aromatic Spices (Salem Turmeric, Mirch, Cumin)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('products');
                    onSelectCategory('dry-fruits');
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>🌰</span> <span>Premium Dry Fruits (Almonds, Cashews, Dates)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('products');
                    onSelectCategory('dals');
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>🫘</span> <span>Farm-Fresh Dals (Unpolished Toor, Moong, Chana)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('products');
                    onSelectCategory('rice');
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>🍚</span> <span>Aged Grains & Basmati (2-Year Aged, Sona Masoori)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-emerald-400 transition-colors">
                  Product Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-emerald-400 transition-colors">
                  Track Order History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  Our Purity Standard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Customer Helpline
                </button>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Store & Fulfillment
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Garalgacha, Dankuni 712311</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-slate-200">7439915663 (whatsapp orders)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>dankuni.care@freshcaregrocery.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 Fresh Care Grocery Portal. Dankuni Fulfillment Hub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for clean grocery commerce & beginner-friendly learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
