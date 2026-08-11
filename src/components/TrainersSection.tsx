import React, { useState } from 'react';
import { UserCheck, Clock, Award, Phone, Calendar, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { TrainerRecord } from '../types';

interface TrainersSectionProps {
  trainers: TrainerRecord[];
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({ trainers }) => {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerRecord | null>(null);
  const [consultationSuccess, setConsultationSuccess] = useState<string | null>(null);

  const handleBookConsultation = (trainer: TrainerRecord) => {
    setSelectedTrainer(trainer);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSuccess(`Consultation requested with ${selectedTrainer?.trainerName}! Our coordinator will reach out on WhatsApp.`);
    setTimeout(() => {
      setSelectedTrainer(null);
      setConsultationSuccess(null);
    }, 3000);
  };

  return (
    <section id="trainers-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Health & Nutrition Advisors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Certified Nutritionists & Wellness Coaches
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Get personalized dietary advice on incorporating stone-ground turmeric, unpolished pulses, and pure dry fruits into your daily fitness routine.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((t) => (
            <div
              key={t.id || t.trainerName}
              className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Trainer Image & Availability */}
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={t.image || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'}
                    alt={t.trainerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs border ${
                      t.availability === 'Available'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : t.availability === 'Slots Open'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-700 text-slate-200 border-slate-600'
                    }`}>
                      ● {t.availability}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-3 text-xs">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">{t.trainerName}</h3>
                    <p className="text-emerald-700 font-semibold text-xs mt-0.5">{t.specialty}</p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span><strong>Experience:</strong> {t.experience}</span>
                  </div>

                  {t.bio && (
                    <p className="text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2.5">
                      {t.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleBookConsultation(t)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Diet & Wellness Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Book Consultation with {selectedTrainer.trainerName}
              </h3>
              <button
                onClick={() => setSelectedTrainer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {consultationSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{consultationSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                <p className="text-slate-600">
                  {selectedTrainer.specialty} • Experience: {selectedTrainer.experience}
                </p>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Goal / Health Query</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Weight management, diabetic organic diet, herbal recovery..."
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Confirm Free Consultation Call
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
