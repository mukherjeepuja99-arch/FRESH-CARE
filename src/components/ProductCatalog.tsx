import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  SlidersHorizontal, 
  Plus, 
  Minus,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Product, CategoryType, CartItem } from '../types';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product, selectedWeight: string) => void;
  onUpdateCartQuantity: (productId: string, weight: string, delta: number) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenProductDetails,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});

  // Get active weight for a product
  const getProductWeight = (product: Product) => {
    return selectedWeights[product.id] || product.weight;
  };

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.origin.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Check if item is in cart
  const getItemQuantityInCart = (productId: string, weight: string) => {
    const item = cartItems.find(
      (c) => c.product.id === productId && c.selectedWeight === weight
    );
    return item ? item.quantity : 0;
  };

  return (
    <section id="products-section" className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Store Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Featured Grocery Products
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Showing {filteredProducts.length} premium staples available for same-day delivery.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="tab-all"
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              id="tab-spices"
              onClick={() => onSelectCategory('spices')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'spices'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🌶️</span>
              <span>Spices</span>
            </button>
            <button
              id="tab-dryfruits"
              onClick={() => onSelectCategory('dry-fruits')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'dry-fruits'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🌰</span>
              <span>Dry Fruits</span>
            </button>
            <button
              id="tab-dals"
              onClick={() => onSelectCategory('dals')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'dals'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🫘</span>
              <span>Dals</span>
            </button>
            <button
              id="tab-rice"
              onClick={() => onSelectCategory('rice')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'rice'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🍚</span>
              <span>Rice</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="w-full sm:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by name or origin..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-4xl mb-2">🔍</p>
            <h3 className="text-lg font-bold text-slate-800">No matching grocery items found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try searching with another keyword or reset the category filter.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentWeight = getProductWeight(product);
              const quantityInCart = getItemQuantityInCart(product.id, currentWeight);
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Top Image Container */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      {product.organic && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wide shadow-xs">
                          100% ORGANIC
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={() => onOpenProductDetails(product)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-700 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                      title="Quick View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Origin Tag */}
                    <div className="absolute bottom-2 left-2.5 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{product.origin}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {product.categoryName}
                        </span>
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => onOpenProductDetails(product)}
                        className="font-bold text-slate-900 text-sm leading-snug hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Weight Selection Pills */}
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block mb-1">Select Pack Size:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.availableWeights.map((w) => (
                          <button
                            key={w}
                            onClick={() => handleWeightChange(product.id, w)}
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-all ${
                              currentWeight === w
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price and Add to Cart action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">per {currentWeight}</span>
                      </div>

                      {/* Add to Cart button OR Quantity Stepper */}
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-600/30 rounded-xl p-1">
                          <button
                            onClick={() => onUpdateCartQuantity(product.id, currentWeight, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold text-xs transition-colors shadow-xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold text-emerald-950">
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() => onUpdateCartQuantity(product.id, currentWeight, 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-xs transition-colors shadow-xs"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`add-to-cart-${product.id}`}
                          onClick={() => onAddToCart(product, currentWeight)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
