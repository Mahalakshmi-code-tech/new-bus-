import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RouteTimeline({ 
  stops = [
    { id: 1, name: 'Central Station', time: '10:15 AM', status: 'passed', note: 'Departure Point • 0.0 km' },
    { id: 2, name: 'Civic Center', time: '10:22 AM', status: 'passed', note: '2.4 km' },
    { id: 3, name: 'Main Road / Market Hub', time: '10:28 AM', status: 'active', note: 'Current Segment • Next Stop in 6 min', transfer: 'Transfer to Route C' },
    { id: 4, name: 'University District', time: 'Est. 10:38 AM', status: 'upcoming', note: '14.5 km' },
    { id: 5, name: 'College Campus Terminal', time: 'Est. 10:45 AM', status: 'terminal', note: 'Final Destination • 18.4 km' },
  ] 
}) {
  return (
    <div className="bg-surface dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-black/40 border border-outline-variant/30 dark:border-slate-800 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-lg text-on-surface dark:text-slate-100">Journey Progress</h3>
        <span className="text-xs font-label text-primary dark:text-cyan-400 uppercase tracking-wider bg-primary/10 dark:bg-primary/25 px-3 py-1 rounded-full font-bold">
          Live Route Telemetry
        </span>
      </div>

      <div className="relative pl-7 border-l-2 border-primary/20 dark:border-primary/30 space-y-7 font-body">
        {stops.map((stop, index) => {
          if (stop.status === 'passed') {
            return (
              <div key={stop.id} className="relative group">
                <div className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-primary-fixed/50 dark:ring-blue-900/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-label text-outline dark:text-slate-400">{stop.time}</span>
                    <span className="text-[10px] text-primary dark:text-cyan-400 font-bold bg-primary/10 dark:bg-primary/20 px-1.5 py-0.5 rounded">Departed</span>
                  </div>
                  <p className="font-bold text-on-surface dark:text-slate-100 text-base">{stop.name}</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{stop.note}</p>
                </div>
              </div>
            );
          }

          if (stop.status === 'active') {
            return (
              <div key={stop.id} className="relative bg-primary-fixed/20 dark:bg-blue-950/40 p-4 rounded-2xl border border-primary/30 dark:border-blue-800/60 -ml-2">
                <div className="absolute -left-[30px] top-6 w-5 h-5 bg-white dark:bg-slate-900 rounded-full border-4 border-primary dark:border-cyan-400 shadow-md flex items-center justify-center z-10">
                  <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full pulse-node"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-label font-bold text-primary dark:text-cyan-400">{stop.time}</span>
                    <span className="bg-[#00ffff] text-[#001849] text-[10px] font-label font-bold px-2 py-0.5 rounded-full neon-cyan-glow">
                      ARRIVING
                    </span>
                  </div>
                  <p className="font-headline font-bold text-primary dark:text-cyan-300 text-base">{stop.name}</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-300 mt-0.5">{stop.note}</p>
                  {stop.transfer && (
                    <div className="mt-2 text-[11px] font-semibold bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 px-2.5 py-1 rounded-lg inline-block border border-outline-variant/30 dark:border-slate-700">
                      {stop.transfer}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (stop.status === 'terminal') {
            return (
              <div key={stop.id} className="relative">
                <div className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-primary dark:bg-cyan-400 border-2 border-white dark:border-slate-900 shadow-md z-10 neon-cyan-glow"></div>
                <div>
                  <span className="text-xs font-label text-outline dark:text-slate-400">{stop.time}</span>
                  <p className="font-headline font-bold text-on-surface dark:text-slate-100 text-base">{stop.name}</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{stop.note}</p>
                </div>
              </div>
            );
          }

          // Upcoming stops
          return (
            <div key={stop.id} className="relative">
              <div className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-surface-container-highest dark:bg-slate-700 border-2 border-outline-variant dark:border-slate-600 z-10"></div>
              <div>
                <span className="text-xs font-label text-outline dark:text-slate-400">{stop.time}</span>
                <p className="font-bold text-on-surface-variant dark:text-slate-300 text-base">{stop.name}</p>
                <p className="text-xs text-on-surface-variant/80 dark:text-slate-400 mt-0.5">{stop.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
