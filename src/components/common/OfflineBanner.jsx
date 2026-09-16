import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isOnline, isSlow } = useNetworkStatus();
  const [showRestored, setShowRestored] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "Connection Restored" for 3.5 seconds
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showRestored && !isSlow) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md pointer-events-none transition-all duration-300">
      {!isOnline && (
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-amber-600/95 text-white shadow-xl backdrop-blur-md border border-amber-400/40 pointer-events-auto animate-fade-up">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold">Offline Mode Active</p>
            <p className="text-amber-100 text-[11px]">Using cached transit telemetry. Live GPS will resume once reconnected.</p>
          </div>
        </div>
      )}

      {showRestored && isOnline && (
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-emerald-600/95 text-white shadow-xl backdrop-blur-md border border-emerald-400/40 pointer-events-auto animate-fade-up">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold">Connection Restored</p>
            <p className="text-emerald-100 text-[11px]">Real-time GPS telemetry is re-synchronized.</p>
          </div>
        </div>
      )}

      {isOnline && isSlow && !showRestored && (
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-800/90 text-slate-200 text-xs shadow-lg backdrop-blur-md border border-slate-700 pointer-events-auto">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-[11px]">Slow network detected. Optimizing data stream.</span>
        </div>
      )}
    </div>
  );
}
