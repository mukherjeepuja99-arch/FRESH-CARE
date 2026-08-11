import React from 'react';
import { Bell, Sparkles, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { AnnouncementRecord } from '../types';

interface AnnouncementsSectionProps {
  announcements: AnnouncementRecord[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements }) => {
  const activeAnnouncements = announcements.filter(a => a.activeStatus);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-400 shrink-0">
          <Bell className="w-4 h-4 animate-bounce" />
          <span>Live Store Announcements:</span>
        </div>

        <div className="flex-1 flex flex-wrap items-center gap-4">
          {activeAnnouncements.map((ann) => (
            <div
              key={ann.id || ann.title}
              className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200"
            >
              <span className="font-bold text-white">{ann.title}</span>
              <span className="hidden sm:inline text-slate-400">— {ann.message}</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                {ann.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
