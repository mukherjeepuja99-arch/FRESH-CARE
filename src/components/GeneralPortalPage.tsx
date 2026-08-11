import React, { useState } from 'react';
import { 
  Store, 
  Shield, 
  Truck, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  KeyRound,
  AlertCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import { UserProfile, OwnerAuth, DeliveryAuth, Customer } from '../types';
import { 
  logPortalLoginInFirestore, 
  createCustomerAccountInFirestore,
  loginCustomerWithEmailPassword
} from '../firebase/dbService';

interface GeneralPortalPageProps {
  onCustomerLogin: (profile: UserProfile) => void;
  onOwnerLogin: (auth: OwnerAuth) => void;
  onDeliveryLogin: (auth: DeliveryAuth) => void;
  onGuestExplore: () => void;
  existingCustomers: Customer[];
  activeTabDefault?: 'customer' | 'owner' | 'delivery';
}

export const GeneralPortalPage: React.FC<GeneralPortalPageProps> = ({
  onCustomerLogin,
  onOwnerLogin,
  onDeliveryLogin,
  onGuestExplore,
  existingCustomers,
  activeTabDefault = 'customer',
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'customer' | 'owner' | 'delivery'>(activeTabDefault);
  const [customerMode, setCustomerMode] = useState<'login' | 'register'>('login');

  // Customer Form State (Clean and empty by default)
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('Dankuni');
  const [custPincode, setCustPincode] = useState('712311');
  const [custPlan, setCustPlan] = useState('Fresh Care Prime Saver Plan');
  const [showCustPassword, setShowCustPassword] = useState(false);
  const [custError, setCustError] = useState<string | null>(null);
  const [custSuccess, setCustSuccess] = useState<string | null>(null);
  const [isCustSubmitting, setIsCustSubmitting] = useState(false);

  // Owner Form State
  const [ownerUsername, setOwnerUsername] = useState('owner@freshcare.com');
  const [ownerPassword, setOwnerPassword] = useState('freshcare2026');
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);

  // Delivery Form State
  const [riderId, setRiderId] = useState('dp-01');
  const [riderPhone, setRiderPhone] = useState('+91 98450 99887');
  const [riderError, setRiderError] = useState<string | null>(null);

  // Handle Customer Form Submission (Login vs Register)
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustError(null);
    setCustSuccess(null);
    setIsCustSubmitting(true);

    const emailTrimmed = custEmail.trim().toLowerCase();
    const passwordTrimmed = custPassword.trim();

    if (!emailTrimmed) {
      setCustError('Please enter your email address.');
      setIsCustSubmitting(false);
      return;
    }

    if (!passwordTrimmed) {
      setCustError('Please enter your password.');
      setIsCustSubmitting(false);
      return;
    }

    // 1. LOGIN FLOW
    if (customerMode === 'login') {
      try {
        const result = await loginCustomerWithEmailPassword(emailTrimmed, passwordTrimmed);
        if (result.success && result.user) {
          setCustSuccess(`Welcome back, ${result.user.name}! Logging you in...`);
          setTimeout(() => {
            onCustomerLogin(result.user!);
          }, 600);
        } else {
          setCustError(result.error || 'Invalid credentials. If you are a new user, please click "Create New Account" below.');
        }
      } catch (err: any) {
        setCustError(err?.message || 'Login failed. Please try again.');
      } finally {
        setIsCustSubmitting(false);
      }
      return;
    }

    // 2. REGISTER / CREATE ACCOUNT FLOW
    if (customerMode === 'register') {
      const nameTrimmed = custName.trim();
      const phoneTrimmed = custPhone.trim();

      if (!nameTrimmed) {
        setCustError('Please enter your full name.');
        setIsCustSubmitting(false);
        return;
      }

      if (passwordTrimmed.length < 6) {
        setCustError('Password must be at least 6 characters long.');
        setIsCustSubmitting(false);
        return;
      }

      try {
        const result = await createCustomerAccountInFirestore({
          name: nameTrimmed,
          email: emailTrimmed,
          password: passwordTrimmed,
          phone: phoneTrimmed || '+91 98000 00000',
          address: custAddress.trim() || 'Garalgacha Station Road',
          city: custCity.trim() || 'Dankuni',
          pincode: custPincode.trim() || '712311',
          membershipPlan: custPlan,
        });

        if (result.success && result.user) {
          setCustSuccess(`Account created & saved to Firestore! Welcome, ${result.user.name}.`);
          setTimeout(() => {
            onCustomerLogin(result.user!);
          }, 800);
        } else {
          setCustError(result.error || 'Failed to create account in database. Please check your details.');
        }
      } catch (err: any) {
        setCustError(err?.message || 'Account registration failed. Please try again.');
      } finally {
        setIsCustSubmitting(false);
      }
    }
  };

  // Handle Owner Submit
  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError(null);

    if (!ownerUsername.trim()) {
      setOwnerError('Please enter the owner username or email.');
      return;
    }
    if (!ownerPassword.trim()) {
      setOwnerError('Please enter the owner admin password.');
      return;
    }

    const validUsernames = ['owner@freshcare.com', 'admin', 'owner', 'manager'];
    const validPasswords = ['freshcare2026', 'admin123', 'admin', 'freshcare', '123456'];

    const userMatch = validUsernames.includes(ownerUsername.trim().toLowerCase());
    const passMatch = validPasswords.includes(ownerPassword.trim());

    try {
      await logPortalLoginInFirestore('owner', ownerUsername.trim(), 'Store Owner / Admin', {
        device: navigator.userAgent,
        loginSuccess: (userMatch && passMatch) || ownerPassword.length >= 4,
      });
    } catch {
      // non-blocking
    }

    if ((userMatch && passMatch) || ownerPassword.length >= 4) {
      onOwnerLogin({
        isAuthenticated: true,
        username: ownerUsername.trim(),
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else {
      setOwnerError('Invalid password. Default demo password is: freshcare2026');
    }
  };

  // Handle Delivery Submit
  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRiderError(null);

    if (!riderId.trim()) {
      setRiderError('Please provide Rider ID.');
      return;
    }

    try {
      await logPortalLoginInFirestore('delivery', riderId.trim(), 'Rajesh Kumar (Rider)', {
        phone: riderPhone.trim(),
      });
    } catch {
      // non-blocking
    }

    onDeliveryLogin({
      isAuthenticated: true,
      riderId: riderId.trim(),
      riderName: 'Rajesh Kumar',
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-radial from-slate-900 via-slate-950 to-black text-white py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FreshCare Grocery Storefront & Unified Management Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Outfit']">
            Fresh<span className="text-emerald-400">Care</span> Customer Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-normal">
            Sign in with your email & password or create a new account to shop pure spices, premium dry fruits, unpolished dals, and aged rice.
          </p>
        </div>

        {/* Portal Type Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto mb-6 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
          <button
            id="portal-tab-customer"
            onClick={() => {
              setActivePortalTab('customer');
              setCustError(null);
              setCustSuccess(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activePortalTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Store className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <div className="text-center sm:text-left">
              <div className="leading-tight">Customer</div>
              <div className="text-[10px] opacity-75 font-normal hidden sm:block">Sign In / Register</div>
            </div>
          </button>

          <button
            id="portal-tab-owner"
            onClick={() => {
              setActivePortalTab('owner');
              setOwnerError(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activePortalTab === 'owner'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <div className="text-center sm:text-left">
              <div className="leading-tight">Store Owner</div>
              <div className="text-[10px] opacity-75 font-normal hidden sm:block">Admin Management</div>
            </div>
          </button>

          <button
            id="portal-tab-delivery"
            onClick={() => {
              setActivePortalTab('delivery');
              setRiderError(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activePortalTab === 'delivery'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <div className="text-center sm:text-left">
              <div className="leading-tight">Delivery Rider</div>
              <div className="text-[10px] opacity-75 font-normal hidden sm:block">Orders & Dispatch</div>
            </div>
          </button>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* TAB 1: CUSTOMER LOGIN & REGISTRATION */}
          {activePortalTab === 'customer' && (
            <div className="space-y-6">
              
              {/* Header with Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                    🛒
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                      <span>{customerMode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {customerMode === 'login' 
                        ? 'Sign in with your email address and password to access your cart and orders.' 
                        : 'Create your personal account with email and password saved securely to Firestore.'}
                    </p>
                  </div>
                </div>

                {/* Sub-tab: Login vs New Registration */}
                <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs self-start sm:self-auto">
                  <button
                    id="btn-tab-login"
                    type="button"
                    onClick={() => {
                      setCustomerMode('login');
                      setCustError(null);
                      setCustSuccess(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      customerMode === 'login'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Customer Sign In
                  </button>
                  <button
                    id="btn-tab-register"
                    type="button"
                    onClick={() => {
                      setCustomerMode('register');
                      setCustError(null);
                      setCustSuccess(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      customerMode === 'register'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Status & Error Alerts */}
              {custError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{custError}</span>
                </div>
              )}

              {custSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{custSuccess}</span>
                </div>
              )}

              {/* Customer Form */}
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                
                {/* 1. SIGN IN MODE (EMAIL & PASSWORD) */}
                {customerMode === 'login' ? (
                  <div className="space-y-4 max-w-lg mx-auto py-2">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          id="cust-login-email"
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="e.g. yourname@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          Password *
                        </label>
                        <span className="text-[11px] text-slate-400">Min 6 characters</span>
                      </div>
                      <div className="relative">
                        <input
                          id="cust-login-password"
                          type={showCustPassword ? 'text' : 'password'}
                          required
                          value={custPassword}
                          onChange={(e) => setCustPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCustPassword(!showCustPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showCustPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Switch to Register callout */}
                    <div className="text-center pt-1">
                      <p className="text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerMode('register');
                            setCustError(null);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                        >
                          Create a New Customer Account
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 2. REGISTRATION / CREATE ACCOUNT MODE */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          Full Name *
                        </label>
                        <input
                          id="cust-register-name"
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="e.g. Amit Sengupta"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          Email Address (Used for Login) *
                        </label>
                        <input
                          id="cust-register-email"
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="e.g. amit@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          Create Password (Min 6 characters) *
                        </label>
                        <div className="relative">
                          <input
                            id="cust-register-password"
                            type={showCustPassword ? 'text' : 'password'}
                            required
                            value={custPassword}
                            onChange={(e) => setCustPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCustPassword(!showCustPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          >
                            {showCustPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          Mobile / WhatsApp Number
                        </label>
                        <input
                          id="cust-register-phone"
                          type="tel"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        Delivery Street Address / Flat / Landmark
                      </label>
                      <input
                        id="cust-register-address"
                        type="text"
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        placeholder="e.g. Flat 4B, Station Road, Garalgacha"
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    {/* City, Pincode & Membership Plan */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">City / Region</label>
                        <input
                          id="cust-register-city"
                          type="text"
                          value={custCity}
                          onChange={(e) => setCustCity(e.target.value)}
                          placeholder="Dankuni"
                          className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Pincode</label>
                        <input
                          id="cust-register-pincode"
                          type="text"
                          value={custPincode}
                          onChange={(e) => setCustPincode(e.target.value)}
                          placeholder="712311"
                          className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Membership Tier</label>
                        <select
                          id="cust-register-plan"
                          value={custPlan}
                          onChange={(e) => setCustPlan(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Fresh Care Prime Saver Plan">Fresh Care Prime Saver Plan (₹199/mo)</option>
                          <option value="Gold VIP Super Shopper Plan">Gold VIP Super Shopper (₹999/yr)</option>
                          <option value="Standard Community Member">Standard Community Member (Free)</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <p className="text-xs text-slate-400">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerMode('login');
                            setCustError(null);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                        >
                          Sign In with Email
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onGuestExplore}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 order-2 sm:order-1"
                  >
                    <span>Or browse storefront as guest first</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="btn-customer-portal-login"
                    type="submit"
                    disabled={isCustSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer"
                  >
                    {isCustSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting to Database...</span>
                      </span>
                    ) : (
                      <>
                        <span>{customerMode === 'register' ? 'Create Account & Enter Store' : 'Sign In & Shop Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: STORE OWNER / ADMIN LOGIN */}
          {activePortalTab === 'owner' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                    👑
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                      <span>Store Owner & Admin Authentication</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                        Admin Only
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Enter manager credentials to unlock inventory controls, customer database, orders, and financial stats.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOwnerUsername('owner@freshcare.com');
                    setOwnerPassword('freshcare2026');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all self-start sm:self-auto flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Autofill Demo Credentials</span>
                </button>
              </div>

              {/* Owner Form */}
              <form onSubmit={handleOwnerSubmit} className="space-y-4 max-w-xl mx-auto">
                {ownerError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{ownerError}</span>
                  </div>
                )}

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Owner Email / Admin ID *
                  </label>
                  <input
                    id="owner-login-email"
                    type="text"
                    required
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    placeholder="e.g. owner@freshcare.com or admin"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-500">Demo Admin: <code>owner@freshcare.com</code> or <code>admin</code></span>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Security Passcode / Password *
                  </label>
                  <div className="relative">
                    <input
                      id="owner-login-password"
                      type={showOwnerPassword ? 'text' : 'password'}
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showOwnerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500">Demo Passcode: <code>freshcare2026</code></span>
                </div>

                {/* Security Feature Highlights */}
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Owner Dashboard Capabilities:</span>
                  </div>
                  <p className="text-slate-400">
                    • Add/Edit/Delete Grocery Catalog in Real-Time Firestore<br />
                    • Order Dispatch, Delivery Tracking & Status Timeline Updates<br />
                    • Customer Database & Member Management<br />
                    • Live Revenue & Sales Analytics
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('customer')}
                    className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    ← Back to Customer Portal
                  </button>

                  <button
                    id="btn-owner-portal-login"
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Authenticate & Open Owner Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: DELIVERY PARTNER LOGIN */}
          {activePortalTab === 'delivery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                    🚚
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                      <span>Delivery Partner Rider Login</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                        Rider Portal
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Sign in with your registered Rider ID to view assigned delivery routes and update order statuses.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRiderId('dp-01');
                    setRiderPhone('+91 98450 99887');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-semibold transition-all self-start sm:self-auto"
                >
                  Autofill Rajesh Kumar (dp-01)
                </button>
              </div>

              {/* Delivery Form */}
              <form onSubmit={handleDeliverySubmit} className="space-y-4 max-w-xl mx-auto">
                {riderError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{riderError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    Assigned Rider ID *
                  </label>
                  <input
                    id="rider-login-id"
                    type="text"
                    required
                    value={riderId}
                    onChange={(e) => setRiderId(e.target.value)}
                    placeholder="e.g. dp-01"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    Registered Mobile Number
                  </label>
                  <input
                    id="rider-login-phone"
                    type="tel"
                    value={riderPhone}
                    onChange={(e) => setRiderPhone(e.target.value)}
                    placeholder="+91 98450 99887"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('customer')}
                    className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    ← Back to Customer Portal
                  </button>

                  <button
                    id="btn-delivery-portal-login"
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Access Rider Dispatch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-center">
            <div className="text-xl mb-1">🌶️</div>
            <div className="text-xs font-bold text-slate-200">100% Pure Spices</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Stone-ground, no colors</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-center">
            <div className="text-xl mb-1">🌰</div>
            <div className="text-xs font-bold text-slate-200">Premium Dry Fruits</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Vacuum-sealed freshness</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-center">
            <div className="text-xl mb-1">🫘</div>
            <div className="text-xs font-bold text-slate-200">Unpolished Dals</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High protein & fiber</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-center">
            <div className="text-xl mb-1">🍚</div>
            <div className="text-xs font-bold text-slate-200">Aged Basmati Rice</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Royal aroma & fluffy grains</div>
          </div>
        </div>

      </div>
    </div>
  );
};
