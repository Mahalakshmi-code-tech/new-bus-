import React, { useState } from 'react';
import { 
  Bus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Satellite, 
  User, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { useAuth } from '../context/AuthContext';
import { validateLoginCredentials } from '../utils/validation';

export default function Login({ setCurrentPage, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('operator@smartbus.city');
  const [password, setPassword] = useState('TransitPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState('admin');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate inputs
    const validation = validateLoginCredentials({ email, password });
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError);
      return;
    }

    const userData = {
      name: role === 'admin' ? 'Chief Dispatcher' : 'Alex Commuter',
      email: email.trim(),
      role: role
    };

    const authenticatedUser = login(userData, role, rememberMe);
    if (onLoginSuccess) {
      onLoginSuccess(authenticatedUser);
    }
    setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  };

  const handleQuickLogin = (selectedRole) => {
    setErrorMessage(null);
    const userData = {
      name: selectedRole === 'admin' ? 'Chief Dispatcher' : 'Alex Commuter',
      email: selectedRole === 'admin' ? 'operator@smartbus.city' : 'alex@commuter.transit',
      role: selectedRole
    };
    const authenticatedUser = login(userData, selectedRole, true);
    if (onLoginSuccess) {
      onLoginSuccess(authenticatedUser);
    }
    setCurrentPage(selectedRole === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  };

  return (
    <div className="min-h-screen min-h-dvh w-full overflow-y-auto flex selection:bg-primary-container selection:text-white bg-surface dark:bg-[#0b1120] animate-fade-up">
      {/* Left Side: Branding & Kinetic Graphic Canvas (Hidden on Mobile/Tablet Portrait) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low dark:bg-[#080d1a] overflow-hidden items-center justify-center p-12 min-h-screen">
        {/* Background Ambient Map */}
        <div className="absolute inset-0 opacity-40">
          <LiveMap height="h-full" showOverlay={false} />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low dark:from-[#080d1a] via-transparent to-primary/20 pointer-events-none"></div>
        </div>

        {/* Branding Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_bus
              </span>
            </div>
            <h1 className="font-headline font-black text-4xl text-primary dark:text-cyan-400 tracking-tight">SmartBus</h1>
          </div>

          <p className="font-body text-base text-on-surface-variant dark:text-slate-400 leading-relaxed max-w-md">
            Command your transit ecosystem. Connect seamlessly to the flow of the city with predictive intelligence and real-time kinetic routing.
          </p>

          {/* Floating Glass Card Accent */}
          <div className="mt-10 p-5 rounded-3xl glass-panel dark:bg-slate-900/90 shadow-xl shadow-primary/10 dark:shadow-black/40 flex items-center space-x-4 border border-white/80 dark:border-slate-750 transform -rotate-1 hover:rotate-0 transition-transform duration-300 card-hover">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 dark:bg-primary/25 flex items-center justify-center text-primary dark:text-cyan-400">
              <Satellite className="w-6 h-6 animate-spin duration-1000" style={{ animationDuration: '8s' }} />
            </div>
            <div className="text-left">
              <p className="font-label text-[11px] uppercase tracking-wider text-primary dark:text-cyan-400 font-bold">System Status</p>
              <p className="font-headline font-bold text-sm text-on-surface dark:text-slate-100">Telemetry Synchronized • 100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-surface dark:bg-[#0b1120] min-h-screen transition-colors duration-300">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10 py-6">
          {/* Back button */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-cyan-400 transition-colors focus:outline-none group min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Public Website</span>
          </button>

          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_bus
              </span>
            </div>
            <h1 className="font-headline font-black text-2xl text-primary dark:text-cyan-400 tracking-tight">SmartBus</h1>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface dark:text-slate-100 tracking-tight">
              Welcome Back
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
              Access your command center or passenger portal.
            </p>
          </div>

          {/* Error Message Toast if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-error/10 border border-error/30 text-error dark:text-red-400 flex items-center space-x-2.5 text-xs animate-fade-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 bg-surface-container-low dark:bg-slate-800 p-1.5 rounded-2xl border border-outline-variant/30 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setEmail('operator@smartbus.city');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 active:scale-95 min-h-[44px] ${
                role === 'admin'
                  ? 'btn-primary shadow-md shadow-primary/20'
                  : 'text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin / Dispatch</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('user');
                setEmail('alex@commuter.transit');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 active:scale-95 min-h-[44px] ${
                role === 'user'
                  ? 'btn-primary shadow-md shadow-primary/20'
                  : 'text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Passenger Portal</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="font-label text-[11px] sm:text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-300 font-bold block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label text-[11px] sm:text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-300 font-bold block" htmlFor="password">
                  Password
                </label>
                <a href="#forgot" className="font-label text-[11px] sm:text-xs text-primary dark:text-cyan-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl text-sm text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 focus:outline-none p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs text-on-surface-variant dark:text-slate-400 cursor-pointer min-h-[44px]">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary border-outline-variant w-4 h-4"
                />
                <span>Remember me on this terminal</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center py-3.5 sm:py-4 px-6 rounded-full font-body font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-cyan-400/40 group"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">Instant Demo Access:</p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-4 py-2.5 bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-xs font-bold text-primary dark:text-cyan-400 rounded-xl transition-all active:scale-95 min-h-[44px] flex items-center justify-center border border-transparent dark:border-slate-700"
              >
                1-Click Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="px-4 py-2.5 bg-secondary-container/60 dark:bg-slate-800 hover:bg-secondary-container text-xs font-bold text-on-secondary-container dark:text-slate-300 rounded-xl transition-all active:scale-95 min-h-[44px] flex items-center justify-center border border-transparent dark:border-slate-700"
              >
                1-Click Passenger Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
