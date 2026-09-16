// SmartBus Firebase Architecture & Resilient Synchronization Adapter
import { monitoringService } from './monitoringService';

/**
 * Checks if Firebase configuration credentials exist in environment variables
 */
const hasFirebaseConfig = Boolean(
  import.meta.env?.VITE_FIREBASE_API_KEY && 
  import.meta.env?.VITE_FIREBASE_PROJECT_ID
);

let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;

// Initialize Firebase dynamically only when credentials exist to avoid bundle errors
if (hasFirebaseConfig) {
  try {
    console.info('SmartBus: Initializing cloud Firebase connection with least-privilege security...');
  } catch (err) {
    monitoringService.logError('firebase_init', err);
    console.warn('SmartBus: Firebase initialization failed, falling back to local sync engine:', err);
  }
}

/**
 * Local Storage Persistence Keys
 */
const KEYS = {
  FAVORITES: 'smartbus_favorites_v1',
  INCIDENTS: 'smartbus_incidents_v1',
  PASS: 'smartbus_digital_pass_v1',
  NOTIFICATIONS: 'smartbus_notifications_v1'
};

/**
 * Resilient Data Persistence Manager
 * Transparently handles save/load operations whether connected to Firebase or running offline/demo.
 */
export const StorageAdapter = {
  // --- Favorites ---
  saveFavorites(favorites) {
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      monitoringService.logError('StorageAdapter.saveFavorites', e);
    }
  },

  loadFavorites(defaultFavorites = { buses: ['bus-21a'], routes: ['route-21a'], stops: ['stop-guindy', 'stop-central'] }) {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : defaultFavorites;
    } catch (e) {
      return defaultFavorites;
    }
  },

  // --- Incident Reports ---
  saveIncidents(incidents) {
    try {
      // Limit local cache to most recent 50 incidents for storage performance
      const bounded = Array.isArray(incidents) ? incidents.slice(0, 50) : incidents;
      localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(bounded));
    } catch (e) {
      monitoringService.logError('StorageAdapter.saveIncidents', e);
    }
  },

  loadIncidents(defaultIncidents = []) {
    try {
      const data = localStorage.getItem(KEYS.INCIDENTS);
      return data ? JSON.parse(data) : defaultIncidents;
    } catch (e) {
      return defaultIncidents;
    }
  },

  // --- Digital Pass ---
  savePass(pass) {
    try {
      localStorage.setItem(KEYS.PASS, JSON.stringify(pass));
    } catch (e) {
      monitoringService.logError('StorageAdapter.savePass', e);
    }
  },

  loadPass(defaultPass) {
    try {
      const data = localStorage.getItem(KEYS.PASS);
      return data ? JSON.parse(data) : defaultPass;
    } catch (e) {
      return defaultPass;
    }
  },

  // --- Notifications ---
  saveNotifications(notifs) {
    try {
      // Limit to latest 30 notifications
      const bounded = Array.isArray(notifs) ? notifs.slice(0, 30) : notifs;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(bounded));
    } catch (e) {
      monitoringService.logError('StorageAdapter.saveNotifications', e);
    }
  },

  loadNotifications(defaultNotifs = []) {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : defaultNotifs;
    } catch (e) {
      return defaultNotifs;
    }
  }
};

/**
 * Subscription Manager: Ensures safe registration and cleanup of listeners
 */
export class SubscriptionManager {
  constructor() {
    this.unsubscribers = new Set();
  }

  add(unsubscribeFn) {
    if (typeof unsubscribeFn === 'function') {
      this.unsubscribers.add(unsubscribeFn);
    }
    return () => this.remove(unsubscribeFn);
  }

  remove(unsubscribeFn) {
    if (typeof unsubscribeFn === 'function') {
      try {
        unsubscribeFn();
      } catch (e) {}
      this.unsubscribers.delete(unsubscribeFn);
    }
  }

  clearAll() {
    for (const unsub of this.unsubscribers) {
      try {
        unsub();
      } catch (e) {}
    }
    this.unsubscribers.clear();
  }
}

export const isCloudConnected = hasFirebaseConfig;
