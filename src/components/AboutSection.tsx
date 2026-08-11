import React from 'react';
import { ShieldCheck, Heart, Leaf, Sparkles, Award, Truck, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>The Fresh Care Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Pure, Unadulterated Groceries for Every Indian Home
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            From regional farmer fields directly to your kitchen — without chemical polishing, intermediaries, or stale warehouse holding.
          </p>
        </div>

        {/* 2 Column Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Story Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                alt="Spices and farm harvest"
                className="w-full h-80 object-cover"
              />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Direct Farm Sourcing
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Established 2024</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  "We only sell four essentials, but we guarantee they are the purest you can buy."
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before Fresh Care, our neighborhood relied on unverified loose spices and chemical-polished lentils. We created this dedicated portal to give families direct access to stone-ground spices, crisp California nuts, unpolished high-protein dals, and aged heritage rice.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🌶️
                </div>
                <h4 className="text-sm font-bold text-slate-900">Zero Artificial Color</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our Salem Turmeric and Kashmiri Mirch are cold-milled to retain 100% natural curcumin and volatile oils.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  🌰
                </div>
                <h4 className="text-sm font-bold text-slate-900">Vacuum-Sealed Crunch</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nonpareil Almonds and W240 Cashews packed in oxygen-barrier pouches to prevent rancidity.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🫘
                </div>
                <h4 className="text-sm font-bold text-slate-900">Unpolished Desi Dals</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No leather-polishing or synthetic oil coatings. Preserves maximum dietary fiber and wholesome homestyle creaminess.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  🍚
                </div>
                <h4 className="text-sm font-bold text-slate-900">2-Year Aged Basmati</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Naturally cured Himalayan snow-water irrigated grains that elongate smoothly without clumping.
                </p>
              </div>
            </div>

            <div className="bg-emerald-900 text-white p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Community Focused
                </span>
                <p className="text-sm font-bold">Direct Local Delivery with Rajesh Kumar</p>
                <p className="text-xs text-emerald-200/80">Delivering fresh batches within 2-4 hours across Bengaluru.</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center text-xl flex-shrink-0">
                🚚
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
