import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  RefreshCw, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Navigation,
  Wrench,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  Bus,
  MapPin,
  Compass,
  Gauge
} from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export default function AiAssistantModal({ initialPrompt = '', onNavigate }) {
  const { notifications, explainNotificationTrigger } = useTransit();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      type: 'text',
      text: "Hello! I am **SmartBus Kinetic Intelligence**, your real-time transit co-pilot. I have live telemetry synchronized across **85 routes** and **118 active buses**.\n\nAsk me anything about routes, ETAs, bus telemetry, transit alerts, or travel recommendations!",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStep, setTypingStep] = useState(0); // For dynamic typing text
  const chatBottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested questions:
  const suggestedQuestions = [
    { title: "Why this alert?", prompt: "Why did I get this alert?" },
    { title: "Find a bus", prompt: "Find a bus heading to Central Station or Airport" },
    { title: "Check ETA", prompt: "Check ETA for Bus 21A at Guindy stop" },
    { title: "Best route", prompt: "What is the best route from Financial District to Tech Park?" },
    { title: "Bus status", prompt: "Show bus status and live telemetry for Bus 101" }
  ];

  // Auto-scroll chat smoothly on new messages or typing state
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isTyping]);

  // Typing animation cycle effect
  useEffect(() => {
    let timer;
    if (isTyping) {
      timer = setInterval(() => {
        setTypingStep(prev => (prev + 1) % 3);
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isTyping]);

  const handleSend = (textToSend = inputVal) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : inputVal.trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI Telemetry Intelligence Engine Response with Rich Cards support
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responsePayload = null;

      // 0. Alert reasoning query: "Why did I get this alert?"
      if (lower.includes('alert') || lower.includes('notification') || lower.includes('why did i get') || lower.includes('why this alert') || lower.includes('explain alert')) {
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
        const reason = targetNotif ? (targetNotif.simulatedReason || (explainNotificationTrigger ? explainNotificationTrigger(targetNotif) : null)) : null;
        responsePayload = {
          type: 'text',
          text: targetNotif
            ? `### 🔔 Transit Alert Explanation\n\n**Alert:** "${targetNotif.title}"\n\n${reason || 'Generated based on simulated transit telemetry and headway.'}\n\n*(Telemetry origin: SmartBus simulated headway & live route dispatch engine)*`
            : "No active transit alerts found in your notification center right now. Alerts are triggered by simulated timetable ETAs ≤ 5m, delays ≥ 4m, occupancy ≥ 80%, or destination stop proximity."
        };
      }
      // 1. "Check ETA" -> ETA Card
      else if (lower.includes('eta') || lower.includes('check eta') || lower.includes('arrive') || lower.includes('time')) {
        responsePayload = {
          type: 'eta_card',
          text: "Here is the real-time ETA telemetry for the approaching vehicle:",
          cardData: {
            busNumber: 'Bus 21A',
            route: 'Guindy ➔ Central Corridor',
            etaMinutes: 8,
            currentStop: 'Guindy Junction',
            destination: 'Airport Terminal',
            status: 'On Time',
            delay: '0 min',
            confidence: '99.4% GPS Precision'
          }
        };
      } 
      // 2. "Best route" or "Find a bus" -> Route Card
      else if (lower.includes('best route') || lower.includes('find a bus') || lower.includes('route') || lower.includes('direction')) {
        responsePayload = {
          type: 'route_card',
          text: "I analyzed the active metropolitan transit grid and found the optimal corridor with zero delays:",
          cardData: {
            routeNumber: 'Route 102 Express',
            from: 'Financial District Terminal',
            to: 'Tech Park Innovation Hub',
            distance: '12.1 km',
            duration: '25 min avg',
            activeBuses: 2,
            trafficCondition: 'Nominal Flow (Green)',
            savings: 'Saves 11 mins over local loop'
          }
        };
      } 
      // 3. "Bus status" -> Bus Status Card
      else if (lower.includes('bus status') || lower.includes('status') || lower.includes('telemetry') || lower.includes('101') || lower.includes('21a')) {
        responsePayload = {
          type: 'bus_status_card',
          text: "Live sensor telemetry feed synchronized from vehicle onboard IoT sensors:",
          cardData: {
            busNumber: 'Bus 101',
            plate: 'TN-01-SB-1010',
            status: 'Active • On Time',
            speed: '42 km/h',
            occupancyPercent: 68,
            occupancyLabel: 'Medium (34 / 50 seats)',
            driver: 'Sarah Jenkins',
            fuel: 'Zero-Emission EV',
            lastPing: 'Sub-second GPS synced'
          }
        };
      } 
      // 4. "Nearby stops" -> Text + Quick Station summary
      else if (lower.includes('nearby stops') || lower.includes('stops') || lower.includes('station')) {
        responsePayload = {
          type: 'text',
          text: "### 📍 Nearby Smart Stops within 500m\n\n1. **Guindy Metro Gate (120m)**\n• Serving: `Bus 21A`, `Bus 402`\n• Next Arrival: **Bus 21A in 8 mins**\n\n2. **Saidapet Transit Corridor (340m)**\n• Serving: `Bus 21A`, `Bus 101`\n• Next Arrival: **Bus 101 in 6 mins**\n\n3. **Civic Hub Station (480m)**\n• Serving: `Bus 204`\n• Next Arrival: **Bus 204 in 14 mins (Delayed +4m)**\n\nAll stations feature contactless digital pass scanners and sheltered waiting bays."
        };
      } 
      // 5. Default General Intelligence
      else {
        responsePayload = {
          type: 'text',
          text: `### 🛰️ Kinetic Fleet Telemetry\n\nI processed your request: *"${query}"*.\n\n• **Active Fleet Corridors**: 85 routes operating with 98.2% on-time reliability.\n• **Network Congestion Index**: Low across central expressways.\n• **Fleet Status**: 118 buses reporting active GPS telemetry.\n\nYou can click on any suggested prompt below or request specific bus timetables and detour analysis.`
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          type: responsePayload.type,
          text: responsePayload.text,
          cardData: responsePayload.cardData,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        type: 'text',
        text: "Chat context refreshed. **SmartBus Kinetic Intelligence** is ready for your next question.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Safe helper to render formatted markdown text
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, lineIdx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} className="font-headline font-bold text-xs sm:text-base text-primary dark:text-cyan-400 mt-1 mb-1.5 [overflow-wrap:anywhere] [word-break:break-word]">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={lineIdx} className="flex items-start space-x-2 my-1 text-xs sm:text-sm pl-0.5 [overflow-wrap:anywhere] [word-break:break-word]">
            <span className="text-primary dark:text-cyan-400 font-bold text-sm leading-none mt-0.5 shrink-0">•</span>
            <span className="flex-1 min-w-0 [overflow-wrap:anywhere] [word-break:break-word]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lineIdx} className="flex items-start space-x-2 my-1 text-xs sm:text-sm pl-0.5 [overflow-wrap:anywhere] [word-break:break-word]">
            <span className="text-primary dark:text-cyan-400 font-bold text-xs mt-0.5 shrink-0">{line.match(/^\d+\./)[0]}</span>
            <span className="flex-1 min-w-0 [overflow-wrap:anywhere] [word-break:break-word]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.replace(/^\d+\.\s*/, '')) }} />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={lineIdx} className="h-1.5" />;
      }
      return (
        <p 
          key={lineIdx} 
          className="text-xs sm:text-sm leading-relaxed my-0.5 font-body [overflow-wrap:anywhere] [word-break:break-word]"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} 
        />
      );
    });
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-on-surface dark:text-slate-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-surface-container dark:bg-slate-700/80 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-primary dark:text-cyan-400 font-bold">$1</code>');
  };

  return (
    <div className="w-full max-w-full md:max-w-4xl mx-auto glass-panel dark:bg-slate-900/90 rounded-3xl overflow-hidden flex flex-col h-[calc(100dvh-13rem)] min-h-[460px] md:h-[680px] border border-white/70 dark:border-slate-750/70 shadow-2xl shadow-primary/10 dark:shadow-black/50 transition-all duration-300 box-border">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-3.5 sm:p-4 md:p-5 px-4 sm:px-6 flex items-center justify-between text-white shrink-0 shadow-md">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30 shrink-0">
            <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h3 className="font-headline font-bold text-xs sm:text-base tracking-tight truncate">
                SmartBus AI Co-Pilot
              </h3>
              <span className="text-[8px] sm:text-[10px] font-label uppercase tracking-wider bg-cyan-400 text-[#001849] px-1.5 sm:px-2 py-0.5 rounded-full font-black neon-cyan-glow shrink-0">
                Kinetic v2.5
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-white/85 font-body truncate">
              Real-time Transit Intelligence & Rich Card Telemetry
            </p>
          </div>
        </div>

        {/* Reset & Status */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0 ml-2">
          <div className="hidden lg:flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-medium text-white/95">GPS Synced</span>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white backdrop-blur-sm transition-all focus:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Reset Chat History"
            aria-label="Reset Chat"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* 2. Chat Message Scrollable Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain overflow-x-hidden bg-surface-container-lowest/50 dark:bg-slate-950/60 space-y-3 sm:space-y-4 hide-scrollbar w-full max-w-full box-border"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Suggested Questions Grid on First View */}
        {messages.length <= 1 && (
          <div className="p-3.5 sm:p-5 md:p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-outline-variant/30 dark:border-slate-800 shadow-sm mb-3 animate-in fade-in duration-300 w-full max-w-full box-border">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-7 h-7 rounded-xl bg-primary/10 dark:bg-primary/25 text-primary dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-xs sm:text-sm text-on-surface dark:text-slate-100">
                  Ask SmartBus AI Assistant
                </h4>
                <p className="text-[10px] sm:text-xs text-on-surface-variant dark:text-slate-400">
                  Click a suggested query or type your own question below:
                </p>
              </div>
            </div>

            {/* Quick action buttons for the requested questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 w-full max-w-full">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q.prompt)}
                  className="p-2.5 sm:p-3 rounded-2xl bg-surface-container-low/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-750 border border-outline-variant/30 dark:border-slate-700/60 hover:border-primary/50 text-left transition-all duration-200 group flex items-center justify-between card-hover w-full max-w-full box-border"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
                      {q.title}
                    </p>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400 truncate mt-0.5">
                      {q.prompt}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-outline dark:text-slate-500 group-hover:text-primary dark:group-hover:text-cyan-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3.5 animate-in fade-in duration-200 w-full max-w-full box-border ${
                isAi ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* AI Avatar */}
              {isAi && (
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-primary-container text-white flex items-center justify-center shrink-0 shadow-sm border border-white/40 mt-0.5">
                  <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-xs transition-all overflow-hidden [overflow-wrap:anywhere] [word-break:break-word] break-words box-border ${
                  isAi
                    ? 'bg-white dark:bg-slate-850 text-on-surface dark:text-slate-100 rounded-tl-sm border border-outline-variant/30 dark:border-slate-700/60 shadow-sm'
                    : 'btn-primary text-white rounded-tr-sm shadow-md shadow-primary/20'
                }`}
              >
                {/* Standard Text or Intro */}
                {isAi && msg.text && (
                  <div className="space-y-1 text-xs sm:text-sm [overflow-wrap:anywhere] [word-break:break-word]">
                    {renderFormattedText(msg.text)}
                  </div>
                )}

                {/* Rich Response: ETA Card */}
                {isAi && msg.type === 'eta_card' && msg.cardData && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/40 dark:from-[#09152b] dark:to-[#081832] border border-blue-200 dark:border-cyan-500/30 text-on-surface dark:text-slate-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-label text-xs font-black text-primary dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        Live ETA Telemetry
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        ● {msg.cardData.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <h4 className="font-headline font-black text-lg sm:text-xl text-primary dark:text-cyan-300">
                          {msg.cardData.busNumber}
                        </h4>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                          {msg.cardData.route}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-label text-outline dark:text-slate-400 block font-bold">Arriving in</span>
                        <span className="font-headline font-black text-2xl text-primary dark:text-cyan-400">
                          {msg.cardData.etaMinutes} mins
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-blue-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">Next Stop:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{msg.cardData.currentStop}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 dark:text-slate-400 block">Accuracy:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{msg.cardData.confidence}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rich Response: Route Card */}
                {isAi && msg.type === 'route_card' && msg.cardData && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-[#0c1938] dark:to-[#081224] border border-blue-200 dark:border-blue-500/30 text-on-surface dark:text-slate-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-label text-xs font-black text-primary dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                        Optimal Transit Corridor
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-bold bg-blue-500/10 text-primary dark:text-cyan-300 border border-blue-500/30">
                        {msg.cardData.savings}
                      </span>
                    </div>

                    <h4 className="font-headline font-black text-base sm:text-lg text-primary dark:text-cyan-300 mb-2">
                      {msg.cardData.routeNumber}
                    </h4>

                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-850/80 border border-slate-200/60 dark:border-slate-800 text-xs mb-3 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-[10px] text-slate-500 uppercase block font-label">Start</span>
                        <span className="font-bold truncate">{msg.cardData.from}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="truncate text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-label">Destination</span>
                        <span className="font-bold truncate">{msg.cardData.to}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-blue-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {msg.cardData.distance} • {msg.cardData.duration}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {msg.cardData.activeBuses} Active Buses
                      </span>
                    </div>
                  </div>
                )}

                {/* Rich Response: Bus Status Card */}
                {isAi && msg.type === 'bus_status_card' && msg.cardData && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-[#09152b] dark:to-[#0c1830] border border-blue-200 dark:border-cyan-500/30 text-on-surface dark:text-slate-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
                        <span className="font-headline font-bold text-xs sm:text-sm text-primary dark:text-cyan-300">
                          {msg.cardData.busNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 px-1 bg-slate-200 dark:bg-slate-800 rounded">
                          {msg.cardData.plate}
                        </span>
                      </div>
                      <span className="text-[10px] font-label font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {msg.cardData.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center my-3">
                      <div className="bg-white/80 dark:bg-slate-800 p-2 rounded-xl">
                        <span className="text-[9px] uppercase font-label text-slate-400 block font-bold">Speed</span>
                        <span className="font-bold text-xs">{msg.cardData.speed}</span>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800 p-2 rounded-xl">
                        <span className="text-[9px] uppercase font-label text-slate-400 block font-bold">Occupancy</span>
                        <span className="font-bold text-xs text-primary dark:text-cyan-300">{msg.cardData.occupancyPercent}%</span>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800 p-2 rounded-xl">
                        <span className="text-[9px] uppercase font-label text-slate-400 block font-bold">Fleet Engine</span>
                        <span className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400">{msg.cardData.fuel}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                      <span>Driver: <strong className="text-slate-700 dark:text-slate-200">{msg.cardData.driver}</strong></span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">{msg.cardData.lastPing}</span>
                    </div>
                  </div>
                )}

                {/* User Message Rendering */}
                {!isAi && (
                  <p className="text-xs sm:text-sm font-body leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}

                {/* Timestamp */}
                <div className={`mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] ${
                  isAi ? 'text-on-surface-variant dark:text-slate-400 justify-start' : 'text-white/75 justify-end'
                }`}>
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
                  <span>{msg.time}</span>
                </div>
              </div>

              {/* User Avatar */}
              {!isAi && (
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-secondary-container dark:bg-slate-800 text-primary dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-sm border border-primary/20 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Loading Animation */}
        {isTyping && (
          <div className="flex items-start gap-2 sm:gap-3.5 animate-in fade-in duration-150 w-full max-w-full box-border">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-primary-container text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="bg-white dark:bg-slate-850 p-3 sm:p-4 rounded-3xl rounded-tl-sm border border-outline-variant/30 dark:border-slate-700/60 shadow-xs flex items-center space-x-2">
              <span className="text-xs text-on-surface-variant dark:text-slate-300 font-medium pr-1">
                {typingStep === 0 ? 'Analyzing telemetry' : typingStep === 1 ? 'Querying transit sensors' : 'Synthesizing response'}
              </span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary dark:bg-cyan-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary dark:bg-cyan-400 animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary dark:bg-cyan-400 animate-bounce [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} className="h-1" />
      </div>

      {/* 3. Quick Suggested Questions Chips Bar */}
      <div className="px-3 sm:px-4 py-2 bg-surface-container-low/90 dark:bg-slate-900/90 border-t border-outline-variant/20 dark:border-slate-800 shrink-0 w-full max-w-full box-border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar w-full max-w-full">
          <span className="text-[10px] sm:text-[11px] font-label text-on-surface-variant dark:text-slate-400 font-bold flex items-center gap-1 shrink-0 px-0.5 uppercase tracking-wider mr-1">
            <Lightbulb className="w-3 h-3 text-primary dark:text-cyan-400" /> Prompts:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q.prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-primary dark:hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 border border-outline-variant/40 dark:border-slate-700 text-primary dark:text-cyan-400 text-[11px] font-medium transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0 min-h-[28px] flex items-center"
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Message Input Form — Mobile Safe Layout */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 sm:p-3.5 md:p-4 bg-white dark:bg-slate-900 border-t border-outline-variant/30 dark:border-slate-800 flex items-center gap-2 sm:gap-3 shrink-0 w-full max-w-full box-border"
      >
        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask AI: Find a bus, Check ETA, Best route..."
            disabled={isTyping}
            className="w-full bg-[#F1F5F9] dark:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-full py-2.5 sm:py-3 pl-4 pr-3 text-xs sm:text-sm text-on-surface dark:text-slate-100 placeholder:text-outline dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-cyan-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-cyan-400/20 transition-all outline-none disabled:opacity-60 min-w-0 box-border"
          />
        </div>

        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="btn-primary rounded-full px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm shadow-md shadow-primary/25 hover:shadow-cyan-400/40 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 shrink-0 min-h-[40px] sm:min-h-[44px]"
          aria-label="Send message to AI"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </form>
    </div>
  );
}
