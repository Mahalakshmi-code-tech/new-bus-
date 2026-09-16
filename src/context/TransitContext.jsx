import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_STOPS,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DIGITAL_PASS,
  calculateTrafficAdjustedEta,
  calculateEcoSavings
} from '../services/transitData';
import { StorageAdapter, isCloudConnected } from '../services/firebase';
import trackingService from '../services/trackingService';
import {
  evaluateTransitAlerts,
  explainNotificationTrigger,
  createDestinationStopAlert
} from '../services/notificationService';

const TransitContext = createContext(null);

export function TransitProvider({ children }) {
  // 1. Core Transit Telemetry States
  const [buses, setBuses] = useState(() => trackingService.getBuses() || INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState('bus-21a');
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [stops, setStops] = useState(INITIAL_STOPS);
  const [selectedStopId, setSelectedStopId] = useState(null);

  // Smart Stop Alert state for passenger's selected destination
  const [destinationAlertStopId, setDestinationAlertStopId] = useState('stop-central');
  const [activeStopAlert, setActiveStopAlert] = useState(null);

  // 2. Traffic Condition State: 'LOW' | 'MEDIUM' | 'HIGH'
  const [trafficCondition, setTrafficCondition] = useState('MEDIUM');

  // 3. Demo / Simulation Mode Control
  const [isDemoSimulation, setIsDemoSimulation] = useState(true);

  // 4. Notifications Center & Toast State
  const [notifications, setNotifications] = useState(() => StorageAdapter.loadNotifications(INITIAL_NOTIFICATIONS));
  const [activeToast, setActiveToast] = useState(null);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const showToast = useCallback((toastData) => {
    setActiveToast(toastData);
  }, []);

  // 5. User Favorites (Buses, Routes, Stops)
  const [favorites, setFavorites] = useState(() => StorageAdapter.loadFavorites());

  // 6. Incident Reporting Desk
  const [incidentReports, setIncidentReports] = useState(() => StorageAdapter.loadIncidents(INITIAL_INCIDENT_REPORTS));

  // 7. Digital Bus Pass
  const [digitalPass, setDigitalPass] = useState(() => StorageAdapter.loadPass(INITIAL_DIGITAL_PASS));

  // 8. Global Modals Control
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  const toggleAiCopilot = useCallback(() => {
    setIsAiCopilotOpen(prev => !prev);
  }, []);

  // 9. Global Search Query & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected bus and stop objects
  const selectedBus = useMemo(() =>
    buses.find(b => b.id === selectedBusId) || buses[0],
    [buses, selectedBusId]
  );

  const selectedStop = useMemo(() =>
    stops.find(s => s.id === selectedStopId) || null,
    [stops, selectedStopId]
  );

  // Sync state to localStorage on updates
  useEffect(() => {
    StorageAdapter.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    StorageAdapter.saveIncidents(incidentReports);
  }, [incidentReports]);

  useEffect(() => {
    StorageAdapter.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageAdapter.savePass(digitalPass);
  }, [digitalPass]);

  // Recalculate traffic-adjusted ETAs whenever trafficCondition changes
  useEffect(() => {
    setBuses(prevBuses =>
      prevBuses.map(bus => {
        if (bus.status === 'Out of Service') return bus;
        const adjusted = calculateTrafficAdjustedEta(bus.normalEtaMinutes, trafficCondition);
        return {
          ...bus,
          trafficAdjustedEtaMinutes: adjusted
        };
      })
    );
  }, [trafficCondition]);

  // Synchronize Simulation Mode with trackingService
  useEffect(() => {
    trackingService.setDataSource(isDemoSimulation ? 'SIMULATION' : 'REAL_GPS');
  }, [isDemoSimulation]);

  // Synchronize passenger's selected Destination Stop Alert with trackingService
  useEffect(() => {
    if (selectedBusId && destinationAlertStopId) {
      trackingService.setDestinationAlert(selectedBusId, destinationAlertStopId);
    } else if (selectedBusId) {
      trackingService.clearDestinationAlert(selectedBusId);
    }
  }, [selectedBusId, destinationAlertStopId]);

  // Periodic ETA countdown simulation
  useEffect(() => {
    const etaInterval = setInterval(() => {
      setBuses(prevBuses =>
        prevBuses.map(bus => {
          if (bus.status === 'Out of Service' || bus.status === 'At Stop') return bus;

          let newEta = bus.trafficAdjustedEtaMinutes;
          if (newEta > 1) {
            newEta -= 1;
          } else if (newEta === 1) {
            newEta = 0;
          }

          let newStatus = bus.status;
          if (newEta === 0) {
            newStatus = 'At Stop';
          } else if (newEta <= 2) {
            newStatus = 'Approaching';
          }

          return {
            ...bus,
            trafficAdjustedEtaMinutes: newEta,
            status: newStatus
          };
        })
      );
    }, 45000);

    return () => clearInterval(etaInterval);
  }, []);

  // Notifications memoized helpers
  const unreadNotificationCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback((notifId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  }, []);

  const addNotification = useCallback((notif, triggerToast = true) => {
    const newEntry = {
      id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: notif.timestamp || 'Just now',
      createdAt: Date.now(),
      read: false,
      ...notif
    };
    setNotifications(prev => [newEntry, ...prev]);

    if (triggerToast) {
      setActiveToast(newEntry);
    }
    return newEntry;
  }, []);

  // Subscribe to trackingService telemetry & smart proximity alerts
  useEffect(() => {
    const unsubscribeTelemetry = trackingService.subscribe((updatedBuses) => {
      setBuses(updatedBuses);
    });

    const unsubscribeAlerts = trackingService.subscribeAlerts((alert) => {
      setActiveStopAlert(alert);
      const matchedBus = trackingService.getBusById(alert.busId);
      const stopAlertPayload = createDestinationStopAlert({
        busId: alert.busId,
        busNumber: matchedBus?.number || 'SmartBus',
        stopId: alert.stopId,
        stopName: alert.stopName,
        distanceKm: alert.distanceKm
      });
      addNotification(stopAlertPayload, true);
    });

    return () => {
      unsubscribeTelemetry();
      unsubscribeAlerts();
    };
  }, [addNotification]);

  // Intelligent Simulated Transit Alert Evaluation Engine
  useEffect(() => {
    const runEvaluation = () => {
      setNotifications(prev => {
        const newAlerts = evaluateTransitAlerts({
          buses,
          routes,
          stops,
          favorites,
          selectedBusId,
          destinationAlertStopId,
          existingNotifications: prev
        });

        if (newAlerts.length > 0) {
          // Trigger toast for the highest priority incoming notification
          setActiveToast(newAlerts[0]);
          return [...newAlerts, ...prev];
        }
        return prev;
      });
    };

    // Initial evaluation shortly after mount
    const initTimer = setTimeout(runEvaluation, 2500);
    // Recurring evaluation every 8 seconds
    const intervalId = setInterval(runEvaluation, 8000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(intervalId);
    };
  }, [buses, routes, stops, favorites, selectedBusId, destinationAlertStopId]);

  const dismissStopAlert = useCallback(() => {
    setActiveStopAlert(null);
  }, []);

  // Favorites memoized helpers
  const toggleFavoriteBus = useCallback((busId) => {
    setFavorites(prev => {
      const exists = prev.buses.includes(busId);
      const updated = exists
        ? prev.buses.filter(id => id !== busId)
        : [...prev.buses, busId];
      return { ...prev, buses: updated };
    });
  }, []);

  const toggleFavoriteRoute = useCallback((routeId) => {
    setFavorites(prev => {
      const exists = prev.routes.includes(routeId);
      const updated = exists
        ? prev.routes.filter(id => id !== routeId)
        : [...prev.routes, routeId];
      return { ...prev, routes: updated };
    });
  }, []);

  const toggleFavoriteStop = useCallback((stopId) => {
    setFavorites(prev => {
      const exists = prev.stops.includes(stopId);
      const updated = exists
        ? prev.stops.filter(id => id !== stopId)
        : [...prev.stops, stopId];
      return { ...prev, stops: updated };
    });
  }, []);

  const isFavoriteBus = useCallback((busId) => favorites.buses.includes(busId), [favorites.buses]);
  const isFavoriteRoute = useCallback((routeId) => favorites.routes.includes(routeId), [favorites.routes]);
  const isFavoriteStop = useCallback((stopId) => favorites.stops.includes(stopId), [favorites.stops]);

  // Incident reporting helpers
  const submitIncidentReport = useCallback((reportData) => {
    const newReport = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      timestamp: 'Just now',
      reportedAt: new Date().toISOString(),
      reportedBy: reportData.reportedBy || 'Passenger Commuter',
      ...reportData
    };

    setIncidentReports(prev => [newReport, ...prev]);

    // Push corresponding smart alert to notification center
    addNotification({
      type: 'delayed',
      title: `Incident Logged: ${reportData.issueType}`,
      message: `Your report for ${reportData.busNumber || 'Fleet Node'} (${newReport.id}) has been submitted to dispatch.`,
      busId: reportData.busId
    });

    return newReport;
  }, [addNotification]);

  const updateIncidentStatus = useCallback((reportId, newStatus) => {
    setIncidentReports(prev =>
      prev.map(rep => rep.id === reportId ? { ...rep, status: newStatus } : rep)
    );
  }, []);

  // Eco & Carbon metrics accumulator
  const ecoSavings = useMemo(() =>
    calculateEcoSavings(14.2, digitalPass.tripsCount || 28),
    [digitalPass.tripsCount]
  );

  // Smart Search indexing
  const getSearchResults = useCallback((query) => {
    if (!query || !query.trim()) return { buses: [], routes: [], stops: [], passes: [] };
    const q = query.toLowerCase().trim();

    const matchingBuses = buses.filter(b =>
      b.number.toLowerCase().includes(q) ||
      b.routeName.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q) ||
      b.currentStop.toLowerCase().includes(q) ||
      b.nextStop.toLowerCase().includes(q)
    );

    const matchingRoutes = routes.filter(r =>
      r.number.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.from.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q) ||
      (r.assignedBuses && r.assignedBuses.some(ab => ab.toLowerCase().includes(q))) ||
      r.stops.some(s => s.toLowerCase().includes(q))
    );

    const matchingStops = stops.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      (s.nextBus && s.nextBus.toLowerCase().includes(q)) ||
      s.connections.some(c => c.toLowerCase().includes(q))
    );

    const matchingPasses = [];
    if (digitalPass && digitalPass.passId) {
      if (
        digitalPass.passId.toLowerCase().includes(q) ||
        (digitalPass.passengerName && digitalPass.passengerName.toLowerCase().includes(q)) ||
        (digitalPass.passType && digitalPass.passType.toLowerCase().includes(q)) ||
        'pass'.includes(q) ||
        'metro pass'.includes(q)
      ) {
        matchingPasses.push(digitalPass);
      }
    }

    return {
      buses: matchingBuses,
      routes: matchingRoutes,
      stops: matchingStops,
      passes: matchingPasses
    };
  }, [buses, routes, stops, digitalPass]);

  // Memoize entire context value object to eliminate unnecessary consumer re-renders
  const contextValue = useMemo(() => ({
    buses,
    selectedBus,
    selectedBusId,
    setSelectedBusId,
    routes,
    setRoutes,
    stops,
    setStops,
    selectedStop,
    selectedStopId,
    setSelectedStopId,
    trafficCondition,
    setTrafficCondition,
    isDemoSimulation,
    setIsDemoSimulation,

    destinationAlertStopId,
    setDestinationAlertStopId,
    activeStopAlert,
    setActiveStopAlert,
    dismissStopAlert,

    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    addNotification,

    activeToast,
    dismissToast,
    showToast,
    explainNotificationTrigger,

    favorites,
    toggleFavoriteBus,
    toggleFavoriteRoute,
    toggleFavoriteStop,
    isFavoriteBus,
    isFavoriteRoute,
    isFavoriteStop,

    incidentReports,
    submitIncidentReport,
    updateIncidentStatus,

    digitalPass,
    setDigitalPass,
    ecoSavings,

    isSearchOpen,
    setIsSearchOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isIncidentModalOpen,
    setIsIncidentModalOpen,
    isPassModalOpen,
    setIsPassModalOpen,
    isAiCopilotOpen,
    setIsAiCopilotOpen,
    toggleAiCopilot,

    searchQuery,
    setSearchQuery,
    getSearchResults,

    isCloudConnected
  }), [
    buses,
    selectedBus,
    selectedBusId,
    routes,
    stops,
    selectedStop,
    selectedStopId,
    trafficCondition,
    isDemoSimulation,
    destinationAlertStopId,
    activeStopAlert,
    dismissStopAlert,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    addNotification,
    activeToast,
    dismissToast,
    showToast,
    favorites,
    toggleFavoriteBus,
    toggleFavoriteRoute,
    toggleFavoriteStop,
    isFavoriteBus,
    isFavoriteRoute,
    isFavoriteStop,
    incidentReports,
    submitIncidentReport,
    updateIncidentStatus,
    digitalPass,
    ecoSavings,
    isSearchOpen,
    isNotificationsOpen,
    isIncidentModalOpen,
    isPassModalOpen,
    isAiCopilotOpen,
    toggleAiCopilot,
    searchQuery,
    getSearchResults
  ]);

  return (
    <TransitContext.Provider value={contextValue}>
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}

export default TransitContext;
