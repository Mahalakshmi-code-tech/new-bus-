import React from 'react';
import { 
  Navigation, 
  Map as MapIcon, 
  Calendar, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Shield, 
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import LiveMap from '../components/LiveMap';

export default function Features({ setCurrentPage }) {
  const scheduleList = [
    { route: 'Route 42 - Downtown', time: '08:00 AM', driver: 'J. Smith', busId: 'Bus 101', status: 'On Time', badgeColor: 'bg-secondary-container text-on-secondary-container' },
    { route: 'Route 15 - Tech Park Express', time: '08:15 AM', driver: 'S. Jenkins', busId: 'Bus 108', status: 'On Time', badgeColor: 'bg-secondary-container text-on-secondary-container' },
    { route: 'Route 3 - Riverside Loop', time: '08:30 AM', driver: 'M. Vance', busId: 'Bus 204', status: 'Delayed +6m', badgeColor: 'bg-error-container text-error' },
    { route: 'Route 8 - College Campus', time: '08:45 AM', driver: 'R. Davis', busId: 'Bus 302', status: 'On Time', badgeColor: 'bg-secondary-container text-on-secondary-container' },
  ];

  return (
    <main className="pt-20 sm:pt-24 pb-24 md:pb-20 flex-grow animate-fade-up">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-margin-desktop text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/40 via-background to-background -z-10 opacity-70"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="font-label text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-primary font-bold bg-primary/10 px-3.5 sm:px-4 py-1.5 rounded-full inline-block mb-3 sm:mb-4">
            Unified Transit Infrastructure
          </span>
          <h1 className="font-headline font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface mb-4 sm:mb-6 tracking-tight">
            Everything You Need to Manage Transportation.
          </h1>
          <p className="font-body text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            A unified command center for modern urban transit. Experience kinetic intelligence that moves your city forward.
          </p>
        </div>
      </section>

      {/* Feature 1: Live Bus Tracking */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
              Feature 01
            </span>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-on-surface mt-2 mb-4">
              Live Bus Tracking
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed">
              Pinpoint fleet locations instantly. Monitor real-time speeds, anticipate precise ETAs, and ensure seamless transit flows across the entire network with sub-second GPS telemetry.
            </p>
            
            <ul className="space-y-3 mb-8 text-xs sm:text-sm text-on-surface font-medium">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Real-time GPS pulse updates every 800ms</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Live passenger capacity metrics (Load %)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Automated ETA recalculation based on traffic conditions</span>
              </li>
            </ul>

            <button 
              onClick={() => setCurrentPage('tracking')}
              className="btn-primary w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-lg shadow-primary/20 hover:shadow-cyan-400/40 flex items-center justify-center gap-2"
            >
              <span>TRACK A BUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="order-1 md:order-2">
            <LiveMap 
              selectedBus="Bus 101" 
              routeName="Central to Civic Center Hub" 
              height="h-[280px] sm:h-[360px] md:h-[420px]" 
            />
          </div>
        </div>
      </section>

      {/* Feature 2: Smart Route Management */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-margin-desktop bg-surface-container-low/60 dark:bg-slate-900/50 border-y border-outline-variant/30 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-xl shadow-primary/10 border border-white/70 dark:border-slate-750/80 bg-white dark:bg-slate-850 p-5 sm:p-6 card-hover">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30 dark:border-slate-750">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
                  <MapIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface dark:text-slate-100">Route Visualizer</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Kinetic Multi-Node Topology</p>
                </div>
              </div>
              <span className="text-xs font-label text-primary dark:text-cyan-400 font-bold bg-primary/10 dark:bg-primary/25 px-2.5 py-1 rounded-full">
                18.4 km Total
              </span>
            </div>

            {/* Interactive Stop nodes visualizer */}
            <div className="py-5 sm:py-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</div>
                  <span className="text-xs sm:text-sm font-semibold text-on-surface dark:text-slate-100">Central Station Hub</span>
                </div>
                <span className="text-[11px] sm:text-xs font-label text-outline dark:text-slate-400">0.0 km</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary-fixed/20 dark:bg-blue-950/40 border border-primary/30 dark:border-blue-800/60 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary dark:bg-cyan-400 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center pulse-node">2</div>
                  <span className="text-xs sm:text-sm font-bold text-primary dark:text-cyan-400">Civic Center Stop</span>
                </div>
                <span className="text-[11px] sm:text-xs font-label text-primary dark:text-cyan-400 font-bold">2.4 km • Live</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container-highest dark:bg-slate-700 text-on-surface dark:text-slate-200 text-xs font-bold flex items-center justify-center">3</div>
                  <span className="text-xs sm:text-sm font-semibold text-on-surface dark:text-slate-100">Market Street Interchange</span>
                </div>
                <span className="text-[11px] sm:text-xs font-label text-outline dark:text-slate-400">8.1 km</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container-highest dark:bg-slate-700 text-on-surface dark:text-slate-200 text-xs font-bold flex items-center justify-center">4</div>
                  <span className="text-xs sm:text-sm font-semibold text-on-surface dark:text-slate-100">College Campus Terminal</span>
                </div>
                <span className="text-[11px] sm:text-xs font-label text-outline dark:text-slate-400">18.4 km</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-slate-400 pt-2 border-t border-outline-variant/30 dark:border-slate-750">
              <span>Avg travel time: <strong className="text-on-surface dark:text-slate-200">42 mins</strong></span>
              <span className="text-primary dark:text-cyan-400 font-semibold">Active Fleet: 6 Buses</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <span className="font-label text-xs uppercase tracking-widest text-primary dark:text-cyan-400 font-bold">
              Feature 02
            </span>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 mt-2 mb-4">
              Smart Route Management
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
              Optimize urban arteries. Visualize comprehensive routes, calculate distances precisely, and manage every stop with intuitive controls and intelligent transfer badges.
            </p>
            
            <button 
              onClick={() => setCurrentPage('routes')}
              className="btn-ghost w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              <span>EXPLORE ROUTES</span>
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature 3 & 4 Grid: Scheduling & Drivers */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-margin-desktop bg-surface dark:bg-slate-900/30 transition-colors duration-300">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Smart Scheduling Card */}
          <div className="glass-panel dark:bg-slate-850/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/70 dark:border-slate-750/70 card-hover">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-container text-white rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-primary/20">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-label text-xs uppercase tracking-wider text-primary dark:text-cyan-400 font-bold">Feature 03</span>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface dark:text-slate-100 mt-1 mb-2 sm:mb-3">Smart Scheduling</h3>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
                Dynamic timetable management coordinating departures, arrivals, and driver assignments effortlessly.
              </p>

              {/* Dynamic Timetable Items */}
              <div className="space-y-2.5 sm:space-y-3">
                {scheduleList.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-xs hover:border-primary/40 dark:hover:border-cyan-400/40 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-slate-100 truncate pr-2">{item.route}</span>
                      <span className="text-xs font-bold text-primary dark:text-cyan-400 font-label shrink-0">{item.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400">
                      <span className="truncate pr-2">Driver: <strong className="text-on-surface dark:text-slate-200">{item.driver}</strong> • {item.busId}</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] shrink-0 ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-outline-variant/20 dark:border-slate-800">
              <button 
                onClick={() => setCurrentPage('admin-dashboard')}
                className="text-xs font-bold text-primary dark:text-cyan-400 hover:text-primary-container dark:hover:text-cyan-300 flex items-center gap-1.5 group min-h-[44px]"
              >
                <span>Manage Full Schedule in Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Driver Management Card */}
          <div className="glass-panel dark:bg-slate-850/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/70 dark:border-slate-750/70 card-hover">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-tertiary-container text-white rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-tertiary/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-label text-xs uppercase tracking-wider text-tertiary dark:text-cyan-400 font-bold">Feature 04</span>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface dark:text-slate-100 mt-1 mb-2 sm:mb-3">Driver Management</h3>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 mb-6 leading-relaxed">
                Comprehensive profiles tracking safety compliance, performance scorecards, shift hours, and licensing in one secure hub.
              </p>

              {/* Driver Profiles Showcase */}
              <div className="space-y-2.5 sm:space-y-3">
                {/* Driver 1 */}
                <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/25 flex items-center justify-center text-primary dark:text-cyan-400 font-bold text-base sm:text-lg border-2 border-primary/20 shrink-0">
                    SJ
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">Sarah Jenkins</p>
                      <span className="text-[9px] sm:text-[10px] font-label font-bold bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full shrink-0">
                        ACTIVE ON DUTY
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate">
                      ID: #8492 • Bus 101 • Score: <strong className="text-on-surface dark:text-slate-200">99.4% Safety</strong>
                    </p>
                  </div>
                </div>

                {/* Driver 2 */}
                <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container dark:bg-slate-700 flex items-center justify-center text-primary dark:text-cyan-400 font-bold text-base sm:text-lg border-2 border-primary/20 shrink-0">
                    JS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">James Smith</p>
                      <span className="text-[9px] sm:text-[10px] font-label font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full shrink-0">
                        ROUTE 42
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate">
                      ID: #7120 • 6 yrs exp • Shift Ends: 16:30
                    </p>
                  </div>
                </div>

                {/* Driver 3 */}
                <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center text-on-surface-variant dark:text-slate-300 font-bold text-base sm:text-lg border-2 border-outline-variant/40 shrink-0">
                    MV
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate">Marcus Vance</p>
                      <span className="text-[9px] sm:text-[10px] font-label font-bold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                        STANDBY
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate">
                      ID: #9034 • Next Shift: 14:00 • Depot Bay 2
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 border-t border-outline-variant/20">
              <button 
                onClick={() => setCurrentPage('admin-dashboard')}
                className="text-xs font-bold text-tertiary hover:text-tertiary-container flex items-center gap-1.5 group min-h-[44px]"
              >
                <span>View Driver Rosters & Shifts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
