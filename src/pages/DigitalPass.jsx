import React, { useState, useMemo, useRef } from 'react';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  User,
  Route as RouteIcon,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  MapPin,
  Bus,
  Check,
  X,
  ExternalLink,
  Wifi,
  Heart,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { useAuth } from '../context/AuthContext';
import {
  PASS_TIERS,
  PASS_STATUS,
  calculatePassExpiry,
  getPassStatusMeta,
  sharePass,
  printPass,
  downloadTicketReceipt
} from '../services/passService';

export default function DigitalPass({ setCurrentPage }) {
  const {
    digitalPass,
    routes,
    buses,
    favorites,
    isFavoriteRoute,
    showToast
  } = useTransit();
  const { currentUser } = useAuth();

  // Tier selection and simulated pass state (Active, Expiring Soon, Expired, No Pass)
  const [selectedTierKey, setSelectedTierKey] = useState('monthly');
  const [overrideStatus, setOverrideStatus] = useState(null); // null | 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED' | 'NO_PASS'
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [cardHighlighted, setCardHighlighted] = useState(false);

  const passCardRef = useRef(null);

  // Derive current pass tier configuration
  const currentTier = PASS_TIERS[selectedTierKey] || PASS_TIERS.monthly;

  // Derive Passenger Name from active session or pass telemetry
  const passengerName = currentUser?.name || digitalPass?.passengerName || 'Alex Commuter';

  // Find user's favorite route if available
  const favoriteRoute = useMemo(() => {
    if (favorites?.routes?.length > 0) {
      const favId = favorites.routes[0];
      return routes.find(r => r.id === favId) || null;
    }
    return null;
  }, [favorites, routes]);

  // Derive assigned route display
  const routeDisplay = useMemo(() => {
    if (favoriteRoute) {
      return `${favoriteRoute.number} — ${favoriteRoute.name}`;
    }
    return currentTier.defaultRoute || 'All Metro Corridors';
  }, [favoriteRoute, currentTier]);

  // Associated bus for favorite route if available
  const activeCorridorBus = useMemo(() => {
    if (favoriteRoute) {
      return buses.find(b => b.routeId === favoriteRoute.id) || null;
    }
    return buses.find(b => b.id === 'bus-21a') || buses[0] || null;
  }, [favoriteRoute, buses]);

  // Calculate validity and expiration
  const baseValidUntil = currentTier.id === 'daily'
    ? '2026-09-17'
    : currentTier.id === 'student'
      ? '2026-12-15'
      : '2026-09-30';
  const baseValidFrom = '2026-09-01';

  const expiryMetrics = useMemo(() => {
    return calculatePassExpiry(baseValidUntil, baseValidFrom);
  }, [baseValidUntil, baseValidFrom]);

  // Determine active status: override takes precedence for demo/testing
  const activeStatus = overrideStatus === 'NO_PASS'
    ? 'NO_PASS'
    : (overrideStatus || expiryMetrics.status);

  const statusMeta = useMemo(() => {
    if (activeStatus === 'NO_PASS') {
      return {
        label: 'NO PASS',
        code: 'no_pass',
        dotColor: 'bg-slate-400',
        badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
        cardBanner: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        textColor: 'text-slate-600 dark:text-slate-400',
        title: 'No Active Pass',
        message: 'No digital transit pass is active on this account.',
        actionLabel: 'Explore Routes',
        actionUrgent: false
      };
    }
    return getPassStatusMeta(activeStatus);
  }, [activeStatus]);

  // Handler: Scroll and highlight the pass card
  const handleViewMyPass = () => {
    if (passCardRef.current) {
      passCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCardHighlighted(true);
      setTimeout(() => setCardHighlighted(false), 2000);
    }
  };

  // Handler: Share Pass
  const handleSharePass = async () => {
    const passPayload = {
      passengerName,
      passId: currentTier.passId,
      passType: currentTier.category,
      route: routeDisplay,
      validFrom: baseValidFrom,
      validUntil: baseValidUntil,
      status: activeStatus
    };

    const res = await sharePass(passPayload);
    if (res.success) {
      setIsCopied(true);
      if (showToast) {
        showToast(res.message, 'success');
      }
      setTimeout(() => setIsCopied(false), 2500);
    } else if (res.method === 'native') {
      // User cancelled native sheet
    } else if (showToast) {
      showToast(res.message, 'info');
    }
  };

  // Handler: Download/Save
  const handleDownloadSave = () => {
    const passPayload = {
      passengerName,
      passId: currentTier.passId,
      passType: currentTier.category,
      route: routeDisplay,
      validFrom: baseValidFrom,
      validUntil: baseValidUntil,
      status: activeStatus
    };

    // Download text receipt & trigger print dialog
    downloadTicketReceipt(passPayload);
    if (showToast) {
      showToast('Boarding pass summary downloaded. Opening print preview...', 'success');
    }
    setTimeout(() => {
      printPass();
    }, 450);
  };

  return (
    <main className="min-h-screen bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 pt-20 sm:pt-24 pb-20 px-4 sm:px-6 md:px-margin-desktop transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

        {/* ================================================== */}
        {/* 1. HERO & PAGE HEADER                             */}
        {/* ================================================== */}
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-5 border-b border-outline-variant/30 dark:border-slate-800/80 pb-6 sm:pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label font-bold uppercase tracking-wider bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Digital Bus Pass</span>
              </span>

              {/* Simulation Transparency Indicator */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label font-bold uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>SIMULATION DATA</span>
              </span>
            </div>

            <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl text-on-surface dark:text-slate-100 tracking-tight leading-tight">
              Your Journey. <span className="text-primary dark:text-cyan-400">One Digital Pass.</span>
            </h1>

            <p className="text-on-surface-variant dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Keep your SmartBus travel pass accessible wherever you go. Instant turnstile validation, route credentials, and live transit privileges.
            </p>
          </div>

          {/* Primary & Secondary Hero CTAs */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleViewMyPass}
              className="btn-primary text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-md shadow-primary/25 flex items-center gap-2 min-h-[44px] active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View My Pass</span>
            </button>

            <button
              onClick={() => setCurrentPage('routes')}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-outline-variant/50 dark:border-slate-700 hover:border-primary dark:hover:border-cyan-400 text-on-surface dark:text-slate-200 hover:text-primary dark:hover:text-cyan-400 transition-all flex items-center gap-2 min-h-[44px] bg-surface-container-low dark:bg-slate-800/80 active:scale-95"
            >
              <RouteIcon className="w-4 h-4" />
              <span>Explore Routes</span>
            </button>
          </div>
        </header>

        {/* ================================================== */}
        {/* INTERACTIVE DEMO TESTING CONTROLS                 */}
        {/* ================================================== */}
        <section
          aria-label="Simulation Status Switcher"
          className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low/80 dark:bg-slate-850/80 border border-outline-variant/30 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-medium">
            <SlidersHorizontal className="w-4 h-4 text-primary dark:text-cyan-400" />
            <span className="font-bold text-on-surface dark:text-slate-200">Simulation State Switcher:</span>
            <span className="text-[11px] hidden md:inline">Test requirement states (Active, Expiring Soon, Expired, No Pass)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ACTIVE', label: 'Active (Valid)', color: 'text-emerald-500' },
              { id: 'EXPIRING SOON', label: 'Expiring Soon', color: 'text-amber-500' },
              { id: 'EXPIRED', label: 'Expired', color: 'text-red-500' },
              { id: 'NO_PASS', label: 'No Pass', color: 'text-slate-400' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setOverrideStatus(item.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all min-h-[36px] flex items-center gap-1.5 ${
                  activeStatus === item.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.color} ${activeStatus === item.id ? 'bg-white' : ''}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 19. EMPTY / NO PASS STATE HANDLING                 */}
        {/* ================================================== */}
        {activeStatus === 'NO_PASS' ? (
          <div className="p-8 sm:p-14 text-center rounded-3xl bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 shadow-xl space-y-4 max-w-2xl mx-auto animate-fade-up">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 mx-auto flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="font-headline font-black text-2xl text-on-surface dark:text-slate-100">
              No active pass
            </h2>
            <p className="text-on-surface-variant dark:text-slate-400 text-sm max-w-md mx-auto">
              Create or activate a SmartBus pass to see it here. Browse available corridors and transit programs.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={() => setCurrentPage('routes')}
                className="btn-primary px-6 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 min-h-[44px]"
              >
                <RouteIcon className="w-4 h-4" />
                <span>Explore Routes</span>
              </button>
              <button
                onClick={() => setOverrideStatus('ACTIVE')}
                className="px-6 py-2.5 rounded-full font-bold text-sm border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 hover:bg-surface-container min-h-[44px]"
              >
                Restore Demo Pass
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ============================================== */}
            {/* LEFT COLUMN: ACTIVE PASS CARD & QR VISUAL      */}
            {/* ============================================== */}
            <div className="lg:col-span-6 space-y-6">

              {/* Pass Tier Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 tracking-wider">
                    Select Pass Tier
                  </label>
                  <span className="text-[11px] font-semibold text-primary dark:text-cyan-400">
                    {currentTier.validityDays} Days Coverage
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Pass tier options"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {Object.keys(PASS_TIERS).map((key) => {
                    const tier = PASS_TIERS[key];
                    const isSelected = selectedTierKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedTierKey(key)}
                        className={`p-2.5 rounded-2xl text-[11px] font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-1 min-h-[44px] active:scale-95 ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                            : 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 border-outline-variant/30 hover:bg-surface-container dark:hover:bg-slate-750'
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

              {/* ============================================== */}
              {/* 2. ACTIVE PASS CARD (PRINTABLE & RESPONSIVE)   */}
              {/* ============================================== */}
              <div
                ref={passCardRef}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentTier.gradient} p-5 sm:p-7 text-white shadow-2xl border border-blue-400/40 dark:border-cyan-400/30 transition-all duration-500 ${
                  cardHighlighted ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-background scale-[1.02]' : ''
                }`}
              >
                {/* Luxury Ambient Lighting Glows */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-400/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                {/* Pass Top Branding & Status Header */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                      <Bus className="w-5 h-5 text-cyan-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline font-black text-xl tracking-tight block leading-none">SmartBus</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/20 font-bold uppercase tracking-wider text-cyan-200">
                          Digital
                        </span>
                      </div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-cyan-200/90 font-medium">
                        DIGITAL TRAVEL PASS
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${statusMeta.badgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor} ${activeStatus === 'ACTIVE' ? 'animate-pulse' : ''}`} />
                      <span>{statusMeta.label}</span>
                    </span>
                    <span className="text-[10px] text-cyan-200/80 font-medium mt-1">
                      {expiryMetrics.daysRemaining} {expiryMetrics.daysRemaining === 1 ? 'day' : 'days'} remaining
                    </span>
                  </div>
                </div>

                {/* QR-CODE STYLE VISUAL */}
                <div className="relative my-4 flex flex-col items-center z-10">
                  <div className="relative bg-white p-3 rounded-2xl w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.22)] border border-white/90 group">
                    {/* Undistorted SVG QR Code (1:1 Ratio) */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#001849] fill-current select-none" aria-label="Demo Pass QR Code">
                      {/* Top-Left Finder */}
                      <rect x="6" y="6" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                      <rect x="13" y="13" width="12" height="12" rx="2" fill="#001849" />

                      {/* Top-Right Finder */}
                      <rect x="68" y="6" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                      <rect x="75" y="13" width="12" height="12" rx="2" fill="#001849" />

                      {/* Bottom-Left Finder */}
                      <rect x="6" y="68" width="26" height="26" rx="4" fill="none" stroke="#001849" strokeWidth="5.5" />
                      <rect x="13" y="75" width="12" height="12" rx="2" fill="#001849" />

                      {/* Matrix Pattern Modules */}
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

                      {/* Center Emblem Chip */}
                      <rect x="39" y="39" width="22" height="22" rx="5" fill="#0047ba" />
                      <circle cx="50" cy="50" r="5" fill="#00ffff" />
                    </svg>
                  </div>

                  {/* Mandated QR Disclaimer */}
                  <p className="text-[10px] text-cyan-200/90 font-medium tracking-wide mt-2 text-center max-w-xs">
                    Demonstration QR visual for UI preview only. Ticket scanning is a simulated feature.
                  </p>
                </div>

                {/* 4-Quadrant Card Information Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs relative z-10">
                  <div>
                    <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Passenger</p>
                    <p className="font-bold text-sm text-white truncate">{passengerName}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Pass Number</p>
                    <p className="font-mono font-bold text-xs text-cyan-200 tracking-wider truncate">{currentTier.passId}</p>
                  </div>

                  <div className="pt-1">
                    <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Transit Route</p>
                    <p className="font-semibold text-xs text-white/95 truncate">{routeDisplay}</p>
                  </div>

                  <div className="text-right pt-1">
                    <p className="text-[10px] uppercase font-label tracking-wider text-cyan-200/80 font-bold">Valid Until</p>
                    <p className="font-bold text-xs text-cyan-200 truncate">{baseValidUntil}</p>
                  </div>
                </div>

                {/* Pass Footer Security Stamp */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-cyan-100/90 relative z-10">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                    <span>✓ VERIFIED PASS</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-cyan-200/75">
                    <Clock className="w-3 h-3" />
                    <span>Valid From: {baseValidFrom}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Pass Actions Row for Easy Thumb Access */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleViewMyPass}
                  className="p-2.5 rounded-2xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/30 text-xs font-bold flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4 text-primary dark:text-cyan-400" />
                  <span>View Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleSharePass}
                  className="p-2.5 rounded-2xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/30 text-xs font-bold flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all active:scale-95"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-primary dark:text-cyan-400" />}
                  <span>{isCopied ? 'Copied!' : 'Share Pass'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSave}
                  className="p-2.5 rounded-2xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/30 text-xs font-bold flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-primary dark:text-cyan-400" />
                  <span>Save Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRenewModalOpen(true)}
                  className="p-2.5 rounded-2xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/30 text-xs font-bold flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  <span>Renew Pass</span>
                </button>
              </div>

            </div>

            {/* ============================================== */}
            {/* RIGHT COLUMN: DETAILS, STATUS, EXPIRY, TRAVEL  */}
            {/* ============================================== */}
            <div className="lg:col-span-6 space-y-6">

              {/* ============================================== */}
              {/* 3. PASS STATUS BANNER                           */}
              {/* ============================================== */}
              <section className={`p-4 sm:p-5 rounded-3xl border ${statusMeta.cardBanner} flex items-start gap-3.5 transition-all shadow-xs`}>
                <div className="mt-0.5">
                  {activeStatus === 'ACTIVE' && <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                  {activeStatus === 'EXPIRING SOON' && <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                  {activeStatus === 'EXPIRED' && <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline font-black text-base sm:text-lg text-on-surface dark:text-slate-100">
                      {statusMeta.title}
                    </h2>
                    <span className={`text-[10px] font-label font-bold uppercase px-2 py-0.5 rounded-full ${statusMeta.badgeClass}`}>
                      {statusMeta.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300">
                    {statusMeta.message}
                  </p>
                </div>
              </section>

              {/* ============================================== */}
              {/* 4. PASS DETAILS SECTION                        */}
              {/* ============================================== */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/20 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-primary dark:text-cyan-400" />
                    <h2 className="font-headline font-bold text-base text-on-surface dark:text-slate-100">
                      Pass Details
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg">
                    {currentTier.fareSaved} Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Pass Type
                    </span>
                    <span className="font-bold text-sm text-on-surface dark:text-slate-100 block">
                      {currentTier.label}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      {currentTier.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Transit Route / Zone
                    </span>
                    <span className="font-bold text-sm text-on-surface dark:text-slate-100 block truncate">
                      {routeDisplay}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      {favoriteRoute ? 'User Favorite Corridor' : 'All Metro Zones'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Validity Period
                    </span>
                    <span className="font-bold text-sm text-on-surface dark:text-slate-100 block">
                      {baseValidFrom} → {baseValidUntil}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      {currentTier.validityDays} Days Total Term
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Pass Number & Token
                    </span>
                    <span className="font-mono font-bold text-sm text-primary dark:text-cyan-400 block">
                      {currentTier.passId}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      NFC & Optical Scanner Enabled
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Passenger Name
                    </span>
                    <span className="font-bold text-sm text-on-surface dark:text-slate-100 block">
                      {passengerName}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      {currentUser?.email || 'commuter@smartbus.transit'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800">
                    <span className="text-[10px] font-label uppercase font-bold text-on-surface-variant dark:text-slate-400 block mb-0.5">
                      Boarding Verification
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${statusMeta.dotColor}`} />
                      <span className="font-bold text-sm text-on-surface dark:text-slate-100">
                        {statusMeta.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5 block">
                      {currentTier.tripsAllowed}
                    </span>
                  </div>
                </div>
              </section>

              {/* ============================================== */}
              {/* 6. PASS EXPIRY REMINDER                         */}
              {/* ============================================== */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary dark:text-cyan-400" />
                    <h2 className="font-headline font-bold text-base text-on-surface dark:text-slate-100">
                      Pass Expiry
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-primary dark:text-cyan-400">
                    {expiryMetrics.daysRemaining} days left
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300">
                  {expiryMetrics.daysRemaining > 0 ? (
                    <>Your pass expires in <strong className="text-on-surface dark:text-white font-black">{expiryMetrics.daysRemaining} days</strong> (on {baseValidUntil}).</>
                  ) : (
                    <>Your pass expired on <strong className="text-red-500 font-bold">{baseValidUntil}</strong>.</>
                  )}
                </p>

                {/* Visual Expiry Timeline Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        expiryMetrics.daysRemaining <= 5
                          ? 'bg-amber-500'
                          : 'bg-primary dark:bg-cyan-400'
                      }`}
                      style={{ width: `${Math.max(5, expiryMetrics.percentRemaining)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
                    <span>Started: {baseValidFrom}</span>
                    <span>Expires: {baseValidUntil}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-low/70 dark:bg-slate-850/70 border border-outline-variant/20 dark:border-slate-800 text-[11px] text-on-surface-variant dark:text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Simulated validity period. Automated renewals and auto-reload will activate when the transit payments engine is integrated.
                  </span>
                </div>
              </section>

              {/* ============================================== */}
              {/* 5. TRAVEL SUMMARY & FAVORITES INTEGRATION      */}
              {/* ============================================== */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-outline-variant/30 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/20 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <RouteIcon className="w-4 h-4 text-primary dark:text-cyan-400" />
                    <h2 className="font-headline font-bold text-base text-on-surface dark:text-slate-100">
                      Travel Summary
                    </h2>
                  </div>

                  {favoriteRoute && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>Favorite Route</span>
                    </span>
                  )}
                </div>

                {favoriteRoute ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-label uppercase font-bold text-primary dark:text-cyan-400">
                          Corridor {favoriteRoute.number}
                        </span>
                        <p className="font-bold text-sm text-on-surface dark:text-slate-100">
                          {favoriteRoute.name}
                        </p>
                        <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                          {favoriteRoute.from} → {favoriteRoute.to} ({favoriteRoute.distanceKm} km)
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentPage('tracking')}
                        className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary dark:text-cyan-400 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                        title="Track Bus on this route"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {activeCorridorBus && (
                      <div className="p-3 rounded-2xl bg-surface-container-low/60 dark:bg-slate-850/60 border border-outline-variant/20 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary dark:text-cyan-400 flex items-center justify-center font-bold">
                            <Bus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-on-surface dark:text-slate-100">{activeCorridorBus.number}</span>
                            <span className="text-[11px] text-on-surface-variant dark:text-slate-400 block">{activeCorridorBus.plate}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {activeCorridorBus.status}
                          </span>
                          <span className="text-[11px] text-on-surface-variant dark:text-slate-400 block mt-0.5">
                            ETA: {activeCorridorBus.trafficAdjustedEtaMinutes} min
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-on-surface-variant dark:text-slate-400 space-y-2">
                    <p>No travel history available yet.</p>
                    <button
                      onClick={() => setCurrentPage('routes')}
                      className="text-primary dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore routes to save favorites</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </section>

            </div>
          </div>
        )}

      </div>

      {/* ================================================== */}
      {/* 7. RENEW PASS "COMING SOON" DIALOG                */}
      {/* ================================================== */}
      {isRenewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsRenewModalOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Pass Renewal Information"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="p-1 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close renewal modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-headline font-black text-xl text-on-surface dark:text-slate-100">
                Online Renewal — Coming Soon
              </h3>
              <p className="text-on-surface-variant dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                We are actively integrating the secure digital fare payment gateway with the municipal transit authority.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-on-surface dark:text-slate-200 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Simulated Demo Active</span>
              </div>
              <p className="text-on-surface-variant dark:text-slate-400 text-[11px]">
                In this preview build, your digital pass remains active for demonstration and turnstile simulation. No real payment processing is enabled.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="btn-primary w-full py-2.5 rounded-full font-bold text-xs sm:text-sm min-h-[44px]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
