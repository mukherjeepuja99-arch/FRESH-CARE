import React from 'react';
import { Check, Sparkles, Award, ArrowRight } from 'lucide-react';
import { MembershipPlanRecord } from '../types';

interface MembershipPlansSectionProps {
  plans: MembershipPlanRecord[];
  onSelectPlan: (planName: string) => void;
}

export const MembershipPlansSection: React.FC<MembershipPlansSectionProps> = ({
  plans,
  onSelectPlan,
}) => {
  return (
    <section id="plans-section" className="py-16 bg-slate-100/70 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Customer Membership Plans & Exclusive Benefits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Choose Your Fresh Care Membership
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Enjoy unlimited free delivery across Dankuni & Hooghly, exclusive member discounts on spices and dry fruits, and priority fulfillment.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isPrime = plan.recommended || plan.planName.includes('Prime');
            return (
              <div
                key={plan.id || plan.planName}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPrime
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-emerald-500 scale-[1.02]'
                    : 'bg-white text-slate-900 shadow-md border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {isPrime && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold font-['Outfit'] ${isPrime ? 'text-white' : 'text-slate-900'}`}>
                      {plan.planName}
                    </h3>
                  </div>

                  <div className="mt-4 mb-6">
                    <span className={`text-3xl sm:text-4xl font-black ${isPrime ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ml-2 font-medium ${isPrime ? 'text-slate-400' : 'text-slate-500'}`}>
                      / {plan.duration}
                    </span>
                  </div>

                  <div className="border-t border-dashed my-4 border-slate-700/50"></div>

                  <div className="space-y-3">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${isPrime ? 'text-slate-400' : 'text-slate-500'}`}>
                      Included Benefits:
                    </span>
                    <ul className="space-y-2.5 text-xs">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPrime ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className={isPrime ? 'text-slate-200' : 'text-slate-700'}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectPlan(plan.planName)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPrime
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Register with this Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className={`text-[10px] text-center mt-2 ${isPrime ? 'text-slate-400' : 'text-slate-500'}`}>
                    Instant activation upon enrollment
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
