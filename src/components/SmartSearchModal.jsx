import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Bus, 
  MapPin, 
  Route as RouteIcon, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  History,
  CreditCard,
  ShieldCheck,
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import { useDebounce } from '../hooks/useDebounce';
import { sanitizeSearchQuery } from '../utils/sanitization';

const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'bus', label: 'Bus Number', icon: Bus, emoji: '🚌' },
  { id: 'route', label: 'Route', icon: RouteIcon, emoji: '🛣️' },
  { id: 'stop', label: 'Stop', icon: MapPin, emoji: '📍' },
  { id: 'pass', label: 'Pass ID', icon: CreditCard, emoji: '🎫' },
];

export default function SmartSearchModal({ setCurrentPage }) {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    getSearchResults, 
    setSelectedBusId,
    setSelectedStopId,
    setIsPassModalOpen,
    digitalPass
  } = useTransit();

  const [inputVal, setInputVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedInput = useDebounce(inputVal, 160);
  const [recentSearches, setRecentSearches] = useState([
    'Bus 101', 
    'Route 21A', 
    'Central Bus Stand', 
    'SB-METRO-2026-X889'
  ]);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Smooth open & reverse close animation lifecycle
  useEffect(() => {
    let timer;
    if (isSearchOpen) {
      setIsRendered(true);
      // Small frame delay to trigger entrance CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setIsRendered(false);
        setInputVal('');
        setActiveCategory('all');
        setSelectedIndex(0);
      }, 240);
    }
    return () => clearTimeout(timer);
  }, [isSearchOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsSearchOpen(false);
    }, 220);
  };

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isSearchOpen) {
          handleClose();
        } else {
          setIsSearchOpen(true);
        }
      }
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Memoize search results against debounced & sanitized input
  const rawResults = useMemo(() => {
    const clean = sanitizeSearchQuery(debouncedInput);
    return getSearchResults(clean);
  }, [debouncedInput, getSearchResults]);

  // Filter results by active category
  const filteredResults = useMemo(() => {
    const buses = (activeCategory === 'all' || activeCategory === 'bus') ? (rawResults.buses || []) : [];
    const routes = (activeCategory === 'all' || activeCategory === 'route') ? (rawResults.routes || []) : [];
    const stops = (activeCategory === 'all' || activeCategory === 'stop') ? (rawResults.stops || []) : [];
    const passes = (activeCategory === 'all' || activeCategory === 'pass') ? (rawResults.passes || []) : [];
    
    return { buses, routes, stops, passes };
  }, [rawResults, activeCategory]);

  const totalMatches = 
    filteredResults.buses.length + 
    filteredResults.routes.length + 
    filteredResults.stops.length + 
    filteredResults.passes.length;

  // Flatten items for keyboard arrow navigation
  const flattenedResults = useMemo(() => {
    const items = [];
    filteredResults.buses.forEach(b => items.push({ type: 'bus', data: b }));
    filteredResults.routes.forEach(r => items.push({ type: 'route', data: r }));
    filteredResults.stops.forEach(s => items.push({ type: 'stop', data: s }));
    filteredResults.passes.forEach(p => items.push({ type: 'pass', data: p }));
    return items;
  }, [filteredResults]);

  // Keyboard navigation up/down/enter in results
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedInput, activeCategory]);

  const handleInputKeyDown = (e) => {
    if (flattenedResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flattenedResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flattenedResults.length) % flattenedResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = flattenedResults[selectedIndex];
      if (current) {
        if (current.type === 'bus') handleSelectBus(current.data);
        else if (current.type === 'route') handleSelectRoute(current.data);
        else if (current.type === 'stop') handleSelectStop(current.data);
        else if (current.type === 'pass') handleSelectPass(current.data);
      }
    }
  };

  const addToRecent = (term) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 5);
    });
  };

  const handleSelectBus = (bus) => {
    setSelectedBusId(bus.id);
    addToRecent(bus.number);
    handleClose();
    if (setCurrentPage) setCurrentPage('tracking');
  };

  const handleSelectRoute = (route) => {
    addToRecent(route.name);
    handleClose();
    if (setCurrentPage) setCurrentPage('routes');
  };

  const handleSelectStop = (stop) => {
    if (setSelectedStopId) setSelectedStopId(stop.id);
    addToRecent(stop.name);
    handleClose();
    if (setCurrentPage) setCurrentPage('tracking');
  };

  const handleSelectPass = (pass) => {
    addToRecent(pass.passId || 'Metro Pass');
    handleClose();
    if (setIsPassModalOpen) setIsPassModalOpen(true);
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-250 ease-out ${
        isAnimating 
          ? 'bg-black/60 dark:bg-black/80 backdrop-blur-md opacity-100' 
          : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className={`w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-2xl bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-outline-variant/30 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-250 ease-out origin-top ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="SmartBus Transit Search"
      >
        {/* Top Header & Branding Bar */}
        <div className="p-3.5 sm:p-4.5 border-b border-outline-variant/30 dark:border-slate-800 bg-surface-container-low/50 dark:bg-slate-850/80 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-primary dark:text-cyan-400 font-bold text-xs sm:text-sm">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-cyan-400 shrink-0 animate-pulse" />
            <span className="font-headline font-black tracking-tight">Search SmartBus...</span>
          </div>

          <div className="flex items-center space-x-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 rounded-md border border-outline-variant/40 dark:border-slate-700">
              ESC
            </kbd>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="px-4 py-3 sm:py-4 border-b border-outline-variant/20 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-on-surface-variant dark:text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search Bus 101, Route 21A, Chennai Central..."
            className="flex-1 bg-transparent text-sm sm:text-base font-body text-on-surface dark:text-slate-100 placeholder:text-outline dark:placeholder:text-slate-500 outline-hidden min-w-0"
            aria-label="Search input"
          />
          {inputVal && (
            <button
              onClick={() => {
                setInputVal('');
                inputRef.current?.focus();
              }}
              className="text-xs font-bold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 px-2 py-1 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Bar: Bus Number, Route, Stop, Pass ID */}
        <div className="px-3.5 sm:px-4 py-2 bg-surface-container-low/40 dark:bg-slate-900 border-b border-outline-variant/20 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {SEARCH_CATEGORIES.map(cat => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 select-none ${
                  isCatActive
                    ? 'bg-primary dark:bg-cyan-500 text-white font-bold shadow-xs scale-102'
                    : 'bg-surface-container dark:bg-slate-800/90 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high dark:hover:bg-slate-750'
                }`}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Results & Suggestions Area */}
        <div ref={resultsContainerRef} className="p-4 sm:p-5 overflow-y-auto flex-1 hide-scrollbar space-y-5">
          {/* Empty Search State: Categories Overview & Recent Queries */}
          {!inputVal && (
            <div className="space-y-5">
              {/* Category Highlight Cards */}
              <div>
                <span className="text-[11px] font-label font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                  Search Categories
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button 
                    onClick={() => {
                      setActiveCategory('bus');
                      setInputVal('101');
                    }}
                    className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 text-left transition-all group"
                  >
                    <span className="text-xl">🚌</span>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-200 mt-1 group-hover:text-primary dark:group-hover:text-cyan-400">Bus Number</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400">e.g. Bus 101, 21A</p>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveCategory('route');
                      setInputVal('Guindy');
                    }}
                    className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 text-left transition-all group"
                  >
                    <span className="text-xl">🛣️</span>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-200 mt-1 group-hover:text-primary dark:group-hover:text-cyan-400">Transit Route</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400">e.g. Central Corridor</p>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveCategory('stop');
                      setInputVal('Central');
                    }}
                    className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 text-left transition-all group"
                  >
                    <span className="text-xl">📍</span>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-200 mt-1 group-hover:text-primary dark:group-hover:text-cyan-400">Stop & Station</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400">e.g. Chennai Central</p>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveCategory('pass');
                      setInputVal('SB-METRO');
                    }}
                    className="p-3 rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 text-left transition-all group"
                  >
                    <span className="text-xl">🎫</span>
                    <p className="font-bold text-xs text-on-surface dark:text-slate-200 mt-1 group-hover:text-primary dark:group-hover:text-cyan-400">Pass ID</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400">e.g. SB-METRO-2026</p>
                  </button>
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <span className="text-[11px] font-label font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <History className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                    Recent Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => setInputVal(term)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-200 hover:bg-primary/10 hover:text-primary dark:hover:text-cyan-400 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Arterial Suggestion */}
              <div>
                <span className="text-[11px] font-label font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                  Popular Transit Arterials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setInputVal('Bus 101')}
                    className="p-3 text-left rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-cyan-400">
                        Bus 101 • Tech Express
                      </p>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                        Market Square ➔ Civic Hub ➔ College Terminal
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => setInputVal('Route 21A')}
                    className="p-3 text-left rounded-2xl bg-surface-container-low dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-cyan-400">
                        Route 21A • Main Corridor
                      </p>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                        Guindy ➔ Saidapet ➔ Chennai Central
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results State */}
          {inputVal && (
            <div className="space-y-5">
              {totalMatches === 0 ? (
                <div className="py-12 text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container dark:bg-slate-800 flex items-center justify-center mx-auto text-outline dark:text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-headline font-bold text-base text-on-surface dark:text-slate-200">
                    No results found for "{inputVal}"
                  </h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto">
                    Try searching for bus numbers like <span className="font-bold text-primary dark:text-cyan-400">101</span> or <span className="font-bold text-primary dark:text-cyan-400">21A</span>, stop names like <span className="font-bold text-primary dark:text-cyan-400">Central</span>, or your <span className="font-bold text-primary dark:text-cyan-400">Pass ID</span>.
                  </p>
                </div>
              ) : (
                <>
                  {/* Category 1: Matching Buses */}
                  {filteredResults.buses.length > 0 && (
                    <div>
                      <span className="text-[11px] font-label font-bold text-primary dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <span>🚌</span>
                        Active Fleet Buses ({filteredResults.buses.length})
                      </span>
                      <div className="space-y-2">
                        {filteredResults.buses.map(bus => (
                          <div
                            key={bus.id}
                            onClick={() => handleSelectBus(bus)}
                            className="p-3.5 rounded-2xl bg-surface-container-low/80 dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 transition-all cursor-pointer flex justify-between items-center group shadow-xs hover:border-primary/40 dark:hover:border-cyan-500/40"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-headline font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                {bus.number}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                                  {bus.routeName}
                                </p>
                                <p className="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                                  Current: {bus.currentStop} • Next: <span className="font-semibold text-on-surface dark:text-slate-200">{bus.nextStop}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2.5 shrink-0 ml-2">
                              <div className="text-right hidden sm:block">
                                <span className="inline-block text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400">
                                  {bus.trafficAdjustedEtaMinutes}m ETA
                                </span>
                                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">{bus.speedKmH} km/h</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 2: Matching Routes */}
                  {filteredResults.routes.length > 0 && (
                    <div>
                      <span className="text-[11px] font-label font-bold text-primary dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <span>🛣️</span>
                        Transit Corridors & Routes ({filteredResults.routes.length})
                      </span>
                      <div className="space-y-2">
                        {filteredResults.routes.map(r => (
                          <div
                            key={r.id}
                            onClick={() => handleSelectRoute(r)}
                            className="p-3.5 rounded-2xl bg-surface-container-low/80 dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 transition-all cursor-pointer flex justify-between items-center group shadow-xs hover:border-primary/40 dark:hover:border-cyan-500/40"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-headline font-bold text-xs text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2 py-0.5 rounded-md">
                                  Route {r.number}
                                </span>
                                <h5 className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                                  {r.name}
                                </h5>
                              </div>
                              <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-1">
                                {r.distanceKm} km • {r.frequency} • {r.stops.length} Stops ({r.from} ➔ {r.to})
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-bold text-primary dark:text-cyan-400 hidden sm:inline">View Route</span>
                              <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 3: Matching Stops */}
                  {filteredResults.stops.length > 0 && (
                    <div>
                      <span className="text-[11px] font-label font-bold text-primary dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <span>📍</span>
                        Stations & Stops ({filteredResults.stops.length})
                      </span>
                      <div className="space-y-2">
                        {filteredResults.stops.map(stop => (
                          <div
                            key={stop.id}
                            onClick={() => handleSelectStop(stop)}
                            className="p-3.5 rounded-2xl bg-surface-container-low/80 dark:bg-slate-850 hover:bg-surface-container dark:hover:bg-slate-800 border border-outline-variant/30 dark:border-slate-750 transition-all cursor-pointer flex justify-between items-center group shadow-xs hover:border-primary/40 dark:hover:border-cyan-500/40"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100 truncate group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                                {stop.name}
                              </p>
                              <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                                {stop.area} • Next Arrival: <span className="font-semibold text-primary dark:text-cyan-400">{stop.nextBus}</span> ({stop.nextEta})
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/25 px-2.5 py-1 rounded-full">
                                Inspect Stop
                              </span>
                              <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 4: Matching Pass ID */}
                  {filteredResults.passes.length > 0 && (
                    <div>
                      <span className="text-[11px] font-label font-bold text-primary dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <span>🎫</span>
                        Digital Metro Passes ({filteredResults.passes.length})
                      </span>
                      <div className="space-y-2">
                        {filteredResults.passes.map((pass, idx) => (
                          <div
                            key={pass.passId || idx}
                            onClick={() => handleSelectPass(pass)}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-primary/10 to-cyan-500/10 dark:from-blue-950/40 dark:to-cyan-950/40 border border-primary/20 dark:border-cyan-500/30 hover:border-primary/50 dark:hover:border-cyan-400/50 transition-all cursor-pointer flex justify-between items-center group shadow-xs"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                <CreditCard className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-bold text-xs text-primary dark:text-cyan-400">
                                    {pass.passId}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                    {pass.status || 'Active'}
                                  </span>
                                </div>
                                <p className="font-bold text-xs text-on-surface dark:text-slate-100 truncate mt-0.5">
                                  {pass.passType || 'Monthly All-Corridor Pass'} • {pass.passengerName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-xs font-bold text-primary dark:text-cyan-400 bg-white/80 dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs">
                                View Pass
                              </span>
                              <ChevronRight className="w-4 h-4 text-outline dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar with quick keyboard instructions */}
        <div className="p-3 bg-surface-container dark:bg-slate-800/80 border-t border-outline-variant/20 dark:border-slate-750/60 px-4 sm:px-5 flex justify-between items-center text-[11px] text-on-surface-variant dark:text-slate-400 font-label">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="font-mono font-bold text-primary dark:text-cyan-400">↑↓</span> Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="font-mono font-bold text-primary dark:text-cyan-400">↵</span> Select
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="font-mono font-bold text-primary dark:text-cyan-400">ESC</span> Close
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-on-surface-variant/80 dark:text-slate-500">SmartBus Live Telemetry Search</span>
        </div>
      </div>
    </div>
  );
}
