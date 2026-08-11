import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  Plus, 
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image and badges */}
          <div className="relative h-72 md:h-full bg-slate-100 min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                {product.categoryName}
              </span>
              {product.organic && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md">
                  🌱 100% Certified Organic
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/75 backdrop-blur-md p-3 rounded-xl text-white text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Origin: {product.origin}</span>
              </div>
              <p className="text-slate-300 text-[11px]">Directly sourced from verified regional farmer clusters.</p>
            </div>
          </div>

          {/* Right Column: Details & Order Controls */}
          <div className="p-6 md:p-8 space-y-5 flex flex-col justify-between">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-['Outfit'] leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-['Outfit']">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded">
                  In Stock ({product.stockQuantity} units left)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Quality Highlights:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shelf Life & Storage */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Shelf Life</span>
                  <span className="font-bold text-slate-800">{product.shelfLife}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Storage Tips</span>
                  <span className="font-semibold text-slate-700">{product.storageTips}</span>
                </div>
              </div>
            </div>

            {/* Pack Size & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Choose Package Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableWeights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedWeight === w
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and CTA */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.01]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'Added to Cart ✓' : `Add to Cart • ₹${product.price * quantity}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
