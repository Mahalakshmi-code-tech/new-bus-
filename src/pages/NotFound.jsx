import React from 'react';
import { Compass, Home, Map, ArrowRight } from 'lucide-react';

export default function NotFound({ setCurrentPage }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 font-sans">
      <div className="max-w-md w-full glass-card dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-outline-variant/40 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-fade-up">
        {/* 404 Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-cyan-400 text-xs font-label font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 animate-spin duration-1000" style={{ animationDuration: '10s' }} />
          <span>Route 404 • Lost in Transit</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-headline font-black text-5xl sm:text-6xl text-primary dark:text-cyan-400 tracking-tight">
            404
          </h1>
          <h2 className="font-headline font-extrabold text-xl sm:text-2xl">
            Stop Not Found
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
            The requested destination or transit station doesn't exist on this network corridor. Let's redirect you back to active service lines.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="btn-primary py-3 px-6 rounded-full text-xs font-bold flex items-center justify-center space-x-2 group shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('routes')}
            className="btn-ghost py-3 px-6 rounded-full text-xs font-bold flex items-center justify-center space-x-2 border border-outline-variant/40 dark:border-slate-700"
          >
            <Map className="w-4 h-4" />
            <span>Browse Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
