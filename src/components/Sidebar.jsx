import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Route as RouteIcon, 
  Sparkles, 
  Users, 
  Calendar, 
  Wrench, 
  LogOut, 
  ArrowLeft,
  ShieldCheck,
  Navigation,
  Menu,
  X,
  User
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  activeTab, 
  setActiveTab,
  onLogout 
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isAdmin = currentPage === 'admin-dashboard';
  const isUser = currentPage === 'user-dashboard';
  const isAi = currentPage === 'ai-insights';

  const adminNavItems = [
    { id: 'dashboard', label: 'Fleet Overview', icon: LayoutDashboard },
    { id: 'tracking', label: 'Live GPS Radar', icon: Navigation, route: 'tracking' },
    { id: 'routes', label: 'Routes & Stops', icon: RouteIcon, route: 'routes' },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, route: 'ai-insights' },
    { id: 'drivers', label: 'Driver Rosters', icon: Users, route: 'features' },
    { id: 'schedules', label: 'Schedules', icon: Calendar, route: 'features' },
  ];

  const userNavItems = [
    { id: 'dashboard', label: 'Passenger Overview', icon: LayoutDashboard },
    { id: 'tracking', label: 'Live Bus Radar', icon: Navigation, route: 'tracking' },
    { id: 'routes', label: 'Browse Routes', icon: RouteIcon, route: 'routes' },
    { id: 'ai-insights', label: 'AI Assistant', icon: Sparkles, route: 'ai-insights' },
  ];

  const items = isAdmin ? adminNavItems : userNavItems;

  const handleItemClick = (item) => {
    setActiveTab(item.id);
    if (item.route) {
      setCurrentPage(item.route);
    }
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Bar for Portal Views */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-outline-variant/30 dark:border-slate-800 z-50 px-4 py-3 flex justify-between items-center h-16 shadow-xs">
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 text-primary dark:text-blue-400 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-headline font-black text-lg">SmartBus</span>
        </button>

        <div className="flex items-center space-x-2">
          <ThemeToggle variant="navbar" />
          <span className="text-xs font-label uppercase font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-400 px-2.5 py-1 rounded-full">
            {isAdmin ? 'Admin' : 'Passenger'}
          </span>
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-on-surface dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Portal Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Portal Slide-out Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex justify-start animate-in fade-in duration-150">
          <div className="w-72 max-w-[85vw] bg-surface dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
                  </div>
                  <span className="font-headline font-bold text-lg text-primary dark:text-blue-400">Command Menu</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Toggle Pill in Mobile Drawer */}
              <div className="mb-4">
                <ThemeToggle variant="pill" />
              </div>

              <div className="space-y-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[48px] ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-primary dark:hover:text-blue-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Website</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-error hover:bg-error-container/30 dark:hover:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen fixed top-0 left-0 bg-surface dark:bg-slate-900 border-r border-outline-variant/30 dark:border-slate-800 p-6 z-40 transition-colors duration-300">
        <div>
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2.5 mb-8 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_bus
              </span>
            </div>
            <div>
              <span className="font-headline font-black text-xl text-primary dark:text-blue-400 block leading-none">SmartBus</span>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-bold">
                {isAdmin ? 'Fleet Command' : 'Passenger Hub'}
              </span>
            </div>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25 font-bold'
                      : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-outline-variant/30 dark:border-slate-800 space-y-2">
          {/* Desktop Theme Toggle Pill */}
          <div className="mb-2">
            <ThemeToggle variant="pill" />
          </div>

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-error hover:bg-error-container/40 dark:hover:bg-red-950/40 transition-colors focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
