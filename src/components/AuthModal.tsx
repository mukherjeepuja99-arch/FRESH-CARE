import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  LogOut, 
  ShieldCheck, 
  Award,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile, MemberRecord } from '../types';
import { 
  createCustomerAccountInFirestore, 
  loginCustomerWithEmailPassword, 
  registerMemberInFirestore 
} from '../firebase/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onMemberRegistered?: (member: MemberRecord) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onLogout,
  onMemberRegistered,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [membershipPlan, setMembershipPlan] = useState<string>(userProfile.membershipPlan || 'Fresh Care Prime Saver Plan');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState(userProfile.address || '');
  const [city, setCity] = useState(userProfile.city || 'Dankuni');
  const [pincode, setPincode] = useState(userProfile.pincode || '712311');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    if (tab === 'login') {
      try {
        const result = await loginCustomerWithEmailPassword(cleanEmail, cleanPassword);
        if (result.success && result.user) {
          onUpdateProfile(result.user);
          setMessage('✓ Logged in successfully!');
          setTimeout(() => {
            setMessage('');
            onClose();
          }, 1000);
        } else {
          setErrorMessage(result.error || 'Invalid credentials. Please check your email and password.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Login failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Register flow
    if (tab === 'register') {
      if (cleanPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }

      try {
        const result = await createCustomerAccountInFirestore({
          name: name.trim(),
          email: cleanEmail,
          password: cleanPassword,
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          membershipPlan,
        });

        if (result.success && result.user) {
          onUpdateProfile(result.user);

          if (onMemberRegistered) {
            onMemberRegistered({
              id: `mem-${Date.now()}`,
              name: name.trim(),
              email: cleanEmail,
              phone: phone.trim() || '+91 98000 00000',
              membershipPlan,
              joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              activeStatus: 'Active',
              address: address.trim(),
              city: city.trim(),
              pincode: pincode.trim(),
            });
          }

          setMessage('✓ Customer account created & saved to Firestore!');
          setTimeout(() => {
            setMessage('');
            onClose();
          }, 1200);
        } else {
          setErrorMessage(result.error || 'Failed to create account.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Registration failed.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  {userProfile.isLoggedIn ? 'Your Fresh Care Profile' : tab === 'register' ? 'Create Customer Account' : 'Customer Sign In'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Firestore Linked
                </span>
              </div>
              <p className="text-xs text-slate-500">Access orders, fast checkout & saved delivery addresses</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {userProfile.isLoggedIn ? (
          /* Profile Details View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold font-['Outfit']">
                {(userProfile.name || 'U').charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{userProfile.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                    Active Member
                  </span>
                </div>
                <p className="text-xs text-slate-600">{userProfile.email}</p>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">{userProfile.phone}</p>
              </div>
            </div>

            {userProfile.membershipPlan && (
              <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-700" />
                  <div>
                    <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">
                      Membership Plan:
                    </span>
                    <span className="font-bold text-slate-900">{userProfile.membershipPlan}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                  Active
                </span>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Saved Delivery Address (Garalgacha Hub):
              </span>
              <p className="text-slate-800 font-medium">{userProfile.address || 'Address provided during order'}</p>
              <p className="text-slate-500">{userProfile.city || 'Dankuni'} - {userProfile.pincode || '712311'}</p>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Synced with Firebase Firestore Realtime Database</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  setMessage('Logged out successfully');
                  setTimeout(() => setMessage(''), 2000);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="p-6 sm:p-8 space-y-5">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage('');
                  setMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage('');
                  setMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {message && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {tab === 'register' && (
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Phone Number (For Order Updates)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Select Membership Tier
                    </label>
                    <select
                      value={membershipPlan}
                      onChange={(e) => setMembershipPlan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none font-medium text-slate-800"
                    >
                      <option value="Fresh Care Prime Saver Plan">Fresh Care Prime Saver Plan (₹199/mo)</option>
                      <option value="Gold VIP Super Shopper Plan">Gold VIP Super Shopper Plan (₹999/yr)</option>
                      <option value="Standard Community Member">Standard Community Member (Free)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Landmark..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <span>{tab === 'register' ? 'Create Account & Join' : 'Sign In with Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
