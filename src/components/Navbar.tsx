import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Shield, Truck, Store, Clock, Phone, Sparkles, KeyRound, LogOut } from 'lucide-react';
import { UserRole, CartItem } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAuth: () => void;
  userName: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  cartItems,
  onOpenCart,
  onOpenAuth,
  userName,
  isLoggedIn,
  onLogout,
  activeSection,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (sectionId: string) => {
    if (currentRole === 'portal') {
      onSelectRole('member');
    }
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Role Switcher & Announcement */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="hidden md:inline text-emerald-400 font-medium">100% Pure Spices, Dry Fruits & Premium Groceries</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Phone className="w-3 h-3 text-emerald-400" /> Garalgacha, Dankuni • WhatsApp: 7439915663
            </span>
          </div>

          {/* Persona / Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Portal / Role:</span>
            
            <button
              id="role-btn-portal"
              onClick={() => onSelectRole('portal')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                currentRole === 'portal'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>General Portal</span>
            </button>

            <button
              id="role-btn-member"
              onClick={() => onSelectRole('member')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                currentRole === 'member'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>

            <button
              id="role-btn-owner"
              onClick={() => onSelectRole('owner')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                currentRole === 'owner'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner Admin</span>
            </button>

            <button
              id="role-btn-delivery"
              onClick={() => onSelectRole('delivery')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                currentRole === 'delivery'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery Partner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold text-xl">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit']">
                  Fresh<span className="text-emerald-600">Care</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Grocery
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Pure • Fresh • Farm Direct</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Spices, Dry Fruits, Dals, Basmati Rice..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'home' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              id="nav-products"
              onClick={() => handleNavClick('products')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'products' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              All Products
            </button>
            <button
              id="nav-plans"
              onClick={() => handleNavClick('plans')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'plans' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Membership Plans
            </button>
            <button
              id="nav-orders"
              onClick={() => handleNavClick('orders')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'orders' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Order History
            </button>
            <button
              id="nav-about"
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'about' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              About
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-emerald-600 ${
                activeSection === 'contact' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Buttons: Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth / Profile Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  id="user-profile-btn"
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-semibold transition-all border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {userName ? userName.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
                </button>
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Login</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-xs animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {showSearchInput && (
          <div className="lg:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Spices, Dry Fruits, Dals, Basmati..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'home' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              🏡 Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'products' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              🛍️ All Products
            </button>
            <button
              onClick={() => handleNavClick('plans')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'plans' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              🏅 Membership Plans
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'orders' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              📦 Order History
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'about' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              🌱 About Fresh Care
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'contact' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
              }`}
            >
              📞 Contact Us
            </button>

            <div className="pt-2 border-t border-slate-200 mt-2">
              <p className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider mb-2">
                Switch Role Mode:
              </p>
              <div className="grid grid-cols-2 gap-2 px-1">
                <button
                  onClick={() => {
                    onSelectRole('portal');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 ${
                    currentRole === 'portal' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>General Portal</span>
                </button>
                <button
                  onClick={() => {
                    onSelectRole('member');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 ${
                    currentRole === 'member' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Customer View</span>
                </button>
                <button
                  onClick={() => {
                    onSelectRole('owner');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 ${
                    currentRole === 'owner' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Owner Admin</span>
                </button>
                <button
                  onClick={() => {
                    onSelectRole('delivery');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 ${
                    currentRole === 'delivery' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery Rider</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
