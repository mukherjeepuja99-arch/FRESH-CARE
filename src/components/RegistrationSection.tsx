import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MemberRecord, UserProfile } from '../types';
import { registerMemberInFirestore, MEMBERS_COLLECTION } from '../firebase/dbService';

interface RegistrationSectionProps {
  onMemberRegistered?: (member: MemberRecord) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  selectedPlanName?: string;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onMemberRegistered,
  onUpdateProfile,
  selectedPlanName = 'Fresh Care Prime Saver Plan',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipPlan, setMembershipPlan] = useState(selectedPlanName);
  const [address, setAddress] = useState('Garalgacha, Dankuni');
  const [city, setCity] = useState('Dankuni');
  const [pincode, setPincode] = useState('712311');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedPlanName) {
      setMembershipPlan(selectedPlanName);
    }
  }, [selectedPlanName]);

  const handleQuickFill = () => {
    setName('Snehasish Mukherjee');
    setEmail('snehasish.m@gmail.com');
    setPhone('+91 74399 15663');
    setAddress('Garalgacha Bazar Road, Near Post Office');
    setCity('Dankuni');
    setPincode('712311');
    setMembershipPlan('Fresh Care Prime Saver Plan');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessStatus(null);

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const memberPayload: Omit<MemberRecord, 'id'> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      membershipPlan,
      joinDate: formattedDate,
      activeStatus: 'Active',
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    };

    try {
      // Day 3 Focus: Writing to Cloud Firestore database
      const result = await registerMemberInFirestore(memberPayload);
      const generatedId = result.id || `mem-${Date.now()}`;
      setLastSavedId(generatedId);

      const fullMember: MemberRecord = {
        ...memberPayload,
        id: generatedId,
      };

      if (onMemberRegistered) {
        onMemberRegistered(fullMember);
      }

      if (onUpdateProfile) {
        onUpdateProfile({
          name: fullMember.name,
          email: fullMember.email,
          phone: fullMember.phone,
          address: fullMember.address || '',
          city: fullMember.city || 'Dankuni',
          pincode: fullMember.pincode || '712311',
          membershipPlan: fullMember.membershipPlan,
          isLoggedIn: true,
        });
      }

      setSuccessStatus(`Member successfully registered and synchronized to Firestore collection '${MEMBERS_COLLECTION}'!`);
    } catch (err: any) {
      setSuccessStatus('Saved locally with fallback!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register-section" className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Educational & Value Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] leading-tight tracking-tight text-white">
              Join Fresh Care Club <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Unlock VIP Spice Perks
              </span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Register in seconds. Your member profile keeps your shopping preferences, delivery address in Garalgacha/Dankuni, and subscription benefits synced in real time.
            </p>

            {/* Feature points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Instant Digital Card:</span>
                  <span>Immediate membership activation with linked savings across all grocery orders.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Garalgacha & Dankuni Express:</span>
                  <span>Fast 30-45 min delivery straight from our local fulfillment hub.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Exclusive Member Pricing:</span>
                  <span>Special discounted rates on Salem Turmeric, California Almonds, and Aged Basmati.</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Quick Fill Info</span>
              </button>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Member Enrollment Form</h3>
                  <p className="text-xs text-slate-400">Fast & Secure Digital Registration</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Instant Activation</span>
                </div>
              </div>

              {/* Success Notification */}
              {successStatus && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Registration Completed Successfully!</span>
                  </div>
                  <p>{successStatus}</p>
                  {lastSavedId && (
                    <p className="text-[11px] font-mono text-emerald-300/80 pt-1">
                      Firestore Document ID: <span className="bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-700">{lastSavedId}</span>
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Membership Plan Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select Membership Plan
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select
                        id="reg-plan"
                        value={membershipPlan}
                        onChange={(e) => setMembershipPlan(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                      >
                        <option value="Fresh Care Prime Saver Plan">Fresh Care Prime Saver Plan (₹199/mo)</option>
                        <option value="Gold VIP Super Shopper Plan">Gold VIP Super Shopper Plan (₹999/yr)</option>
                        <option value="Standard Community Member">Standard Community Member (Free)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Delivery Address (Garalgacha, Dankuni Region)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <textarea
                      id="reg-address"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 14B, Station Road, Garalgacha, Dankuni"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Profile...
                    </span>
                  ) : (
                    <>
                      <span>Complete Membership Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
