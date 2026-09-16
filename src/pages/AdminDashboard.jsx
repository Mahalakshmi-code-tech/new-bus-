import React, { useState } from 'react';
import { 
  Bus, 
  Route as RouteIcon, 
  AlertTriangle, 
  Users, 
  Wrench, 
  Plus, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2,
  Clock,
  Radio,
  Sliders,
  ShieldCheck,
  X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TrafficChart from '../components/TrafficChart';
import AnimatedCounter from '../components/AnimatedCounter';
import FleetAnalytics from '../components/FleetAnalytics';

export default function AdminDashboard({ setCurrentPage, currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRouteModal, setShowNewRouteModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteBuses, setNewRouteBuses] = useState('4');

  const [systemEvents, setSystemEvents] = useState([
    {
      id: 1,
      title: 'Delay Alert: Route B2 (Airport Express)',
      desc: 'Traffic accident reported on Main St. causing ~15m delay across 2 active buses.',
      time: '10 mins ago',
      type: 'error',
      icon: AlertTriangle,
      action: 'Deploy Detour'
    },
    {
      id: 2,
      title: 'Maintenance Completed: Bus #402',
      desc: 'Routine engine & brake telemetry check completed. Unit returned to active fleet roster.',
      time: '45 mins ago',
      type: 'secondary',
      icon: Wrench,
      action: 'Assign to Route'
    },
    {
      id: 3,
      title: 'New Route Deployed: Express Route E1',
      desc: 'Express Route E1 is now active with 4 electric low-floor buses assigned.',
      time: '2 hours ago',
      type: 'primary',
      icon: RouteIcon,
      action: 'View Roster'
    }
  ]);

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRouteName) return;

    const newEvent = {
      id: Date.now(),
      title: `Route Deployed: ${newRouteName}`,
      desc: `New route operational with ${newRouteBuses} buses assigned to network loop.`,
      time: 'Just now',
      type: 'primary',
      icon: RouteIcon,
      action: 'View Roster'
    };

    setSystemEvents(prev => [newEvent, ...prev]);
    setShowNewRouteModal(false);
    setNewRouteName('');
  };

  return (
    <div className="font-body text-on-surface dark:text-slate-100 bg-background dark:bg-[#0b1120] flex min-h-screen transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar 
        currentPage="admin-dashboard" 
        setCurrentPage={setCurrentPage} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-margin-desktop min-h-screen pt-20 md:pt-10 pb-24 md:pb-10 animate-fade-up">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 text-[11px] sm:text-xs font-label font-bold mb-2 uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Metropolis Command Hub
            </div>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              Fleet Overview & Telemetry
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 font-body text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
              Real-time telemetry, fleet status, and kinetic performance indicators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-outline dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fleet, routes, drivers..."
                className="pl-10 pr-4 py-2.5 bg-surface-container-low dark:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-full focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 transition-all text-xs sm:text-sm w-full outline-none shadow-xs text-on-surface dark:text-slate-100 placeholder:text-outline dark:placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => setShowNewRouteModal(true)}
              className="btn-primary px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:shadow-cyan-400/40 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Route</span>
            </button>
          </div>
        </header>

        {/* 5 KPI Summary Cards Grid (with animated number counters) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 mb-6 sm:mb-8">
          {/* Total Buses */}
          <div className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden group border border-white/70 dark:border-slate-750/70 card-hover transition-colors duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
              <div className="p-2 sm:p-3 bg-surface-container dark:bg-slate-800 text-primary dark:text-cyan-400 rounded-xl sm:rounded-2xl shadow-xs">
                <Bus className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-0.5 rounded-full">
                +2 added
              </span>
            </div>
            <h3 className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Total Buses</h3>
            <AnimatedCounter value={142} duration={1400} className="font-headline font-black text-2xl sm:text-3xl text-on-surface dark:text-slate-100" />
          </div>

          {/* Active Buses */}
          <div className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden group border border-white/70 dark:border-slate-750/70 card-hover transition-colors duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
              <div className="p-2 sm:p-3 bg-primary/10 dark:bg-slate-800 text-primary dark:text-cyan-400 rounded-xl sm:rounded-2xl shadow-xs">
                <Bus className="w-4 h-4 sm:w-6 sm:h-6 text-primary dark:text-cyan-400" />
              </div>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Live
              </span>
            </div>
            <h3 className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Active Buses</h3>
            <AnimatedCounter value={118} duration={1400} className="font-headline font-black text-2xl sm:text-3xl text-primary dark:text-cyan-400" />
          </div>

          {/* Delayed Buses */}
          <div className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden group border border-white/70 dark:border-slate-750/70 card-hover transition-colors duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
              <div className="p-2 sm:p-3 bg-error-container dark:bg-red-950/60 text-error dark:text-red-300 rounded-xl sm:rounded-2xl shadow-xs">
                <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-error dark:text-red-300 bg-error-container/50 dark:bg-red-950/80 px-2 sm:px-2.5 py-0.5 rounded-full">
                3% rate
              </span>
            </div>
            <h3 className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Delayed Buses</h3>
            <AnimatedCounter value={4} duration={1400} className="font-headline font-black text-2xl sm:text-3xl text-error dark:text-red-400" />
          </div>

          {/* Active Routes */}
          <div className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden group border border-white/70 dark:border-slate-750/70 card-hover transition-colors duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
              <div className="p-2 sm:p-3 bg-tertiary-fixed dark:bg-slate-800 text-on-tertiary-fixed-variant dark:text-cyan-400 rounded-xl sm:rounded-2xl shadow-xs">
                <RouteIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-tertiary dark:text-cyan-400 bg-tertiary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-0.5 rounded-full">
                Grid Synced
              </span>
            </div>
            <h3 className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Active Routes</h3>
            <AnimatedCounter value={85} duration={1400} className="font-headline font-black text-2xl sm:text-3xl text-on-surface dark:text-slate-100" />
          </div>

          {/* Passengers Today */}
          <div className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden group border border-white/70 dark:border-slate-750/70 col-span-2 sm:col-span-1 card-hover transition-colors duration-300">
            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
              <div className="p-2 sm:p-3 bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-cyan-400 rounded-xl sm:rounded-2xl shadow-xs">
                <Users className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-secondary dark:text-cyan-400 bg-secondary/10 dark:bg-primary/25 px-2 sm:px-2.5 py-0.5 rounded-full">
                +12% yday
              </span>
            </div>
            <h3 className="text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs font-label uppercase tracking-wider mb-0.5 sm:mb-1">Passengers Today</h3>
            <p className="font-headline font-black text-2xl sm:text-3xl text-on-surface dark:text-slate-100">24.5k</p>
          </div>
        </section>

        {/* Charts & System Performance Section (Bento Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
          {/* Main Chart: Passenger Traffic Volume (col-span-2) */}
          <div className="lg:col-span-2">
            <TrafficChart />
          </div>

          {/* Route Performance & System Utilization (col-span-1) */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Route Performance */}
            <div className="glass-panel dark:bg-slate-850/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100 mb-3 sm:mb-4">
                Route Performance
              </h3>
              <div className="space-y-3.5 sm:space-y-4 font-body">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-on-surface dark:text-slate-200">Route A1 (Downtown)</span>
                    <span className="text-primary dark:text-cyan-400 font-bold">98% On-Time</span>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary dark:bg-cyan-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-on-surface dark:text-slate-200">Route C4 (Suburbs)</span>
                    <span className="text-tertiary dark:text-amber-400 font-bold">85% On-Time</span>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-tertiary dark:bg-amber-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-on-surface dark:text-slate-200">Route B2 (Airport)</span>
                    <span className="text-error dark:text-red-400 font-bold">72% On-Time</span>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-error dark:bg-red-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Hourly System Utilization */}
            <div className="glass-panel dark:bg-slate-850/85 rounded-3xl p-5 sm:p-6 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 card-hover transition-colors duration-300">
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100 mb-2">
                System Utilization
              </h3>
              <div className="flex items-end gap-2.5 sm:gap-3 h-24 sm:h-28 mt-4 pb-2 border-b border-surface-variant dark:border-slate-750">
                {[
                  { hour: '6AM', pct: 40 },
                  { hour: '9AM', pct: 65 },
                  { hour: '12PM', pct: 85 },
                  { hour: '3PM', pct: 50 },
                  { hour: '6PM', pct: 95 },
                  { hour: '9PM', pct: 30 }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 bg-primary/15 dark:bg-slate-800 h-full rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-primary dark:bg-cyan-400 rounded-t-lg transition-all duration-500 group-hover:bg-primary-container"
                      style={{ height: `${bar.pct}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant dark:text-slate-400 mt-2 font-label uppercase font-bold">
                <span>6AM</span>
                <span>12PM</span>
                <span>6PM</span>
                <span>9PM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Delay Trend & Occupancy Indicator Section */}
        <section className="mb-6 sm:mb-8">
          <FleetAnalytics />
        </section>

        {/* Recent Activity Feed */}
        <section className="glass-panel dark:bg-slate-850/85 rounded-3xl p-5 sm:p-8 border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 mb-8 sm:mb-12 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100">Recent System Events</h3>
              <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400">Live audit log across drivers, routes, and telemetry sensors</p>
            </div>
            <span className="text-[10px] sm:text-xs font-label text-primary dark:text-cyan-400 font-bold uppercase bg-primary/10 dark:bg-primary/25 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            {systemEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-surface/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 rounded-2xl border border-outline-variant/30 dark:border-slate-700 transition-all gap-2.5 sm:gap-3 card-hover"
                >
                  <div className="flex items-start space-x-3 sm:space-x-3.5 min-w-0 pr-2">
                    <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                      evt.type === 'error' 
                        ? 'bg-error-container dark:bg-red-950/60 text-error dark:text-red-300' 
                        : evt.type === 'secondary'
                          ? 'bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-cyan-400'
                          : 'bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">{evt.title}</h4>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{evt.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20 dark:border-slate-700">
                    <span className="text-[10px] sm:text-xs font-label text-outline dark:text-slate-400">{evt.time}</span>
                    <button 
                      onClick={() => setCurrentPage('ai-insights')}
                      className="text-xs font-bold text-primary dark:text-cyan-400 hover:text-primary-container dark:hover:text-cyan-300 bg-primary/5 dark:bg-primary/20 hover:bg-primary/10 dark:hover:bg-primary/30 px-3 py-1.5 rounded-xl transition-all active:scale-95 min-h-[36px] flex items-center"
                    >
                      {evt.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Deploy New Route Modal */}
      {showNewRouteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant/30 dark:border-slate-700 space-y-5 sm:space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30 dark:border-slate-750">
              <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100">Deploy New Route</h3>
              <button 
                onClick={() => setShowNewRouteModal(false)}
                className="text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 p-1 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300">Route Name</label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="e.g. Route D5 - Metro Express"
                  className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-300">Buses to Assign</label>
                <select
                  value={newRouteBuses}
                  onChange={(e) => setNewRouteBuses(e.target.value)}
                  className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 outline-none"
                >
                  <option value="2">2 Electric Buses</option>
                  <option value="4">4 Electric Buses (Recommended)</option>
                  <option value="6">6 High-Capacity Articulated Buses</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewRouteModal(false)}
                  className="px-4 sm:px-5 py-2.5 rounded-full border border-outline-variant dark:border-slate-700 text-xs sm:text-sm font-semibold text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-750 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-primary/20 min-h-[44px]"
                >
                  Deploy Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
