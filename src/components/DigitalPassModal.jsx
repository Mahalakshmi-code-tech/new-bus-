import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User, 
  Download, 
  Zap,
  Wifi,
  Clock,
  Sparkles,
  Check,
  Smartphone
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';

// Comprehensive pass tiers configuration
const PASS_TIERS = {
  'Monthly All-Corridor': {
    id: 'monthly',
    label: 'Monthly All-Corridor',
    category: 'Monthly All-Corridor Metro Pass',
    passId: 'SB-METRO-2026-X889',
    validFrom: '2026-09-01',
    validUntil: '2026-09-30',
    daysRemaining: 17,
    status: 'ACTIVE',
    tripsCount: 42,
    fareSaved: '$34.50',
    gradient: 'from-[#031b4e] via-[#0044b3] to-[#0066ff] dark:from-[#06142e] dark:via-[#0c2452] dark:to-[#12387d]'
  },
  'Student Pass': {
    id: 'student',
    label: 'Student Pass',
    category: 'Student Subsidized Metro Pass',
    passId: 'SB-STUD-2026-S402',
    validFrom: '2026-09-01',
    validUntil: '2026-12-15',
    daysRemaining: 93,
    status: 'ACTIVE',
    tripsCount: 88,
    fareSaved: '$62.00',
    gradient: 'from-[#021f3f] via-[#005088] to-[#007cc7] dark:from-[#05172d] dark:via-[#09294a] dark:to-[#0e3f70]'
  },
  'Daily Unlimited': {
    id: 'daily',
    label: 'Daily Unlimited',
    category: '24-Hour Unlimited Metro Pass',
    passId: 'SB-DAY-2026-D115',
    validFrom: '2026-09-13 (00:00)',
    validUntil: '2026-09-13 (23:59)',
    daysRemaining: 1,
    status: 'EXPIRING SOON',
    tripsCount: 6,
    fareSaved: '$8.20',
    gradient: 'from-[#191d42] via-[#243666] to-[#3a528c] dark:from-[#11142b] dark:via-[#1a2645] dark:to-[#29385e]'
  }
};

export default function DigitalPassModal() {
  const { isPassModalOpen, setIsPassModalOpen, digitalPass, setDigitalPass } = useTransit();
  
  // Active tier states for smooth 380ms 3D flip
  const [selectedTierKey, setSelectedTierKey] = useState('Monthly All-Corridor');
  const [displayedTierKey, setDisplayedTierKey] = useState('Monthly All-Corridor');
  const [isFlipping, setIsFlipping] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!isPassModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPassModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPassModalOpen, setIsPassModalOpen]);

  if (!isPassModalOpen) return null;

  const currentTier = PASS_TIERS[displayedTierKey] || PASS_TIERS['Monthly All-Corridor'];

  // Handle tier switching with fast 380ms card flip
  const handleTierSelect = (tierKey) => {
    if (tierKey === selectedTierKey || isFlipping) return;
    setSelectedTierKey(tierKey);

    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedTierKey(tierKey);
      return;
    }

    setIsFlipping(true);
    // Swap data halfway through the flip (190ms) when card is edge-on
    setTimeout(() => {
      setDisplayedTierKey(tierKey);
    }, 190);

    // Complete flip at 380ms
    setTimeout(() => {
      setIsFlipping(false);
    }, 380);
  };

  // Simulate turnstile QR scan
  const handleValidate = () => {
    setIsValidated(true);
    setTimeout(() => setIsValidated(false), 3200);
  };

  // Handle Save / Print
  const handleSavePass = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.print();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsPassModalOpen(false)}
      role="presentation"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Digital Transit Pass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-outline-variant/30 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/80 dark:bg-slate-850/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface dark:text-slate-100 leading-tight">
                Digital Metro Pass
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant dark:text-slate-400">
                <Wifi className="w-3 h-3 text-cyan-500 animate-pulse" />
                <span>NFC & Contactless Gate Access</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPassModalOpen(false)}
            className="p-2 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-100 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close pass modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[82vh] hide-scrollbar">
          
          {/* Card Perspective Outer Wrapper for 3D Flip */}
          <div className="card-perspective w-full">
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentTier.gradient} p-6 text-white shadow-2xl border border-blue-400/40 dark:border-cyan-400/30 transition-transform ${isFlipping ? 'card-flip-animating' : ''}`}>
              
              {/* Luxury Ambient Glow Blobs */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-400/25 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-400/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
              <div className="absolute inset-0 holographic-shimmer opacity-40 pointer-events-none" />

              {/* Pass Top Branding & Status Header */}
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                    <span className="material-symbols-outlined text-xl text-cyan-200" style={{ fontVariationSettings: "'FILL' 1" }}>
                      directions_bus
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline font-black text-lg tracking-tight block leading-none">SmartBus</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/20 font-bold uppercase tracking-wider text-cyan-200">
                        Metro
                      </span>
                    </div>
                    <span className="text-[10px] font-label uppercase tracking-widest text-cyan-200/90 font-medium">
                      Transit Authority
                    </span>
                  </div>
                </div>

                {/* Status Badge with Subtle Live Heartbeat Pulse */}
                <div className="flex flex-col items-end">
                  {currentTier.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-emerald-950/70 border border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                      <span>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-amber-950/70 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>EXPIRING SOON</span>
                    </span>
                  )}
                  <span className="text-[10px] text-cyan-200/80 font-medium mt-1">
                    {currentTier.daysRemaining} {currentTier.daysRemaining === 1 ? 'day' : 'days'} remaining
                  </span>
                </div>
              </div>

              {/* QR Code Container with Ambient Glow and Scanner Reticle */}
              <div className="relative my-4 flex flex-col items-center">
                <div className="relative bg-white p-3.5 rounded-2xl w-44 h-44 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.22)] border border-white/90 animate-qr-enter group">
                  
                  {/* High precision vector SVG QR code (1:1 ratio, strictly undistorted) */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#001849] fill-current select-none" aria-label="Pass QR Code">
                    {/* Corner 1 (Top Left) */}
                    <rect x="6" y="6" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                    <rect x="13" y="13" width="12" height="12" rx="2" fill="#001849" />
                    
                    {/* Corner 2 (Top Right) */}
                    <rect x="68" y="6" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                    <rect x="75" y="13" width="12" height="12" rx="2" fill="#001849" />

                    {/* Corner 3 (Bottom Left) */}
                    <rect x="6" y="68" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                    <rect x="13" y="75" width="12" height="12" rx="2" fill="#001849" />

                    {/* Data Matrix Pattern */}
                    <rect x="38" y="8" width="6" height="6" fill="#001849" />
                    <rect x="50" y="14" width="6" height="6" fill="#001849" />
                    <rect x="42" y="24" width="8" height="8" fill="#001849" />
                    <rect x="8" y="42" width="6" height="6" fill="#001849" />
                    <rect x="20" y="46" width="8" height="6" fill="#001849" />
                    <rect x="70" y="42" width="6" height="8" fill="#001849" />
                    <rect x="82" y="46" width="8" height="6" fill="#001849" />
                    <rect x="42" y="68" width="8" height="8" fill="#001849" />
                    <rect x="54" y="74" width="6" height="6" fill="#001849" />
                    <rect x="68" y="68" width="8" height="6" fill="#001849" />
                    <rect x="82" y="74" width="8" height="8" fill="#001849" />
                    <rect x="56" y="42" width="6" height="6" fill="#001849" />
                    <rect x="38" y="54" width="6" height="6" fill="#001849" />

                    {/* Center SmartBus Emblem Chip */}
                    <rect x="39" y="39" width="22" height="22" rx="5" fill="#0047ba" />
                    <circle cx="50" cy="50" r="5" fill="#00ffff" />
                  </svg>

                  {/* Turnstile Validation Scan Simulation Overlay */}
                  {isValidated && (
                    <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white animate-in zoom-in-90 duration-200 shadow-xl">
                      <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </div>
                      <span className="font-headline font-black text-sm mt-2 tracking-wide">GATE UNLOCKED</span>
                      <span className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">Turnstile #03 Ready</span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-cyan-200/80 font-medium tracking-wide mt-2">
                  Hold near turnstile optical reader or bus scanner
                </p>
              </div>

              {/* 4-Quadrant Pass Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs relative z-10">
                <div>
                  <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Passenger</p>
                  <p className="font-bold text-sm text-white truncate">{digitalPass.passengerName || 'Alex Commuter'}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Pass ID</p>
                  <p className="font-mono font-bold text-xs text-cyan-200 tracking-wider truncate">{currentTier.passId}</p>
                </div>

                <div className="pt-1">
                  <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Pass Category</p>
                  <p className="font-semibold text-xs text-white/95 truncate">{currentTier.label}</p>
                </div>

                <div className="text-right pt-1">
                  <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Valid Until</p>
                  <p className="font-bold text-xs text-cyan-200 truncate">{currentTier.validUntil}</p>
                </div>
              </div>

              {/* Card Footer Strip with Security & Stats */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-cyan-100/90 relative z-10">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  <span>✓ VERIFIED PASS</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-200/75">
                  <Clock className="w-3 h-3" />
                  <span>Synced: Today, 11:35 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pass Tier Switching Segmented Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 tracking-wider">
                Select Pass Tier
              </label>
              <span className="text-[10px] font-semibold text-primary dark:text-cyan-400">
                Instant Card Flip
              </span>
            </div>

            <div 
              role="radiogroup" 
              aria-label="Transit pass tier selection" 
              className="grid grid-cols-3 gap-2"
            >
              {Object.keys(PASS_TIERS).map((tierKey) => {
                const tier = PASS_TIERS[tierKey];
                const isSelected = selectedTierKey === tierKey;
                return (
                  <button
                    key={tierKey}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleTierSelect(tierKey)}
                    className={`p-2.5 rounded-2xl text-[11px] font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-1 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary active:scale-95 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                        : 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 border-outline-variant/40 hover:bg-surface-container dark:hover:bg-slate-750'
                    }`}
                  >
                    <span className="truncate w-full text-center leading-tight">{tier.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00ffff]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pass Metrics & Eco Savings Pill */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low/70 dark:bg-slate-800/70 border border-outline-variant/30 dark:border-slate-750 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-cyan-400" />
              <span className="font-semibold text-on-surface dark:text-slate-200">
                {currentTier.tripsCount} Completed Trips
              </span>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-lg">
              {currentTier.fareSaved} Saved
            </span>
          </div>

          {/* Action Buttons: Simulate Scan & Save/Print */}
          <div className="pt-1 flex gap-3">
            <button
              type="button"
              onClick={handleValidate}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate QR Scan</span>
            </button>

            <button
              type="button"
              onClick={handleSavePass}
              className="py-3 px-4 bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 rounded-2xl font-bold text-xs sm:text-sm border border-outline-variant/30 dark:border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              title="Download or Print Digital Pass"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
              <span>{isSaved ? 'Ready!' : 'Save Pass'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

