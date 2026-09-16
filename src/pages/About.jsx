import React from 'react';
import { 
  History, 
  Rocket, 
  ArrowRight, 
  ArrowDown,
  XCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Sparkles,
  Zap,
  Radio,
  Bot,
  Bus,
  Network,
  Compass
} from 'lucide-react';

export default function About({ setCurrentPage }) {
  return (
    <div className="about-theme relative w-full overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Mesh Accents — Scoped to About Page */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-teal-400/15 via-sky-400/10 to-transparent dark:from-teal-500/10 dark:via-cyan-500/8 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-about-float" />
      <div className="absolute top-1/3 -left-48 w-[450px] h-[450px] bg-gradient-to-tr from-sky-400/10 via-teal-400/8 to-transparent dark:from-sky-500/8 dark:via-teal-400/5 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="flex-grow w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop pt-20 sm:pt-28 pb-24 md:pb-24 min-h-screen animate-fade-up">
        {/* Hero Section */}
        <section className="py-8 sm:py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Copy */}
            <div className="space-y-4 sm:space-y-6">
              {/* Fresh Teal Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300 border border-teal-500/25 dark:border-teal-400/30 text-[11px] sm:text-xs font-label font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 pulse-teal"></span>
                <span>Our Story & Purpose</span>
              </div>

              <h1 className="font-headline font-extrabold text-3xl sm:text-5xl lg:text-[56px] text-on-surface dark:text-slate-100 leading-[1.15] sm:leading-[1.1] tracking-tight">
                Technology Behind <br />
                <span className="about-text-gradient">Better Journeys.</span>
              </h1>

              <p className="font-body text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                SmartBus is a centralized management system designed to bring urban transit into the modern era. We replace fragmented, manual processes with a unified digital command center, ensuring operators have real-time visibility and commuters experience seamless, reliable travel.
              </p>

              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300">
                <div className="flex items-center space-x-2 bg-teal-500/8 dark:bg-teal-400/10 px-3 py-1.5 rounded-xl border border-teal-500/15 dark:border-teal-400/20">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Zero Latency Telemetry</span>
                </div>
                <div className="flex items-center space-x-2 bg-teal-500/8 dark:bg-teal-400/10 px-3 py-1.5 rounded-xl border border-teal-500/15 dark:border-teal-400/20">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Autonomous Route Balancing</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card — Kinetic Command Card */}
            <div className="relative h-[320px] sm:h-[380px] lg:h-[480px] w-full rounded-3xl overflow-hidden about-glass-card p-5 sm:p-6 shadow-2xl shadow-teal-500/10 dark:shadow-black/50 border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between card-hover transition-all duration-300 group">
              {/* Subtle ambient lighting inside card */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-teal-400/20 via-sky-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-600 to-sky-600 dark:from-teal-500 dark:to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-600/30 about-icon-container">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-label uppercase text-slate-500 dark:text-teal-300/80 font-bold tracking-wider">Kinetic Architecture</p>
                    <p className="text-xs sm:text-sm font-bold text-on-surface dark:text-slate-100">Metro Command Grid</p>
                  </div>
                </div>
                <span className="bg-teal-500/15 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 dark:border-teal-400/40 font-label text-[10px] sm:text-xs px-3 py-1 rounded-full font-bold shadow-xs">
                  SYNCHRONIZED
                </span>
              </div>

              {/* Graphic Illustration */}
              <div className="my-auto py-4 sm:py-6 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-500/20 via-sky-500/15 to-teal-500/5 dark:from-teal-400/25 dark:to-cyan-500/15 flex items-center justify-center border-2 border-teal-500/30 dark:border-teal-400/40 shadow-xl relative pulse-teal animate-about-float">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 dark:text-teal-300 animate-pulse" />
                </div>
                <h4 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100 mt-4 sm:mt-5">
                  Continuous Network Intelligence
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                  Analyzing over 50,000 transit data points per minute to eliminate bottlenecks.
                </p>
              </div>

              {/* Status footer pill */}
              <div className="bg-teal-50/70 dark:bg-slate-900/70 border border-teal-500/20 dark:border-teal-400/25 p-3 sm:p-3.5 rounded-2xl flex justify-between items-center text-[11px] sm:text-xs relative z-10 backdrop-blur-xs">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Reliability Index:
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 px-2.5 py-0.5 rounded-md border border-teal-500/20 dark:border-teal-400/30">
                  99.98% On-Time Target
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* The Evolution of Transit (Bento Comparison) */}
        <section className="py-12 sm:py-20 border-t border-teal-500/15 dark:border-teal-400/15 transition-colors duration-300">
          <div className="text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <span className="font-label text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25 inline-block">
              Paradigm Shift
            </span>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              The Evolution of Transit
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Moving from fragmented legacy systems to a kinetic, intelligent network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
            {/* Traditional Transport Card */}
            <div className="md:col-span-5 about-glass-card dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] card-hover">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-slate-400 dark:text-slate-500">
                  <History className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface dark:text-slate-100 mb-3 sm:mb-4">
                  Traditional Transport
                </h3>
                <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>Manual paper logbooks & disconnected records</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>Unpredictable delays with zero passenger warning</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>Reactive breakdown maintenance after failures</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <span>Disconnected, blind fleet operations</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Arrow Connector (Desktop & Mobile Responsive) */}
            <div className="flex md:col-span-2 items-center justify-center py-2 md:py-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-teal-500/15 dark:from-teal-400/20 dark:to-cyan-400/20 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-500/30 dark:border-teal-400/40 shadow-lg shadow-teal-500/10 animate-about-float">
                <span className="hidden md:inline"><ArrowRight className="w-6 h-6" /></span>
                <span className="md:hidden"><ArrowDown className="w-5 h-5" /></span>
              </div>
            </div>

            {/* SmartBus Flow Card — Oceanic Vibrant Gradient */}
            <div className="md:col-span-5 bg-gradient-to-br from-teal-700 via-teal-600 to-sky-700 dark:from-teal-800 dark:via-teal-900 dark:to-sky-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-teal-700/25 dark:shadow-black/60 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[340px] card-hover border border-teal-400/30">
              <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 backdrop-blur-md border border-white/20 about-icon-container">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-200" />
                </div>
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mb-3 sm:mb-4">
                  SmartBus Flow
                </h3>
                <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm text-teal-50 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <span>100% unified digital cloud infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <span>Live sub-second telemetry tracking for passengers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <span>AI-driven predictive maintenance & early warning</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <span>Kinetic route balancing avoiding congestion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 sm:py-16">
          <div className="about-glass-card dark:bg-slate-900/85 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center border border-teal-500/20 dark:border-teal-400/25 shadow-xl shadow-teal-500/5 dark:shadow-black/50 card-hover transition-all duration-300">
            <div className="space-y-4 sm:space-y-6">
              <span className="font-label text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25 inline-block">
                Our Core Purpose
              </span>
              <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
                Our Mission
              </h2>
              <p className="font-headline font-bold text-lg sm:text-xl md:text-2xl text-teal-700 dark:text-teal-300 leading-snug">
                Make transportation safer, smarter and easier to manage.
              </p>
              <p className="font-body text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                We believe that the pulse of a city is dictated by its transit network. By embedding kinetic intelligence into every vehicle, route, and schedule, we are building a future where delays are predicted before they happen and safety is managed proactively.
              </p>
            </div>

            <div className="bg-teal-50/50 dark:bg-slate-800/80 p-5 sm:p-8 rounded-3xl border border-teal-500/20 dark:border-teal-400/25 space-y-4 backdrop-blur-xs">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/30 about-icon-container">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100">Passenger-First Safety</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated driver duty cycles and safety telemetry ensure peak reliability.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/30 about-icon-container">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100">Sustainable Urban Flow</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Optimized routing cuts fuel burn and idle congestion by up to 22%.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1 — HOW SMARTBUS WORKS */}
        <section className="py-12 sm:py-20 border-t border-teal-500/15 dark:border-teal-400/15 transition-colors duration-300">
          <div className="text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <span className="font-label text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25 inline-block">
              System Workflow
            </span>
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              How SmartBus Works
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From transit data to smarter journeys — everything works together as one connected flow.
            </p>
          </div>

          {/* 4-Step Container: Clean 4-step horizontal flow on desktop, stacked vertical flow on mobile */}
          <div className="relative">
            {/* Desktop Horizontal Route Dash Connecting Line */}
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-teal-500/30 dark:border-teal-400/30 -z-0 pointer-events-none motion-safe:animate-route-dash motion-reduce:animate-none" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10">
              {/* STEP 01: COLLECT */}
              <div className="relative flex flex-col">
                <div className="about-glass-card dark:bg-slate-900/85 p-5 sm:p-6 rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between h-full card-hover transition-all duration-300 motion-reduce:transform-none shadow-lg shadow-teal-500/5 dark:shadow-black/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label text-[11px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/15 px-2.5 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">
                        STEP 01
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-teal-500/5 dark:from-teal-400/20 dark:to-cyan-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-500/25 dark:border-teal-400/30 shadow-sm shadow-teal-500/10 about-icon-container">
                        <Radio className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100 flex items-center gap-2">
                      <span className="text-base select-none" aria-hidden="true">📡</span>
                      <span>COLLECT</span>
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                      Capture bus, route, stop and journey information through the SmartBus platform.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-teal-500/10 dark:border-teal-400/15 flex items-center justify-between text-[11px] font-label font-semibold text-teal-600/80 dark:text-teal-400/80">
                    <span>Telemetry Ingestion</span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 pulse-teal" />
                  </div>
                </div>

                {/* Mobile / Tablet Connector Arrow (stacked vertical flow) */}
                <div className="flex lg:hidden items-center justify-center py-2 text-teal-600 dark:text-teal-400">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 dark:bg-teal-400/15 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center shadow-xs animate-bounce motion-reduce:animate-none">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* STEP 02: ANALYZE */}
              <div className="relative flex flex-col">
                <div className="about-glass-card dark:bg-slate-900/85 p-5 sm:p-6 rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between h-full card-hover transition-all duration-300 motion-reduce:transform-none shadow-lg shadow-teal-500/5 dark:shadow-black/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label text-[11px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/15 px-2.5 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">
                        STEP 02
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-teal-500/5 dark:from-teal-400/20 dark:to-cyan-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-500/25 dark:border-teal-400/30 shadow-sm shadow-teal-500/10 about-icon-container">
                        <Bot className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100 flex items-center gap-2">
                      <span className="text-base select-none" aria-hidden="true">🤖</span>
                      <span>ANALYZE</span>
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                      Turn transit information into useful insights for better planning and decision-making.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-teal-500/10 dark:border-teal-400/15 flex items-center justify-between text-[11px] font-label font-semibold text-teal-600/80 dark:text-teal-400/80">
                    <span>Pattern Recognition</span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 pulse-teal" />
                  </div>
                </div>

                {/* Mobile / Tablet Connector Arrow (stacked vertical flow) */}
                <div className="flex lg:hidden items-center justify-center py-2 text-teal-600 dark:text-teal-400">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 dark:bg-teal-400/15 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center shadow-xs animate-bounce motion-reduce:animate-none">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* STEP 03: ACT */}
              <div className="relative flex flex-col">
                <div className="about-glass-card dark:bg-slate-900/85 p-5 sm:p-6 rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between h-full card-hover transition-all duration-300 motion-reduce:transform-none shadow-lg shadow-teal-500/5 dark:shadow-black/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label text-[11px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/15 px-2.5 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">
                        STEP 03
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-teal-500/5 dark:from-teal-400/20 dark:to-cyan-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-500/25 dark:border-teal-400/30 shadow-sm shadow-teal-500/10 about-icon-container">
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100 flex items-center gap-2">
                      <span className="text-base select-none" aria-hidden="true">⚡</span>
                      <span>ACT</span>
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                      Use alerts, route information and operational insights to respond to changing transit conditions.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-teal-500/10 dark:border-teal-400/15 flex items-center justify-between text-[11px] font-label font-semibold text-teal-600/80 dark:text-teal-400/80">
                    <span>Dynamic Dispatch</span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 pulse-teal" />
                  </div>
                </div>

                {/* Mobile / Tablet Connector Arrow (stacked vertical flow) */}
                <div className="flex lg:hidden items-center justify-center py-2 text-teal-600 dark:text-teal-400">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 dark:bg-teal-400/15 border border-teal-500/30 dark:border-teal-400/30 flex items-center justify-center shadow-xs animate-bounce motion-reduce:animate-none">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* STEP 04: IMPROVE */}
              <div className="relative flex flex-col">
                <div className="about-glass-card dark:bg-slate-900/85 p-5 sm:p-6 rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between h-full card-hover transition-all duration-300 motion-reduce:transform-none shadow-lg shadow-teal-500/5 dark:shadow-black/40 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label text-[11px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/15 px-2.5 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">
                        STEP 04
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-teal-500/5 dark:from-teal-400/20 dark:to-cyan-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-500/25 dark:border-teal-400/30 shadow-sm shadow-teal-500/10 about-icon-container">
                        <Bus className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface dark:text-slate-100 flex items-center gap-2">
                      <span className="text-base select-none" aria-hidden="true">🚌</span>
                      <span>IMPROVE</span>
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                      Create a smoother, more informed and passenger-focused transit experience.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-teal-500/10 dark:border-teal-400/15 flex items-center justify-between text-[11px] font-label font-semibold text-teal-600/80 dark:text-teal-400/80">
                    <span>Continuous Feedback</span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 pulse-teal" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Flow Indicator */}
          <div className="mt-10 sm:mt-12 flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs font-label uppercase font-bold text-slate-500 dark:text-slate-400">
            <span className="text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">COLLECT</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-500/60 shrink-0" />
            <span className="text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">ANALYZE</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-500/60 shrink-0" />
            <span className="text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">ACT</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-500/60 shrink-0" />
            <span className="text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25">IMPROVE</span>
          </div>
        </section>

        {/* SECTION 2 — BUILT FOR THE FUTURE */}
        <section className="py-12 sm:py-20 border-t border-teal-500/15 dark:border-teal-400/15 transition-colors duration-300">
          <div className="about-glass-card dark:bg-slate-900/85 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-14 border border-teal-500/20 dark:border-teal-400/25 shadow-xl shadow-teal-500/5 dark:shadow-black/50 card-hover transition-all duration-300 relative overflow-hidden">
            {/* Subtle ambient lighting inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-400/20 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 sm:space-y-6">
              <span className="font-label text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 dark:bg-teal-400/15 px-3 py-1 rounded-full border border-teal-500/20 dark:border-teal-400/25 inline-block">
                Next-Gen Transit
              </span>
              
              <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
                Built for the Future of Urban Mobility
              </h2>
              
              <p className="font-body text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                SmartBus is designed to evolve with connected fleets, intelligent routing, transit data and smarter passenger services — creating a foundation for the next generation of urban mobility.
              </p>

              {/* Three small supporting feature points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
                {/* 01 — CONNECTED FLEETS */}
                <div className="bg-teal-50/60 dark:bg-slate-800/70 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between card-hover transition-all duration-300 motion-reduce:transform-none">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-xs font-bold text-teal-600 dark:text-teal-400">
                        01
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 dark:border-teal-400/25 about-icon-container">
                        <Network className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface dark:text-slate-100 tracking-wide uppercase">
                      CONNECTED FLEETS
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                      Bring fleet information into one unified platform.
                    </p>
                  </div>
                </div>

                {/* 02 — INTELLIGENT ROUTING */}
                <div className="bg-teal-50/60 dark:bg-slate-800/70 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between card-hover transition-all duration-300 motion-reduce:transform-none">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-xs font-bold text-teal-600 dark:text-teal-400">
                        02
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 dark:border-teal-400/25 about-icon-container">
                        <Compass className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface dark:text-slate-100 tracking-wide uppercase">
                      INTELLIGENT ROUTING
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                      Support smarter route planning and operational decisions.
                    </p>
                  </div>
                </div>

                {/* 03 — SMARTER PASSENGER SERVICES */}
                <div className="bg-teal-50/60 dark:bg-slate-800/70 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-teal-500/20 dark:border-teal-400/25 flex flex-col justify-between card-hover transition-all duration-300 motion-reduce:transform-none">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-xs font-bold text-teal-600 dark:text-teal-400">
                        03
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 dark:border-teal-400/25 about-icon-container">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-sm sm:text-base text-on-surface dark:text-slate-100 tracking-wide uppercase">
                      SMARTER PASSENGER SERVICES
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                      Make transit information easier to access and understand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary CTA button */}
              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-teal-500/15 dark:border-teal-400/15">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                  Explore how SmartBus transforms urban commuting with connected transit intelligence.
                </p>
                <button
                  onClick={() => setCurrentPage('features')}
                  className="about-btn-primary btn-ripple inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base w-full sm:w-auto shrink-0 shadow-lg hover:shadow-xl transition-all motion-reduce:transform-none"
                  aria-label="Explore the Platform"
                >
                  <span>Explore the Platform</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Footer CTA */}
        <section className="py-8 sm:py-12 text-center">
          <button 
            onClick={() => setCurrentPage('features')}
            className="about-btn-primary inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base w-full sm:w-auto"
          >
            <span>Explore Platform Features</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </section>
      </main>
    </div>
  );
}
