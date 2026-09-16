import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell, 
  ChevronRight, 
  ArrowRight, 
  Navigation, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  Compass
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AnimatedCounter from '../components/AnimatedCounter';

export default function UserDashboard({ setCurrentPage, currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDeparture, setSelectedDeparture] = useState(null);

  const departures = [
    { time: '08:30', destination: 'City Center Hub', platform: 'Platform 2', bus: 'Bus 101', eta: '6 min', status: 'On Time' },
    { time: '09:15', destination: 'Tech Park Innovation', platform: 'Platform 1', bus: 'Bus 108', eta: '51 min', status: 'On Time' },
    { time: '10:00', destination: 'North Campus Terminal', platform: 'Platform 3', bus: 'Bus 204', eta: '1h 36m', status: 'Scheduled' },
  ];

  const recentTrips = [
    { date: 'Yesterday, 5:30 PM', route: 'Tech Park to Home', fare: '$2.50', busId: 'Bus 108' },
    { date: 'Mon, 8:15 AM', route: 'Home to Tech Park', fare: '$2.50', busId: 'Bus 101' },
    { date: 'Sun, 2:40 PM', route: 'Downtown to Riverside', fare: '$2.00', busId: 'Bus 305' },
  ];

  return (
    <div className="font-body text-on-surface dark:text-slate-100 bg-background dark:bg-[#0b1120] flex min-h-screen transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar 
        currentPage="user-dashboard"
        setCurrentPage={setCurrentPage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-margin-desktop min-h-screen pt-20 md:pt-10 pb-24 md:pb-10 animate-fade-up">
        {/* Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-4">
          <div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              Welcome back, Alex 👋
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">
              Here's your passenger transit overview and live journey tracker.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button 
              onClick={() => setCurrentPage('tracking')}
              className="btn-primary text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-primary/20 flex items-center gap-1.5 min-h-0 h-9"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Full Radar</span>
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-primary-container shadow-xs">
              AC
            </div>
          </div>
        </header>

        {/* Commuter Quick Stats Strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="glass-panel dark:bg-slate-850/80 rounded-2xl p-3 sm:p-4 text-center border border-white/70 dark:border-slate-750">
            <span className="text-[10px] font-label uppercase text-slate-400 block font-bold">Active Buses</span>
            <AnimatedCounter value={118} className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-cyan-400" />
          </div>
          <div className="glass-panel dark:bg-slate-850/80 rounded-2xl p-3 sm:p-4 text-center border border-white/70 dark:border-slate-750">
            <span className="text-[10px] font-label uppercase text-slate-400 block font-bold">Available Routes</span>
            <AnimatedCounter value={85} className="font-headline font-black text-xl sm:text-2xl text-on-surface dark:text-slate-100" />
          </div>
          <div className="glass-panel dark:bg-slate-850/80 rounded-2xl p-3 sm:p-4 text-center border border-white/70 dark:border-slate-750">
            <span className="text-[10px] font-label uppercase text-slate-400 block font-bold">Monthly Trips</span>
            <AnimatedCounter value={42} className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-cyan-400" />
          </div>
          <div className="glass-panel dark:bg-slate-850/80 rounded-2xl p-3 sm:p-4 text-center border border-white/70 dark:border-slate-750">
            <span className="text-[10px] font-label uppercase text-slate-400 block font-bold">Average ETA</span>
            <AnimatedCounter value={6.4} decimals={1} suffix="m" className="font-headline font-black text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400" />
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Current Status Card (Large: col-span-8) */}
          <div className="md:col-span-8 glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[300px] border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-container/15 dark:bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div>
              <div className="inline-flex items-center space-x-2 bg-[#00ffff]/20 text-[#001849] dark:text-[#00ffff] border border-cyan-400/40 px-3 py-1 rounded-full font-label text-[11px] sm:text-xs font-bold mb-4 sm:mb-6 neon-cyan-glow">
                <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse"></span>
                <span>LIVE TRACKING • SUB-SECOND GPS</span>
              </div>

              <h3 className="font-headline font-extrabold text-xl sm:text-2xl md:text-3xl text-on-surface dark:text-slate-100 mb-0.5 sm:mb-1">
                Your Bus: BUS 101
              </h3>
              <p className="text-on-surface-variant dark:text-slate-400 text-xs sm:text-sm font-medium flex items-center">
                <span className="material-symbols-outlined text-sm sm:text-base mr-1.5 text-primary dark:text-cyan-400">route</span>
                Route 42 - Downtown Express
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="bg-surface/70 dark:bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-outline-variant/30 dark:border-slate-700 backdrop-blur-sm">
                <p className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Next Approaching Stop</p>
                <p className="font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">College Gate</p>
                <p className="text-[11px] sm:text-xs text-outline dark:text-slate-400 mt-0.5">Platform 2 Interchange</p>
              </div>

              <div className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-3.5 sm:p-4 text-white shadow-lg shadow-primary/25 flex justify-between items-center">
                <div>
                  <p className="text-white/80 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5">Estimated Arrival</p>
                  <p className="font-headline font-black text-2xl sm:text-3xl">6 min</p>
                </div>
                <button 
                  onClick={() => setCurrentPage('tracking')}
                  className="p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white backdrop-blur-md transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="View on Map"
                >
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications & Alerts (Side: col-span-4) */}
          <div className="md:col-span-4 glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
            <div>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100 flex items-center gap-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-cyan-400" />
                  <span>Transit Alerts</span>
                </h3>
                <span className="text-[10px] font-label font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>

              <div className="space-y-2.5 sm:space-y-3.5">
                {/* Alert 1 */}
                <div className="flex space-x-3 p-3 sm:p-3.5 rounded-2xl bg-secondary-container/40 dark:bg-slate-800/80 hover:bg-secondary-container/60 dark:hover:bg-slate-800 transition-colors border border-secondary-container dark:border-slate-700">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-secondary-container dark:bg-slate-700 text-on-secondary-container flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-100">Schedule Update</p>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
                      Bus 101 is running on time. Arriving in 6 mins at College Gate.
                    </p>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="flex space-x-3 p-3 sm:p-3.5 rounded-2xl bg-surface-container-low dark:bg-slate-800/80 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors border border-outline-variant/30 dark:border-slate-700">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-100">Monthly Pass Active</p>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
                      Unlimited Metro Pass valid for 24 more days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentPage('features')}
              className="w-full mt-4 sm:mt-6 py-2.5 border border-outline-variant dark:border-slate-700 text-on-surface-variant dark:text-slate-300 rounded-full text-xs font-bold hover:border-primary hover:text-primary dark:hover:text-cyan-400 transition-colors text-center active:scale-95 min-h-[44px]"
            >
              View Timetable Alerts
            </button>
          </div>

          {/* Daily Schedule / Upcoming Departures (col-span-6) */}
          <div className="md:col-span-6 glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-7 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Upcoming Departures
              </h3>
              <span className="text-[11px] sm:text-xs text-primary dark:text-cyan-400 font-bold">Main Metro Station</span>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {departures.map((d, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDeparture(d)}
                  className="flex justify-between items-center p-3.5 sm:p-4 bg-surface/70 dark:bg-slate-800/80 rounded-2xl border border-outline-variant/25 dark:border-slate-700 hover:border-primary/50 dark:hover:border-cyan-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-headline font-bold text-xs sm:text-sm shadow-xs shrink-0">
                      {d.time}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors truncate">
                        {d.destination}
                      </p>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 truncate">
                        {d.platform} • {d.bus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                    <span className="text-[10px] sm:text-xs font-label font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-1 rounded-full">
                      {d.eta}
                    </span>
                    <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:text-primary dark:group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trips (col-span-6) */}
          <div className="md:col-span-6 glass-card dark:bg-slate-850/90 rounded-3xl p-5 sm:p-7 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100">
                Recent Trips
              </h3>
              <span className="text-[10px] sm:text-xs font-label text-outline dark:text-slate-400 uppercase font-semibold">Digital Pass</span>
            </div>

            <div className="relative pl-5 sm:pl-6 space-y-5 sm:space-y-6 before:content-[''] before:absolute before:left-[9px] sm:before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high dark:before:bg-slate-700">
              {recentTrips.map((trip, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] sm:-left-[30px] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xs">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100">{trip.date}</p>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate">{trip.route} • {trip.busId}</p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-1 rounded-lg shrink-0">
                      {trip.fare}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
