import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  MapPin, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Navigation, 
  Volume2, 
  VolumeX, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

/**
 * Plays a pleasant double-tone transit arrival chime using Web Audio API
 */
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // First high note (660Hz E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second harmonious note (880Hz A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.001, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.22, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch (err) {
    // Graceful fallback if audio is blocked
  }
}

export default function SmartStopAlert({
  alert,
  onDismiss,
  busNumber = 'Bus 21A',
  soundEnabled = true
}) {
  const [soundMuted, setSoundMuted] = useState(!soundEnabled);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!alert) return;

    if (!soundMuted) {
      playChimeSound();
    }

    // Auto-progress bar over 12 seconds
    const startTime = Date.now();
    const duration = 12000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (onDismiss) onDismiss();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [alert, onDismiss, soundMuted]);

  if (!alert) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-cyan-400/80 dark:border-cyan-400 shadow-cyan-500/20 dark:shadow-cyan-500/30 overflow-hidden relative backdrop-blur-xl">
        {/* Glow ambient background aura */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3">
            {/* Animated ringing bell icon */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-cyan-400/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center ring-4 ring-cyan-400/20 animate-bounce">
                <Bell className="w-6 h-6 animate-[spin_1.2s_ease-in-out_infinite]" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping" />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/15 text-primary dark:text-cyan-400 text-[10px] font-label font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Smart Proximity Alert</span>
              </div>
              <h3 className="font-headline font-black text-base sm:text-lg text-on-surface dark:text-slate-100 tracking-tight mt-0.5">
                Your stop is approaching!
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 rounded-xl text-outline hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              title={soundMuted ? 'Unmute arrival chime' : 'Mute arrival chime'}
              aria-label="Toggle chime sound"
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-500" />}
            </button>
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-xl text-outline hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              title="Dismiss alert"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Station Details Card */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-surface-container-low/90 dark:bg-slate-800/90 border border-outline-variant/30 dark:border-slate-700/80 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <span className="p-2 rounded-xl bg-primary text-white shrink-0 shadow-md shadow-primary/25">
                <MapPin className="w-4 h-4 text-cyan-300" />
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-label uppercase tracking-wider text-outline dark:text-slate-400 block font-bold">
                  Destination Stop
                </span>
                <p className="font-headline font-black text-sm sm:text-base text-on-surface dark:text-slate-100 truncate">
                  {alert.stopName || 'Selected Terminal'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-label uppercase tracking-wider text-outline dark:text-slate-400 block font-bold">
                Distance
              </span>
              <p className="font-headline font-black text-sm sm:text-base text-primary dark:text-cyan-400">
                {alert.distanceKm ? `${alert.distanceKm} km` : '< 1.5 km'}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-outline-variant/20 dark:border-slate-750 flex items-center justify-between text-xs">
            <p className="text-on-surface-variant dark:text-slate-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Get ready to exit on <strong className="text-primary dark:text-cyan-300">{busNumber}</strong>.</span>
            </p>
          </div>
        </div>

        {/* Exit Guidance Checklist */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant dark:text-slate-400 relative z-10 font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Check your belongings</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Have your pass ready</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center gap-2 relative z-10">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 px-4 rounded-xl btn-primary text-xs font-bold shadow-md shadow-primary/20 flex items-center justify-center space-x-2 active:scale-98 transition-all"
          >
            <span>Got it, I'm ready to exit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Auto-Dismiss Progress Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-high dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
