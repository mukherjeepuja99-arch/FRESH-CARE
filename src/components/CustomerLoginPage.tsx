import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  Package, 
  Award,
  Truck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Customer } from '../types';
import { 
  loginCustomerWithEmailPassword, 
  createCustomerAccountInFirestore 
} from '../firebase/dbService';

interface CustomerLoginPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  onExploreGuest: () => void;
  existingCustomers?: Customer[];
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  onLoginSuccess,
  onExploreGuest,
  existingCustomers = [],
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dankuni');
  const [pincode, setPincode] = useState('712311');
  const [membershipPlan, setMembershipPlan] = useState('Fresh Care Prime Saver Plan');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Quick 1-Click Login for Demo Accounts
  const handleQuickLogin = (demoEmail: string, demoName: string, demoPhone: string, demoAddress: string, plan: string) => {
    setErrorMessage('');
    setSuccessMessage(`Logging in as ${demoName}...`);
    
    setTimeout(() => {
      const profile: UserProfile = {
        name: demoName,
        email: demoEmail,
        phone: demoPhone,
        address: demoAddress,
        city: 'Dankuni',
        pincode: '712311',
        membershipPlan: plan,
        isLoggedIn: true,
      };
      onLoginSuccess(profile);
    }, 400);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginCustomerWithEmailPassword(cleanEmail, cleanPassword);
      if (result.success && result.user) {
        setSuccessMessage(`✓ Welcome back, ${result.user.name}!`);
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 500);
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your 10-digit phone number.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newAccount = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim() || 'Station Road, Garalgacha',
        city: city.trim() || 'Dankuni',
        pincode: pincode.trim() || '712311',
        membershipPlan: membershipPlan,
        password: password.trim(),
      };

      const result = await createCustomerAccountInFirestore(newAccount);
      if (result.success && result.user) {
        setSuccessMessage(`✓ Account created successfully! Logging you in...`);
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 600);
      } else {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Brand Story, Perks & Security */}
        <div className="lg:col-span-5 bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-white flex items-center justify-center text-2xl font-bold shadow-inner">
                🌿
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
                    Fresh<span className="text-emerald-400">Care</span>
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    Customer Portal
                  </span>
                </div>
                <p className="text-xs text-slate-300">Garalgacha, Dankuni • Pure Grocery</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] leading-tight">
                Log In to Access Your Grocery Cart & Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sign in to your private account to manage your shopping cart, unlock exclusive member pricing, track express deliveries, and download GST tax invoices.
              </p>
            </div>

            {/* Member Benefits List */}
            <div className="space-y-3 pt-4 border-t border-slate-700/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Private Cart & Quick Checkout</h4>
                  <p className="text-[11px] text-slate-400">Your selected spices, dals & dry fruits remain safely preserved in your cart.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Live Express Delivery Tracking</h4>
                  <p className="text-[11px] text-slate-400">Track assigned riders in Dankuni & Garalgacha in real time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Prime Member Savings & Invoices</h4>
                  <p className="text-[11px] text-slate-400">Save up to 10% on every order with free delivery and official tax bills.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance & Guest Button */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-700/60 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SSL Secured & Powered by Firestore Cloud Database</span>
            </div>

            <button
              onClick={onExploreGuest}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Storefront as Guest (No Account)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Customer Login / Register Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between">
          <div>
            {/* Tab Selection: Sign In vs Register */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                id="tab-customer-login"
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer Sign In
              </button>
              <button
                id="tab-customer-register"
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create New Account
              </button>
            </div>

            {/* Notification messages */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Quick 1-Click Demo Accounts (Instant Test Bar) */}
            <div className="mb-6 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant 1-Click Demo Sign In:</span>
                </span>
                <span className="text-[10px] text-emerald-700">Quick Test</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="quick-login-swapnil"
                  onClick={() => handleQuickLogin(
                    'swapnil.mukherjee@example.com',
                    'Swapnil Mukherjee',
                    '+91 98300 45678',
                    'House 22, Station Road, Garalgacha',
                    'Fresh Care Prime Saver Plan'
                  )}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-left text-xs transition-colors cursor-pointer shadow-2xs group"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-emerald-700">
                      Swapnil Mukherjee
                    </span>
                    <span className="text-[10px] text-slate-500 block">Prime Member (Dankuni)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Log In →
                  </span>
                </button>

                <button
                  type="button"
                  id="quick-login-priya"
                  onClick={() => handleQuickLogin(
                    'priya.sharma@example.com',
                    'Priya Sharma',
                    '+91 98765 43210',
                    'Flat 4B, Greenfield Apts, Dankuni',
                    'Fresh Care Prime Saver Plan'
                  )}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-left text-xs transition-colors cursor-pointer shadow-2xs group"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-emerald-700">
                      Priya Sharma
                    </span>
                    <span className="text-[10px] text-slate-500 block">Prime Gold Member</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Log In →
                  </span>
                </button>
              </div>
            </div>

            {/* FORM 1: CUSTOMER LOGIN */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. swapnil.mukherjee@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Demo password: <strong className="text-emerald-700">pass123</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span>Remember my login</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('swapnil.mukherjee@example.com');
                      setPassword('pass123');
                      setSuccessMessage('Credentials auto-filled for Swapnil Mukherjee!');
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Auto-Fill Demo
                  </button>
                </div>

                <button
                  id="btn-customer-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* FORM 2: CREATE NEW ACCOUNT / REGISTER */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reg-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sen"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reg-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reg-phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98300 00000"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Delivery Address (Garalgacha / Dankuni)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="reg-address-input"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat number, Street name, Landmark"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Create Password *
                    </label>
                    <input
                      id="reg-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Confirm Password *
                    </label>
                    <input
                      id="reg-conf-password-input"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Membership Plan
                  </label>
                  <select
                    value={membershipPlan}
                    onChange={(e) => setMembershipPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Fresh Care Prime Saver Plan">Fresh Care Prime Saver Plan (₹99/mo - Free Deliveries)</option>
                    <option value="Organic Household Wellness Plan">Organic Household Wellness Plan (₹249/quarter)</option>
                    <option value="Annual Family Pantry Plan">Annual Family Pantry Plan (₹899/year)</option>
                  </select>
                </div>

                <button
                  id="btn-customer-register-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering in Firestore...</span>
                  ) : (
                    <>
                      <span>Create Account & Start Shopping</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Register in 30 seconds
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
