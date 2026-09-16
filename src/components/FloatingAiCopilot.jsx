import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  Bus,
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';
import {
  getCrowdLevel,
  getCrowdBadgeInfo,
  getSmartPassengerSuggestion
} from '../services/transitData';

export default function FloatingAiCopilot({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const {
    buses,
    routes,
    stops,
    digitalPass,
    isAiCopilotOpen,
    setIsAiCopilotOpen,
    notifications,
    explainNotificationTrigger
  } = useTransit();
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Sync with global isAiCopilotOpen state
  useEffect(() => {
    if (isAiCopilotOpen && !isOpen) {
      setIsOpen(true);
      setIsClosing(false);
    } else if (!isAiCopilotOpen && isOpen && !isClosing) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isAiCopilotOpen, isOpen, isClosing]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your **SmartBus AI Co-Pilot**. I'm connected to the city's real-time telemetry grid.\n\nAsk me about buses, live arrival ETAs, seat availability, crowd levels, or transit passes!",
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    { label: "Is Bus 21A crowded?", query: "Is Bus 21A crowded?" },
    { label: "Which bus has seats?", query: "Which bus has more seats right now?" },
    { label: "Less crowded route?", query: "Is there a less crowded route?" },
    { label: "Check ETA Bus 21A", query: "What is the live ETA for Bus 21A?" },
    { label: "Digital Pass Status", query: "Check my digital metro pass validity" }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleToggleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggleClose = () => {
    setIsClosing(true);
    setIsAiCopilotOpen(false);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const handleSend = (text = inputVal) => {
    const query = (typeof text === 'string' ? text : inputVal).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Context-aware AI responses using live transit data
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = null;

      const isAlertQuery = lower.includes('alert') || lower.includes('notification') || lower.includes('why did i get') || lower.includes('why this alert') || lower.includes('explain alert');
      const isCrowdOrSeats = lower.includes('crowd') || lower.includes('seat') || lower.includes('standing') || lower.includes('capacity') || lower.includes('full');
      const isMoreSeats = lower.includes('more seat') || lower.includes('most seat') || lower.includes('which bus has seat') || lower.includes('have seat') || lower.includes('any seat') || lower.includes('with seat');
      const isLessCrowdedRoute = lower.includes('less crowd') || lower.includes('least crowd') || lower.includes('alternate route') || lower.includes('quieter');
      const isRecommendBus = lower.includes('which bus should i take') || lower.includes('what bus should i take') || lower.includes('recommend a bus') || lower.includes('recommend bus') || lower.includes('best bus');

      if (isAlertQuery) {
        // Query: "Why did I get this alert?" / alert inquiries
        let targetNotif = null;
        if (notifications && notifications.length > 0) {
          if (lower.includes('21a')) {
            targetNotif = notifications.find(n => n.busId === 'bus-21a' || n.title?.includes('21A')) || notifications[0];
          } else if (lower.includes('101')) {
            targetNotif = notifications.find(n => n.busId === 'bus-101' || n.title?.includes('101')) || notifications[0];
          } else if (lower.includes('204')) {
            targetNotif = notifications.find(n => n.busId === 'bus-204' || n.title?.includes('204')) || notifications[0];
          } else {
            targetNotif = notifications[0];
          }
        }

        if (!targetNotif) {
          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "You currently have no active transit alerts in the Notification Center.\n\nSmart alerts are generated automatically when simulated vehicle ETAs drop below 5 minutes, corridor delays exceed 5 minutes, occupancy reaches 80%, or your selected destination stop is approaching.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        } else {
          const reasonText = targetNotif.simulatedReason || 
            (explainNotificationTrigger ? explainNotificationTrigger(targetNotif) : null) ||
            `This alert was generated based on live simulated fleet metrics and scheduled headway.`;

          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            type: 'card',
            text: `### 🔔 Transit Alert Explanation\n\n**Alert:** "${targetNotif.title}"\n\n${reasonText}\n\n*(Telemetry origin: SmartBus simulated headway & live route dispatch engine)*`,
            card: {
              title: targetNotif.title,
              subtitle: targetNotif.message,
              eta: targetNotif.type === 'approaching' ? '≤ 5 min' : 'Live',
              seats: targetNotif.type === 'crowd' ? 'Standing' : 'Available',
              crowd: targetNotif.type === 'crowd' ? 'High Load' : 'Nominal',
              speed: 'Simulated',
              load: targetNotif.type === 'crowd' ? '86%' : 'Scheduled',
              status: targetNotif.type?.toUpperCase() || 'TRANSIT ALERT',
              suggestion: 'Alert triggered directly from simulated transit telemetry.',
              actionText: targetNotif.action?.label || 'View in Live Tracking',
              actionTarget: targetNotif.action?.target || 'tracking'
            },
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      } else if (isMoreSeats) {
        // Query: "Which bus has more seats?"
        const activeBuses = buses.filter(b => b.status !== 'Out of Service');
        const sortedBySeats = [...activeBuses].sort((a, b) => (b.availableSeats ?? 0) - (a.availableSeats ?? 0));
        const bestBus = sortedBySeats[0] || buses[0];
        const secondBus = sortedBySeats[1];
        const bestBadge = getCrowdBadgeInfo(bestBus.crowdLevel || getCrowdLevel(bestBus.occupancyPercent ?? 50));

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `**${bestBus.number} (${bestBus.routeName})** currently has the most available seats in the active fleet with **${bestBus.availableSeats ?? 24} free seats** (${bestBus.occupancyPercent}% load, ${bestBadge.label}).\n\n` +
            (secondBus ? `Next best option: **${secondBus.number}** on ${secondBus.routeName} with **${secondBus.availableSeats ?? 18} seats** available.\n\n` : '') +
            `*(Live vehicle capacity derived from passenger flow simulation)*`,
          card: {
            title: `${bestBus.number} • ${bestBus.routeName}`,
            subtitle: `Next: ${bestBus.nextStop} (Approaching in ${bestBus.trafficAdjustedEtaMinutes} min)`,
            eta: `${bestBus.trafficAdjustedEtaMinutes} min`,
            seats: `${bestBus.availableSeats ?? 24}`,
            speed: `${bestBus.speedKmH} km/h`,
            load: `${bestBus.occupancyPercent}%`,
            crowd: bestBadge.shortLabel,
            status: bestBus.status || 'On Time',
            suggestion: getSmartPassengerSuggestion(bestBus.crowdLevel, bestBus.availableSeats),
            actionText: 'View on Live Map',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (isLessCrowdedRoute) {
        // Query: "Is there a less crowded route?"
        const activeBuses = buses.filter(b => b.status !== 'Out of Service');
        const sortedByOccupancy = [...activeBuses].sort((a, b) => (a.occupancyPercent ?? 50) - (b.occupancyPercent ?? 50));
        const leastCrowdedBus = sortedByOccupancy[0] || buses[0];
        const leastBadge = getCrowdBadgeInfo(leastCrowdedBus.crowdLevel || getCrowdLevel(leastCrowdedBus.occupancyPercent ?? 40));

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `Yes! The least crowded corridor right now is **${leastCrowdedBus.routeName} (Serving ${leastCrowdedBus.number})**.\n\n• **Occupancy Load:** ${leastCrowdedBus.occupancyPercent}%\n• **Available Seats:** ${leastCrowdedBus.availableSeats ?? 25} Seats\n• **Crowd Level:** ${leastBadge.label}\n\n💡 Boarding this corridor provides a noticeably calmer commute compared to high-density arterial routes.`,
          card: {
            title: `${leastCrowdedBus.number} • ${leastCrowdedBus.routeName}`,
            subtitle: `Approaching: ${leastCrowdedBus.nextStop}`,
            eta: `${leastCrowdedBus.trafficAdjustedEtaMinutes} min`,
            seats: `${leastCrowdedBus.availableSeats ?? 25}`,
            speed: `${leastCrowdedBus.speedKmH} km/h`,
            load: `${leastCrowdedBus.occupancyPercent}%`,
            crowd: leastBadge.shortLabel,
            status: 'Low Congestion',
            suggestion: '🟢 Plenty of seats available. Good time to board.',
            actionText: 'Explore This Route',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (isRecommendBus) {
        // Query: "Which bus should I take?"
        const activeBuses = buses.filter(b => b.status !== 'Out of Service');
        const recommendedBus = activeBuses.reduce((best, cur) => {
          const curScore = (cur.availableSeats ?? 15) * 2 - (cur.trafficAdjustedEtaMinutes ?? 10);
          const bestScore = (best.availableSeats ?? 15) * 2 - (best.trafficAdjustedEtaMinutes ?? 10);
          return curScore > bestScore ? cur : best;
        }, activeBuses[0] || buses[0]);

        const recBadge = getCrowdBadgeInfo(recommendedBus.crowdLevel || getCrowdLevel(recommendedBus.occupancyPercent ?? 50));

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `I recommend taking **${recommendedBus.number}** (${recommendedBus.routeName}).\n\nIt offers the ideal balance of fast arrival (**${recommendedBus.trafficAdjustedEtaMinutes} min ETA**) and guaranteed seat availability (**${recommendedBus.availableSeats ?? 20} seats free**, ${recBadge.label}).\n\n*(Continuously optimized based on real-time transit simulation)*`,
          card: {
            title: `${recommendedBus.number} • ${recommendedBus.routeName}`,
            subtitle: `Arriving at ${recommendedBus.nextStop} in ${recommendedBus.trafficAdjustedEtaMinutes} min`,
            eta: `${recommendedBus.trafficAdjustedEtaMinutes} min`,
            seats: `${recommendedBus.availableSeats ?? 20}`,
            speed: `${recommendedBus.speedKmH} km/h`,
            load: `${recommendedBus.occupancyPercent}%`,
            crowd: recBadge.shortLabel,
            status: recommendedBus.status || 'On Time',
            suggestion: getSmartPassengerSuggestion(recommendedBus.crowdLevel, recommendedBus.availableSeats),
            actionText: 'Track Recommended Bus',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (isCrowdOrSeats) {
        // Query: "Is Bus 21A crowded?" or general crowd inquiry
        let targetBus = buses.find(b => {
          const num = b.number.toLowerCase();
          return lower.includes(num) || lower.includes(num.replace('bus', '').trim());
        });
        if (!targetBus) {
          targetBus = buses.find(b => b.number.includes('21A')) || buses[0];
        }

        const crowdLevel = targetBus.crowdLevel || getCrowdLevel(targetBus.occupancyPercent ?? 60);
        const badge = getCrowdBadgeInfo(crowdLevel);
        const suggestion = getSmartPassengerSuggestion(crowdLevel, targetBus.availableSeats ?? 18);

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `Live seat & crowd report for **${targetBus.number}**:\n\n` +
            `• **Crowd Level:** ${badge.label} (${badge.subtext})\n` +
            `• **Available Seats:** ${targetBus.availableSeats ?? 18} Seats\n` +
            `• **Standing Passengers:** ${targetBus.standingPassengers ?? 4}\n` +
            `• **Total Occupancy:** ${targetBus.occupancyPercent ?? 65}%\n\n` +
            `💡 *Smart Advice:* ${suggestion}\n\n` +
            `*(Simulation telemetry auto-updates upon station arrivals)*`,
          card: {
            title: `${targetBus.number} • ${targetBus.routeName}`,
            subtitle: `Next: ${targetBus.nextStop} (Current: ${targetBus.currentStop})`,
            eta: `${targetBus.trafficAdjustedEtaMinutes} min`,
            seats: `${targetBus.availableSeats ?? 18}`,
            speed: `${targetBus.speedKmH} km/h`,
            load: `${targetBus.occupancyPercent}%`,
            crowd: badge.shortLabel,
            status: targetBus.status || 'On Time',
            suggestion: suggestion,
            actionText: 'Open Live Bus Tracker',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('21a') || (lower.includes('eta') && !lower.includes('101'))) {
        const bus21A = buses.find(b => b.number.includes('21A')) || buses[0];
        const badge = getCrowdBadgeInfo(bus21A.crowdLevel || getCrowdLevel(bus21A.occupancyPercent ?? 64));

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `Here is the live telemetry for **${bus21A.number}**:`,
          card: {
            title: `${bus21A.number} • Airport Express`,
            subtitle: `Next: ${bus21A.nextStop} (Current: ${bus21A.currentStop})`,
            eta: `${bus21A.trafficAdjustedEtaMinutes} min`,
            seats: `${bus21A.availableSeats ?? 18}`,
            speed: `${bus21A.speedKmH} km/h`,
            load: `${bus21A.occupancyPercent}%`,
            crowd: badge.shortLabel,
            status: 'On Time',
            suggestion: getSmartPassengerSuggestion(bus21A.crowdLevel, bus21A.availableSeats),
            actionText: 'View on Live Map',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('101') || lower.includes('find bus')) {
        const bus101 = buses.find(b => b.number.includes('101')) || buses[0];
        const badge = getCrowdBadgeInfo(bus101.crowdLevel || getCrowdLevel(bus101.occupancyPercent ?? 76));

        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `Located **${bus101.number}** on Central to College Terminal corridor:`,
          card: {
            title: `${bus101.number} • Central to College`,
            subtitle: `Approaching ${bus101.nextStop}`,
            eta: `${bus101.trafficAdjustedEtaMinutes} min`,
            seats: `${bus101.availableSeats ?? 12}`,
            speed: `${bus101.speedKmH} km/h`,
            load: `${bus101.occupancyPercent}%`,
            crowd: badge.shortLabel,
            status: 'On Time',
            suggestion: getSmartPassengerSuggestion(bus101.crowdLevel, bus101.availableSeats),
            actionText: 'Track Fleet Node',
            actionTarget: 'tracking'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('airport') || lower.includes('route')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: "The **Central Station ➔ Airport Express (Corridor 21A)** is running at optimal frequency:",
          card: {
            title: "Corridor 21A • Airport Express",
            subtitle: "14.2 km • Every 8 mins • 4 Connected Stations",
            eta: "8 min headway",
            speed: "42 km/h avg",
            load: "64% avg",
            status: "Low Congestion",
            actionText: "Explore Full Route",
            actionTarget: 'routes'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('pass') || lower.includes('metro pass')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: 'card',
          text: `Your **Digital Metro Pass** is active and verified:`,
          card: {
            title: digitalPass?.passId || "SB-METRO-2026-X889",
            subtitle: digitalPass?.passType || "Monthly All-Corridor Metro Pass",
            eta: "Valid to Sep 30",
            speed: "All Zones 1-4",
            load: `${digitalPass?.tripsCount || 42} Trips`,
            status: "Verified Active",
            actionText: "Open Pass Card",
            actionTarget: 'pass'
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `I processed your request regarding "${query}". All 118 buses and 85 routes in Metropolis are operating on schedule. Would you like to check a specific line like **Bus 21A** or **Route 101**?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button - tablet & desktop only */}
      <div className="hidden md:flex fixed bottom-6 right-5 lg:bottom-8 lg:right-8 z-40">
        <div className="relative group">
          <button
            onClick={() => {
              if (isOpen) handleToggleClose();
              else {
                setIsAiCopilotOpen(true);
                setIsOpen(true);
              }
            }}
            className="flex items-center gap-2 md:gap-2 lg:gap-2.5 px-3.5 py-2.5 md:px-3.5 md:py-2.5 lg:px-5 lg:py-3.5 rounded-full bg-gradient-to-r from-primary via-[#0066ff] to-cyan-500 text-white shadow-xl shadow-primary/35 hover:shadow-cyan-400/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30 backdrop-blur-md select-none mr-[env(safe-area-inset-right,0px)]"
            aria-label="Ask AI Co-Pilot"
            title="Ask AI Co-Pilot"
          >
            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white animate-pulse" />
            </div>
            <span className="text-xs lg:text-sm font-headline font-bold whitespace-nowrap">
              <span className="hidden lg:inline">Ask AI Co-Pilot</span>
              <span className="lg:hidden">Ask AI</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping absolute -top-0.5 -right-0.5" />
          </button>

          {/* Floating Tooltip */}
          {!isOpen && (
            <div className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white/10 hidden sm:block">
              Ask AI Co-Pilot
            </div>
          )}
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-[55] md:hidden animate-in fade-in duration-200"
          onClick={handleToggleClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Interactive Chat Window */}
      {isOpen && (
        <div
          className={`fixed left-3 right-3 bottom-[calc(68px+env(safe-area-inset-bottom,0px))] md:left-auto md:right-5 md:bottom-20 lg:right-8 lg:bottom-24 w-auto md:w-[390px] lg:w-[420px] max-w-[calc(100vw-24px)] md:max-w-none h-[70vh] md:h-[520px] lg:h-[550px] max-h-[calc(100dvh-96px)] bg-white/95 dark:bg-[#0c1527]/95 backdrop-blur-2xl rounded-3xl border border-outline-variant/40 dark:border-slate-750 shadow-2xl shadow-primary/20 dark:shadow-black/70 z-[60] flex flex-col overflow-hidden transition-all duration-250 ease-out origin-bottom box-border ${isClosing
              ? 'opacity-0 scale-95 translate-y-3 pointer-events-none'
              : 'opacity-100 scale-100 translate-y-0 animate-in zoom-in-95'
            }`}
          role="dialog"
          aria-modal="true"
          aria-label="SmartBus AI Assistant Chat Window"
        >
          {/* Chat Window Header */}
          <div className="p-4 border-b border-outline-variant/30 dark:border-slate-800 bg-surface-container-low/60 dark:bg-slate-850/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-xs sm:text-sm text-on-surface dark:text-white leading-tight">
                  SmartBus Co-Pilot
                </h4>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Telemetry Connected
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleClose}
              className="p-1.5 rounded-xl text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 space-y-3.5 hide-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${m.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-slate-200 border border-outline-variant/30 dark:border-slate-700/80 rounded-tl-none'
                    }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Rich Telemetry Card */}
                  {m.card && (
                    <div className="mt-2.5 pt-2 border-t border-white/15 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-primary dark:text-cyan-400">{m.card.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                          {m.card.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-300">{m.card.subtitle}</p>
                      <div className={`grid ${m.card.seats !== undefined ? 'grid-cols-4' : 'grid-cols-3'} gap-1 text-[10px] text-center pt-1`}>
                        <div className="bg-black/10 dark:bg-slate-900/60 p-1.5 rounded-lg">
                          <span className="text-slate-400 block text-[9px]">ETA</span>
                          <span className="font-bold text-primary dark:text-cyan-300">{m.card.eta}</span>
                        </div>
                        {m.card.seats !== undefined && (
                          <div className="bg-black/10 dark:bg-slate-900/60 p-1.5 rounded-lg">
                            <span className="text-slate-400 block text-[9px]">🪑 Seats</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.card.seats}</span>
                          </div>
                        )}
                        <div className="bg-black/10 dark:bg-slate-900/60 p-1.5 rounded-lg">
                          <span className="text-slate-400 block text-[9px]">{m.card.seats !== undefined ? 'Crowd' : 'Velocity'}</span>
                          <span className="font-bold text-primary dark:text-cyan-300 truncate block text-[9px]">{m.card.seats !== undefined ? (m.card.crowd || 'Low') : m.card.speed}</span>
                        </div>
                        <div className="bg-black/10 dark:bg-slate-900/60 p-1.5 rounded-lg">
                          <span className="text-slate-400 block text-[9px]">Load</span>
                          <span className="font-bold text-primary dark:text-cyan-300">{m.card.load}</span>
                        </div>
                      </div>
                      {m.card.suggestion && (
                        <div className="mt-1.5 p-2 rounded-xl bg-primary/5 dark:bg-slate-900/70 border border-primary/20 text-[10px] text-on-surface dark:text-slate-300 leading-snug">
                          💡 <strong>Suggestion:</strong> {m.card.suggestion}
                        </div>
                      )}
                      {m.card.actionTarget && onNavigate && (
                        <button
                          onClick={() => {
                            if (m.card.actionTarget === 'pass') {
                              onNavigate('home');
                            } else {
                              onNavigate(m.card.actionTarget);
                            }
                            handleToggleClose();
                          }}
                          className="w-full mt-2 py-1.5 rounded-xl bg-primary/10 dark:bg-cyan-500/15 text-primary dark:text-cyan-400 font-bold text-[11px] flex items-center justify-center gap-1 hover:bg-primary/20 transition-colors"
                        >
                          <span>{m.card.actionText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-outline dark:text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-on-surface-variant dark:text-slate-400 p-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>SmartBus AI is analyzing telemetry...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 border-t border-outline-variant/20 dark:border-slate-800 bg-surface-container-low/30 dark:bg-slate-850/40 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.query)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:text-cyan-400 transition-colors border border-outline-variant/20 dark:border-slate-700 shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-outline-variant/30 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about buses, routes, or ETAs..."
              className="flex-1 bg-surface-container-low dark:bg-slate-800 rounded-full px-4 py-2 text-xs text-on-surface dark:text-slate-100 placeholder:text-outline dark:placeholder:text-slate-400 outline-hidden border border-outline-variant/20 dark:border-slate-700"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 shadow-xs hover:scale-105 active:scale-95 transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
