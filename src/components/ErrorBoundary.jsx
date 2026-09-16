import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';
import { monitoringService } from '../services/monitoringService';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log through sanitized monitoring service
    monitoringService.logError('ErrorBoundary', error, {
      componentStack: errorInfo?.componentStack?.slice(0, 300)
    });
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = 'home';
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 font-sans">
          <div className="max-w-lg w-full glass-card dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-outline-variant/40 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-fade-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-headline font-bold text-2xl text-on-surface dark:text-slate-100">
                Service Telemetry Notice
              </h2>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                An unexpected condition occurred while displaying this view. SmartBus core fleet dispatch and safety systems remain fully operational.
              </p>
            </div>

            {/* Development Mode Diagnostics only - stripped in production */}
            {isDev && this.state.error && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-left overflow-x-auto text-xs font-mono text-error dark:text-red-400 max-h-32 border border-error/20">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-3 flex flex-wrap gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-ghost px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
