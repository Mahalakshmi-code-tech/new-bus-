import React from 'react';
import { Bus, MapPin, Mail, Phone, ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  const handleLinkClick = (pageId) => {
    if (setCurrentPage) {
      setCurrentPage(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full pt-16 pb-24 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-highest dark:bg-[#080d1a] border-t border-outline-variant/50 dark:border-slate-800 mt-auto transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-extrabold text-2xl text-on-surface dark:text-slate-100 tracking-tight">
              SmartBus
            </span>
          </div>
          <p className="font-body text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed max-w-xs">
            Kinetic Intelligence for modern urban transit. Connecting buses, routes, drivers, and passengers in one unified flow.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high dark:bg-slate-800 text-xs font-label text-primary dark:text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Metropolis Network Active
            </span>
          </div>
        </div>

        {/* Platform Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-label text-xs uppercase tracking-widest text-on-surface dark:text-slate-200 font-bold mb-2">
            Platform
          </h4>
          <button 
            onClick={() => handleLinkClick('home')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Home
          </button>
          <button 
            onClick={() => handleLinkClick('about')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            About
          </button>
          <button 
            onClick={() => handleLinkClick('features')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Features
          </button>
          <button 
            onClick={() => handleLinkClick('tracking')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Track Bus
          </button>
          <button 
            onClick={() => handleLinkClick('routes')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Routes
          </button>
          <button 
            onClick={() => handleLinkClick('analytics')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Analytics
          </button>
          <button 
            onClick={() => handleLinkClick('pass')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Digital Bus Pass
          </button>
        </div>

        {/* Portals Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-label text-xs uppercase tracking-widest text-on-surface dark:text-slate-200 font-bold mb-2">
            Command Center
          </h4>
          <button 
            onClick={() => handleLinkClick('user-dashboard')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Passenger Dashboard
          </button>
          <button 
            onClick={() => handleLinkClick('admin-dashboard')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Fleet Command Center
          </button>
          <button 
            onClick={() => handleLinkClick('ai-insights')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            AI Predictive Insights
          </button>
          <button 
            onClick={() => handleLinkClick('contact')} 
            className="text-left text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none"
          >
            24/7 Dispatch & Support
          </button>
        </div>

        {/* Contact info column */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-label text-xs uppercase tracking-widest text-on-surface dark:text-slate-200 font-bold mb-2">
            Metropolis Hub
          </h4>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
            <span>100 Transit Plaza, Tech District, Metropolis</span>
          </p>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary dark:text-cyan-400 shrink-0" />
            <span>+1 (800) 555-RIDE</span>
          </p>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-primary dark:text-cyan-400 shrink-0" />
            <span>support@smartbus.transit</span>
          </p>
          <div className="pt-2">
            <button 
              onClick={() => handleLinkClick('login')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary dark:text-cyan-400 hover:text-primary-container group focus:outline-none"
            >
              <span>Operator Login</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="col-span-1 md:col-span-4 mt-8 pt-8 border-t border-outline-variant/30 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-body text-xs text-on-surface-variant dark:text-slate-400">
            © 2026 SmartBus Platform. Your Journey. Smarter. Safer. Simpler.
          </p>
          <div className="flex space-x-6 text-xs text-on-surface-variant dark:text-slate-400 font-label">
            <span className="hover:text-primary dark:hover:text-cyan-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-primary dark:hover:text-cyan-400 cursor-pointer">Transit Terms</span>
            <span className="hover:text-primary dark:hover:text-cyan-400 cursor-pointer">API Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
