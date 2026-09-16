import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Route as RouteIcon, 
  Users, 
  Wrench, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  Activity,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AiAssistantModal from '../components/AiAssistantModal';

export default function AiInsights({ setCurrentPage, currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('ai-insights');
  const [activeInsightNotice, setActiveInsightNotice] = useState(null);
  const [mobileView, setMobileView] = useState('chat'); // 'chat' | 'insights' on mobile screens

  const insights = [
    {
      id: 'route-opt',
      title: 'Route Optimization',
      alert: 'Alert: Route 3 frequent delays',
      alertColor: 'text-error',
      badgeBg: 'bg-error-container text-on-error-container',
      icon: RouteIcon,
      desc: 'AI detects a 15% increase in transit time on Route 3 during peak hours due to unpredicted traffic patterns near downtown.',
      btnText: 'Analyze Alternatives',
      actionPrompt: 'What detour options are available for Route 3 delays?'
    },
    {
      id: 'passenger-demand',
      title: 'Passenger Demand',
      alert: 'Insight: Route 5 peak capacity 92%',
      alertColor: 'text-primary font-semibold',
      badgeBg: 'bg-secondary-container text-on-secondary-container',
      icon: Users,
      desc: 'Predictive models indicate Route 5 will exceed comfortable capacity by 4:00 PM today. Recommend deploying an additional articulated bus.',
      btnText: 'Deploy Asset',
      actionPrompt: 'Deploy spare articulated bus to Route 5 for afternoon peak'
    },
    {
      id: 'maintenance-pred',
      title: 'Maintenance Prediction',
      alert: 'Warning: Bus 108 due soon',
      alertColor: 'text-tertiary font-semibold',
      badgeBg: 'bg-tertiary-container text-on-tertiary-container',
      icon: Wrench,
      desc: 'Telemetry from Engine 108 shows early signs of hydraulic pressure drop. Preventive maintenance recommended within 48 hours to avoid on-route failure.',
      btnText: 'Schedule Service',
      actionPrompt: 'Schedule preventive maintenance for Bus 108 in Bay 3'
    }
  ];

  return (
    <div className="font-body text-on-surface dark:text-slate-100 bg-background dark:bg-[#0b1120] flex min-h-screen transition-colors duration-300 w-full max-w-full overflow-x-hidden">
      {/* Side Navigation Bar */}
      <Sidebar 
        currentPage="ai-insights" 
        setCurrentPage={setCurrentPage} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-3 sm:p-6 md:p-margin-desktop min-h-screen pt-18 md:pt-10 pb-20 md:pb-10 animate-fade-up w-full max-w-full overflow-x-hidden box-border">
        {/* Mobile View Switcher (Visible ONLY on mobile devices < md) */}
        <div className="md:hidden mb-3.5 flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-surface-container-low dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileView('chat')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'chat'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Co-Pilot Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('insights')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'insights'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Fleet Alerts (3)</span>
          </button>
        </div>

        {/* Hero Section — Desktop always visible, mobile only when 'insights' view is active */}
        <section className={`mb-4 sm:mb-8 md:mb-10 glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-12 relative overflow-hidden border border-white/70 dark:border-slate-750/70 shadow-xl shadow-primary/5 dark:shadow-black/40 transition-colors duration-300 w-full max-w-full box-border ${
          mobileView === 'chat' ? 'hidden md:block' : 'block'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 text-[11px] sm:text-xs font-label font-bold mb-2 sm:mb-4 uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Kinetic Intelligence Engine</span>
              </div>
              <h2 className="font-headline font-extrabold text-xl sm:text-3xl md:text-5xl text-primary dark:text-cyan-400 mb-2 sm:mb-4 tracking-tight">
                SmartBus Intelligence
              </h2>
              <p className="font-body text-xs sm:text-sm md:text-base text-on-surface-variant dark:text-slate-400 max-w-2xl leading-relaxed">
                Turn transportation data into better decisions. Our predictive AI models analyze real-time telemetry, historical routing, and passenger flow to optimize urban transit dynamically.
              </p>
            </div>

            {/* Glowing AI Orb */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center shadow-inner relative shrink-0">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/40 pulse-blue">
                <BrainCircuit className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
            </div>
          </div>
        </section>

        {/* Notification Toast if action clicked */}
        {activeInsightNotice && (
          <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 bg-primary text-white rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in duration-200 w-full max-w-full box-border">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold truncate">{activeInsightNotice}</span>
            </div>
            <button 
              type="button"
              onClick={() => setActiveInsightNotice(null)}
              className="text-xs text-white/80 hover:text-white underline ml-3 shrink-0 min-h-[40px] flex items-center"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Predictive Insights Grid (Bento Style) — Desktop always visible, mobile only when 'insights' view is active */}
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 mb-6 sm:mb-10 md:mb-12 w-full max-w-full box-border ${
          mobileView === 'chat' ? 'hidden md:grid' : 'grid'
        }`}>
          {insights.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id} 
                className="glass-panel dark:bg-slate-850/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 flex flex-col justify-between card-hover border border-white/70 dark:border-slate-750/70 group transition-colors duration-300 w-full max-w-full box-border"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2.5 sm:mb-4">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center ${card.badgeBg} shadow-xs shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-headline font-bold text-sm sm:text-base md:text-lg text-on-surface dark:text-slate-100 truncate">
                      {card.title}
                    </h3>
                  </div>

                  <p className={`text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${card.alertColor}`}>
                    {card.alert}
                  </p>
                  <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 font-body leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-outline-variant/20 dark:border-slate-800 flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveInsightNotice(`Action dispatched: "${card.btnText}" for ${card.title}.`);
                      // Automatically switch to chat view on mobile so user sees the AI assistant
                      setMobileView('chat');
                    }}
                    className="text-primary dark:text-cyan-400 text-xs sm:text-sm font-bold flex items-center hover:text-primary-container dark:hover:text-cyan-300 group-hover:translate-x-1 transition-all min-h-[40px]"
                  >
                    <span>{card.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* Interactive AI Assistant Console — Desktop always visible, mobile visible when 'chat' view is active */}
        <section className={`mb-6 sm:mb-12 w-full max-w-full box-border ${
          mobileView === 'insights' ? 'hidden md:block' : 'block'
        }`}>
          {/* Header */}
          <div className="mb-2 sm:mb-4">
            <h3 className="font-headline font-bold text-lg sm:text-2xl text-on-surface dark:text-slate-100">
              Ask SmartBus AI
            </h3>
            <p className="text-[11px] sm:text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
              Live conversational querying into fleet dispatch and real-time operations.
            </p>
          </div>

          <AiAssistantModal />
        </section>
      </main>
    </div>
  );
}
