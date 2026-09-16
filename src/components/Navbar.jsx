import React, { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Home,
  Info,
  Navigation,
  Map as MapIcon,
  Phone,
  Search,
  Bell,
  CreditCard,
  AlertTriangle,
  Bot,
  BarChart3
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationBadge from './notifications/NotificationBadge';
import { useTransit } from '../context/TransitContext';

export default function Navbar({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    unreadNotificationCount,
    isNotificationsOpen,
    setIsNotificationsOpen,
    setIsSearchOpen,
    setIsPassModalOpen,
    setIsIncidentModalOpen,
    isAiCopilotOpen,
    toggleAiCopilot
  } = useTransit();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'tracking', label: 'Track Bus' },
    { id: 'routes', label: 'Routes' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'contact', label: 'Contact' },
  ];

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'tracking', label: 'Track', icon: Navigation },
    { id: 'ask-ai', label: 'Ask AI', icon: Bot, isAi: true },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-primary/5 dark:shadow-black/40 border-b border-white/40 dark:border-slate-800'
        : 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-white/20 dark:border-slate-800/60'
        }`}>
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-margin-desktop h-16 sm:h-20 w-full max-w-container-max mx-auto">
          {/* Branding Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 sm:space-x-2.5 group focus:outline-none shrink-0"
            aria-label="SmartBus Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-300">
              <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-headline font-extrabold text-xl sm:text-2xl md:text-3xl text-primary dark:text-blue-400 tracking-tighter transition-colors">
              SmartBus
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="navbar-center hidden md:flex items-center justify-center flex-1 min-w-0 px-2 lg:px-6">
            <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`font-body text-xs lg:text-[14px] font-semibold transition-all duration-200 relative py-1.5 whitespace-nowrap shrink-0 focus:outline-none ${isActive
                      ? 'text-primary dark:text-cyan-400 font-bold'
                      : 'text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400'
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary dark:bg-cyan-400 rounded-full animate-in fade-in duration-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Controls: Search, Notifications, Pass, Theme, Login / Portal Switcher */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 shrink-0">
            {/* Compact Icon-Only Search Button */}
            <div className="relative group inline-flex items-center justify-center shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search"
                aria-label="Search SmartBus (Ctrl+K)"
                className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none active:scale-90 shadow-xs bg-surface-container-low/90 dark:bg-slate-800/90 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border-outline-variant/30 dark:border-slate-700/80 hover:shadow-[0_0_12px_rgba(0,102,255,0.35)] dark:hover:shadow-[0_0_12px_rgba(0,255,255,0.35)] hover:border-primary/40 dark:hover:border-cyan-400/40"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary dark:text-cyan-400 shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-6" />
              </button>

              {/* Floating Tooltip on Hover */}
              <div
                role="tooltip"
                className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-slate-900/95 dark:bg-slate-800/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out shadow-lg border border-white/10 z-50 backdrop-blur-md hidden sm:block"
              >
                <span>Search</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900/95 dark:bg-slate-800/95 border-t border-l border-white/10" />
              </div>
            </div>

            {/* Smart Notification Center Trigger */}
            <button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className={`relative p-2.5 rounded-full transition-all border shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-cyan-400 active:scale-95 ${
                isNotificationsOpen
                  ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20 dark:ring-cyan-400/20'
                  : 'bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-750 text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 border-outline-variant/30 dark:border-slate-700'
              }`}
              title="Transit Alerts Center"
              aria-label="Open notifications"
              aria-expanded={isNotificationsOpen}
              aria-haspopup="dialog"
            >
              <Bell className="w-4 h-4" />
              <NotificationBadge count={unreadNotificationCount} />
            </button>

            {/* Digital Pass Trigger */}
            <button
              onClick={() => handleNavClick('pass')}
              className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all border flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 ${
                currentPage === 'pass'
                  ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20 dark:ring-cyan-400/20'
                  : 'bg-primary/10 dark:bg-primary/25 hover:bg-primary/20 text-primary dark:text-cyan-400 border-primary/20 dark:border-cyan-500/30'
              }`}
              title="Digital Bus Pass"
              aria-label="Open Digital Bus Pass"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden lg:inline">Pass</span>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle variant="navbar" />

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 h-9 sm:h-10 px-3 sm:px-3.5 bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700 rounded-full border border-outline-variant/40 dark:border-slate-700 transition-all focus:outline-none shadow-xs active:scale-95 shrink-0"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                    {currentUser.role === 'admin' ? 'A' : (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <span className="text-xs font-semibold text-on-surface dark:text-slate-200 truncate max-w-[70px] sm:max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant dark:text-slate-400 shrink-0 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-slate-700/80 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-outline-variant/20 dark:border-slate-700/60">
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400 font-label uppercase font-semibold">Active Session</p>
                      <p className="text-sm font-bold text-primary dark:text-blue-400 capitalize">{currentUser.role} Command Portal</p>
                    </div>
                    <button
                      onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-750 flex items-center space-x-2.5 font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary dark:text-blue-400" />
                      <span>Open Dashboard</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('ai-insights')}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-750 flex items-center space-x-2.5 font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-primary-container dark:text-cyan-400" />
                      <span>AI Insights Terminal</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('analytics')}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-750 flex items-center space-x-2.5 font-medium transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 text-primary dark:text-cyan-400" />
                      <span>Transit Analytics</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('pass')}
                      className="w-full text-left px-4 py-2.5 text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-750 flex items-center space-x-2.5 font-medium transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-primary dark:text-cyan-400" />
                      <span>Digital Bus Pass</span>
                    </button>
                    <div className="border-t border-outline-variant/20 dark:border-slate-700/60 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-container/40 dark:hover:bg-red-950/40 flex items-center space-x-2.5 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-error" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="btn-primary px-5 lg:px-6 py-2 rounded-full font-body text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-cyan-400/40"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Quick Action Buttons & Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-1.5">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Search"
              aria-label="Search SmartBus"
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none active:scale-90 shadow-xs bg-surface-container-low/90 dark:bg-slate-800/90 hover:bg-surface-container dark:hover:bg-slate-750 text-primary dark:text-cyan-400 border-outline-variant/30 dark:border-slate-750"
            >
              <Search className="w-4 h-4 shrink-0 transition-transform duration-200 active:scale-110" />
            </button>

            {/* Mobile Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className={`relative p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-cyan-400 active:scale-95 ${
                isNotificationsOpen
                  ? 'bg-primary/15 dark:bg-cyan-950/60 text-primary dark:text-cyan-400'
                  : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800'
              }`}
              aria-label="Open notifications"
              aria-expanded={isNotificationsOpen}
              aria-haspopup="dialog"
            >
              <Bell className="w-4 h-4" />
              <NotificationBadge count={unreadNotificationCount} isMobile={true} />
            </button>

            {/* Mobile Theme Toggle */}
            <ThemeToggle variant="navbar" />

            {currentUser ? (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className="px-2.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-400 text-xs font-bold"
              >
                Portal
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="btn-primary text-xs font-bold px-3 py-1.5 rounded-full min-h-0 h-7"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-on-surface dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-slate-800 focus:outline-none transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary dark:text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border-b border-outline-variant/30 dark:border-slate-800 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {/* Theme Selector Pill in Mobile Menu */}
              <div className="pb-2 border-b border-outline-variant/30 dark:border-slate-800">
                <ThemeToggle variant="pill" />
              </div>

              {/* Quick Actions Bar in Drawer */}
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-outline-variant/30 dark:border-slate-800">
                <button
                  onClick={() => {
                    handleNavClick('pass');
                  }}
                  className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Digital Pass</span>
                </button>
                <button
                  onClick={() => {
                    setIsIncidentModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-tertiary/10 dark:bg-amber-950/60 text-tertiary dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Delay</span>
                </button>
              </div>

              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-left px-4 py-3 rounded-2xl font-medium text-base transition-all min-h-[48px] flex items-center ${isActive
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : 'text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 active:bg-surface-container-high'
                      }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex flex-col space-y-2">
                <p className="text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase px-2 font-bold tracking-wider">Command Portals</p>
                <button
                  onClick={() => handleNavClick('user-dashboard')}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-primary dark:text-blue-400 hover:bg-primary/5 dark:hover:bg-blue-950/40 active:bg-primary/10 flex items-center space-x-2.5 min-h-[48px]"
                >
                  <User className="w-4 h-4" />
                  <span>Passenger Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-primary dark:text-blue-400 hover:bg-primary/5 dark:hover:bg-blue-950/40 active:bg-primary/10 flex items-center space-x-2.5 min-h-[48px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fleet Command Center</span>
                </button>
                <button
                  onClick={() => handleNavClick('ai-insights')}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-primary-container dark:text-cyan-400 hover:bg-primary/5 dark:hover:bg-blue-950/40 active:bg-primary/10 flex items-center space-x-2.5 min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Insights Terminal</span>
                </button>
                <button
                  onClick={() => handleNavClick('analytics')}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-primary dark:text-cyan-400 hover:bg-primary/5 dark:hover:bg-blue-950/40 active:bg-primary/10 flex items-center space-x-2.5 min-h-[48px]"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Transit Analytics</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full max-w-[100vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-outline-variant/40 dark:border-slate-800 z-40 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg shadow-black/5 dark:shadow-black/40 box-border select-none"
        aria-label="Mobile Bottom Navigation"
        style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}
      >
        <div className="w-full flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isAi ? isAiCopilotOpen : currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAi) {
                    toggleAiCopilot();
                  } else {
                    handleNavClick(item.id);
                  }
                }}
                className={`flex-1 min-w-0 max-w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 min-h-[48px] active:scale-95 ${isActive
                    ? 'text-primary dark:text-cyan-400 font-bold bg-primary/10 dark:bg-cyan-950/40'
                    : 'text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400'
                  }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{ flex: 1, minWidth: 0 }}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-2'}`} />
                  {item.isAi && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse absolute -top-1 -right-1.5 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <span
                  className={`text-[11px] leading-tight mt-1 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-0.5 ${isActive ? 'font-bold font-label' : 'font-medium'
                    }`}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
