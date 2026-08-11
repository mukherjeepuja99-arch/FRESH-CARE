import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { CategoryType } from '../types';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreCategories: () => void;
  onSelectCategory: (cat: CategoryType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreCategories,
  onSelectCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Premium Indian Kitchen Staples • Direct Farm Sourcing</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-['Outfit']">
              Fresh Groceries <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Delivered to Your Doorstep
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Experience the purest flavors of India. Handpicked Aromatic Spices, Crisp Sun-Dried Fruits, 
              Unpolished High-Protein Dals, and Naturally Aged Royal Basmati Rice — zero artificial colors, zero polish.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={onShopNow}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-explore-categories-btn"
                onClick={onExploreCategories}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-base border border-slate-700 transition-all hover:border-slate-500 cursor-pointer"
              >
                <span>Explore 4 Categories</span>
              </button>
            </div>

            {/* Category Quick Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium mr-1">Quick Browse:</span>
              <button
                onClick={() => onSelectCategory('spices')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
              >
                🌶️ Spices
              </button>
              <button
                onClick={() => onSelectCategory('dry-fruits')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-700 transition-colors"
              >
                🌰 Dry Fruits
              </button>
              <button
                onClick={() => onSelectCategory('dals')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
              >
                🫘 Dals & Pulses
              </button>
              <button
                onClick={() => onSelectCategory('rice')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-700 transition-colors"
              >
                🍚 Aged Rice
              </button>
            </div>
          </div>

          {/* Hero Right Visual: Feature Highlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 sm:p-8 border border-slate-700 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Why Fresh Care?
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">The Pure Harvest Guarantee</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  100% Tested
                </span>
              </div>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Premium Quality</h4>
                  <p className="text-xs text-slate-400 leading-snug">Zero polish, stone-milled & unadulterated.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Affordable Prices</h4>
                  <p className="text-xs text-slate-400 leading-snug">Direct farmer partnership savings passed to you.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Fast Delivery</h4>
                  <p className="text-xs text-slate-400 leading-snug">Dedicated FreshCare Express delivery fleet.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Trusted Store</h4>
                  <p className="text-xs text-slate-400 leading-snug">500+ happy households served each month.</p>
                </div>
              </div>

              {/* Delivery banner */}
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Free Delivery on orders above ₹500
                </span>
                <span className="text-slate-400">Same Day Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
