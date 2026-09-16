import React from 'react';
import { ShieldAlert, LogIn, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized({ setCurrentPage, requiredRole = 'ADMIN', currentRole = 'USER' }) {
  const { logout } = useAuth();

  const handleSwitchAccount = () => {
    logout();
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 font-sans">
      <div className="max-w-md w-full glass-card dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-error/30 dark:border-red-900/40 shadow-2xl text-center space-y-6 animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-error/15 text-error dark:text-red-400 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-error/10 text-error dark:text-red-400 text-[11px] font-label font-bold uppercase tracking-wider">
            <span>HTTP 403 • Restricted Zone</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-slate-100 tracking-tight">
            Access Denied
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
            Your current account credentials (<span className="font-mono uppercase font-bold text-primary dark:text-cyan-400">{currentRole}</span>) do not hold clearance for the <span className="font-mono uppercase font-bold">{requiredRole}</span> dispatch control terminal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrentPage('user-dashboard')}
            className="btn-primary py-3 px-6 rounded-full text-xs font-bold flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Passenger Dashboard</span>
          </button>
          <button
            onClick={handleSwitchAccount}
            className="btn-ghost py-3 px-6 rounded-full text-xs font-bold flex items-center justify-center space-x-2 border border-outline-variant/40 dark:border-slate-700"
          >
            <LogIn className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
