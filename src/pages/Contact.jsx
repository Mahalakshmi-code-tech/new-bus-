import React, { useState } from 'react';
import { 
  Send, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  Headphones,
  Radio,
  Loader2,
  AlertCircle,
  Bus,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Activity,
  Navigation
} from 'lucide-react';
import LiveMap from '../components/LiveMap';

export default function Contact({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message or question.');
      return;
    }

    // Trigger loading state
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const randomId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionId(randomId);

      // Auto clear form fields
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 700);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  const handleCopy = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <main className="pt-24 sm:pt-32 pb-24 md:pb-28 px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto relative z-10 min-h-screen">
      {/* Dynamic Ambient Background Elements (Deep Navy + Electric Blue + Cyan) */}
      <div className="absolute top-0 right-0 w-80 sm:w-[540px] h-80 sm:h-[540px] bg-gradient-to-b from-blue-600/10 to-cyan-400/5 dark:from-blue-600/15 dark:to-cyan-400/10 rounded-full blur-[110px] -z-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-12 left-0 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-gradient-to-tr from-[#0050cb]/10 to-cyan-500/10 dark:from-[#003882]/20 dark:to-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none transform -translate-x-1/4"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-radial from-blue-500/5 via-transparent to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Header Section */}
      <header className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto space-y-4 animate-fade-up">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-[#0c172a] border border-blue-200/80 dark:border-cyan-500/30 text-primary dark:text-cyan-300 text-xs font-label font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:border-cyan-400/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 dark:bg-cyan-400"></span>
          </span>
          <Headphones className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
          <span>Metropolis Dispatch Network</span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">|</span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 normal-case tracking-normal">
            24/7 Operations Command
          </span>
        </div>

        {/* Hero Title with Kinetic Gradient Accent */}
        <h1 className="font-headline font-extrabold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Let’s{' '}
          <span className="bg-gradient-to-r from-[#0050cb] via-[#0066ff] to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-cyan-200 bg-clip-text text-transparent">
            Connect.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="font-body text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Have questions about routes, schedules, or our AI-driven transit technology? Our command center is ready to assist you.
        </p>

        {/* Minimal Telemetry Ribbon */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-label text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-slate-700 dark:text-slate-200 font-semibold">Response Time:</span> &lt; 3 mins
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span className="text-slate-700 dark:text-slate-200 font-semibold">Telemetry Status:</span> 99.9% Nominal
          </span>
        </div>
      </header>

      {/* Two-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (7 cols): Contact Form */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-[#0c1527]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-blue-950/5 dark:shadow-2xl dark:shadow-black/50 border border-slate-200/80 dark:border-cyan-500/20 relative overflow-hidden transition-all duration-300 card-hover">
          {/* Top Cyan Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"></div>

          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <h2 className="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white">
                Send a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Route an inquiry directly to our transit operations dispatch.
              </p>
            </div>
            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800/80 items-center justify-center text-primary dark:text-cyan-400 border border-blue-100 dark:border-slate-700">
              <Send className="w-4 h-4" />
            </div>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 sm:p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/70 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm animate-fade-up">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setErrorMessage(null)} 
                className="text-red-500 hover:text-red-700 dark:hover:text-red-200 text-xs font-bold px-1.5 py-0.5"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Submission Success View */}
          {isSubmitted ? (
            <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-b from-blue-50/80 via-white to-cyan-50/50 dark:from-[#0d1c33] dark:via-[#0c172a] dark:to-[#081220] border border-blue-200/80 dark:border-cyan-500/30 rounded-2xl text-center space-y-4 animate-fade-up">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-[#0050cb] to-cyan-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/70 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold border border-cyan-300/60 dark:border-cyan-500/40">
                  Ticket ID: {submissionId}
                </span>
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Message Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900 dark:text-white">{formData.name || 'Commuter'}</strong>. Our operations command team has received your ticket and logged it into our real-time transit queue.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all shadow-sm active:scale-98"
                >
                  Send Another Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('tracking')}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/30 text-xs font-bold hover:bg-primary/20 transition-all"
                >
                  Return to Live Tracking →
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label 
                    className="flex items-center justify-between font-label text-[11px] sm:text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold" 
                    htmlFor="name"
                  >
                    <span>Full Name <span className="text-cyan-600 dark:text-cyan-400">*</span></span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                    className="w-full bg-slate-50/90 dark:bg-[#091120] border border-slate-200/90 dark:border-slate-800 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0c172a] focus:border-[#0066ff] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label 
                    className="flex items-center justify-between font-label text-[11px] sm:text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold" 
                    htmlFor="email"
                  >
                    <span>Email Address <span className="text-cyan-600 dark:text-cyan-400">*</span></span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    autoComplete="email"
                    inputMode="email"
                    className="w-full bg-slate-50/90 dark:bg-[#091120] border border-slate-200/90 dark:border-slate-800 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0c172a] focus:border-[#0066ff] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label 
                    className="flex items-center justify-between font-label text-[11px] sm:text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold" 
                    htmlFor="phone"
                  >
                    <span>Phone Number</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full bg-slate-50/90 dark:bg-[#091120] border border-slate-200/90 dark:border-slate-800 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0c172a] focus:border-[#0066ff] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label 
                    className="flex items-center justify-between font-label text-[11px] sm:text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold" 
                    htmlFor="subject"
                  >
                    <span>Subject</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Route Inquiry / AI Feedback"
                    className="w-full bg-slate-50/90 dark:bg-[#091120] border border-slate-200/90 dark:border-slate-800 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0c172a] focus:border-[#0066ff] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-cyan-400/20 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label 
                  className="flex items-center justify-between font-label text-[11px] sm:text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold" 
                  htmlFor="message"
                >
                  <span>Message <span className="text-cyan-600 dark:text-cyan-400">*</span></span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Min. 10 characters</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our dispatch command center assist your commute today?"
                  className="w-full bg-slate-50/90 dark:bg-[#091120] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0c172a] focus:border-[#0066ff] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-cyan-400/20 transition-all duration-200 outline-none resize-y min-h-[110px]"
                ></textarea>
              </div>

              {/* Submit Button with Dynamic States */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full sm:w-auto min-h-[48px] px-8 py-3.5 sm:py-4 rounded-full font-body font-bold text-sm text-white bg-gradient-to-r from-[#0050cb] via-[#0066ff] to-cyan-500 hover:from-[#0042a8] hover:via-[#0055d4] hover:to-cyan-400 shadow-lg shadow-blue-600/20 dark:shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none select-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>Dispatching Ticket...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-cyan-200" />
                    </>
                  )}
                </button>

                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mx-auto sm:mx-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                  Encrypted Transit Network Protocol
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Right Column (5 cols): Command Center Info & Live Radar Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-white/95 dark:bg-[#0c1527]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-950/5 dark:shadow-2xl dark:shadow-black/50 border border-slate-200/80 dark:border-cyan-500/20 space-y-5 sm:space-y-6 card-hover transition-all duration-300">
            {/* Command Center Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="font-headline font-bold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Command Center</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Centralized Operations Hub
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-label font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-200/70 dark:border-cyan-500/30 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
                ACTIVE NODE
              </span>
            </div>

            {/* Contact Details List */}
            <ul className="space-y-3 sm:space-y-3.5">
              {/* Headquarters */}
              <li className="group flex items-start gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#091120]/80 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400/40 dark:hover:border-cyan-400/40 hover:bg-white dark:hover:bg-[#0c172a] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 shrink-0 border border-blue-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-200">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                    Global Headquarters
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
                    100 Transit Plaza, Tech District<br />Metropolis, NY 10001
                  </p>
                </div>
              </li>

              {/* Email */}
              <li className="group flex items-start gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#091120]/80 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400/40 dark:hover:border-cyan-400/40 hover:bg-white dark:hover:bg-[#0c172a] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 shrink-0 border border-blue-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-200">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                    General Inquiries
                  </p>
                  <div className="flex items-center gap-2">
                    <a 
                      href="mailto:support@smartbus.transit"
                      className="text-xs sm:text-sm font-semibold text-[#0050cb] dark:text-cyan-300 hover:underline truncate"
                    >
                      support@smartbus.transit
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('support@smartbus.transit', 'email')}
                      className="p-1 rounded-md text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                      title="Copy email"
                      aria-label="Copy email address"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </li>

              {/* Phone */}
              <li className="group flex items-start gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#091120]/80 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400/40 dark:hover:border-cyan-400/40 hover:bg-white dark:hover:bg-[#0c172a] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 shrink-0 border border-blue-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-200">
                  <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                    24/7 Operations Dispatch
                  </p>
                  <div className="flex items-center gap-2">
                    <a 
                      href="tel:+18005557433"
                      className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-300"
                    >
                      +1 (800) 555-RIDE
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('+1 (800) 555-7433', 'phone')}
                      className="p-1 rounded-md text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                      title="Copy phone number"
                      aria-label="Copy phone number"
                    >
                      {copiedKey === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </li>

              {/* SmartBus Support & Mobility Assist */}
              <li className="group flex items-start gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#091120]/80 border border-slate-200/60 dark:border-slate-800/80 hover:border-cyan-400/40 dark:hover:border-cyan-400/40 hover:bg-white dark:hover:bg-[#0c172a] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-400 shrink-0 border border-blue-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-200">
                  <Bus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                    SmartBus Support
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    Real-Time Fleet Routing & Passenger Assist
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Visualizer Card */}
          <div className="bg-white/95 dark:bg-[#0c1527]/90 backdrop-blur-xl rounded-3xl p-3 sm:p-3.5 shadow-xl shadow-blue-950/5 dark:shadow-2xl dark:shadow-black/50 border border-slate-200/80 dark:border-cyan-500/20 overflow-hidden card-hover transition-all duration-300">
            <div className="relative rounded-2xl overflow-hidden">
              <LiveMap 
                selectedBus="HQ Dispatch Node"
                routeName="Metropolis Command Hub"
                height="h-48 sm:h-56"
                showOverlay={false}
              />
              {/* Overlay Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-label font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                HQ Telemetry Radar
              </div>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-500" />
                  Live Network Active
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                  Metropolis Hub GPS Telemetry
                </span>
              </div>
              <button 
                onClick={() => setCurrentPage('tracking')}
                className="group text-xs font-bold text-[#0050cb] dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 min-h-[44px] flex items-center gap-1 transition-colors"
                aria-label="View Full Map"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
