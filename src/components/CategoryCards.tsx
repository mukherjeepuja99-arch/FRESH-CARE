import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryType } from '../types';

interface CategoryCardsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Essential Grocery Categories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Explore Our 4 Core Collections
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Carefully curated kitchen essentials sourced directly from accredited regional farms.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative flex flex-col justify-between rounded-2xl bg-white p-5 border transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-lg ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Background image preview with subtle overlay */}
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                  
                  {/* Category Emoji & Item Count badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-xs">
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.itemCount} Items</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-xs font-semibold text-emerald-300 tracking-wide uppercase">
                      {cat.tagline}
                    </span>
                    <h3 className="text-lg font-bold leading-tight drop-shadow-xs">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  <button
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-800 group-hover:bg-emerald-600 group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing Selected' : 'View Products'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
