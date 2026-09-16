/**
 * SmartBus Authentication & RBAC Service
 * -----------------------------------------------------------
 * Roles Supported:
 * - 'admin': Fleet Dispatch, Route management, diagnostics, reports
 * - 'user': Commuter portal, favorites, pass, incident reporting
 *
 * Provides session handling, automatic expiration, role authorization guards,
 * and secure multi-tab session coordination.
 */

const SESSION_KEY = 'smartbus_auth_session_v1';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const AuthService = {
  /**
   * Retrieves the currently active authenticated session
   * @returns {Object|null} User session or null if unauthenticated or expired
   */
  getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const session = JSON.parse(raw);
      if (!session || !session.expiresAt) return null;

      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      // Renew session expiry on active usage (sliding window)
      session.expiresAt = Date.now() + SESSION_DURATION_MS;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return session.user;
    } catch (e) {
      console.warn('Failed to parse auth session:', e);
      return null;
    }
  },

  /**
   * Logs in a user, establishes session with expiration
   */
  login(userData, role = USER_ROLES.USER, persistInLocal = false) {
    const session = {
      user: {
        id: userData.id || `user_${Date.now()}`,
        name: userData.name || (role === USER_ROLES.ADMIN ? 'Chief Dispatcher' : 'Alex Commuter'),
        email: userData.email || (role === USER_ROLES.ADMIN ? 'operator@smartbus.city' : 'alex@commuter.transit'),
        role: role.toLowerCase() === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER,
        loginTime: new Date().toISOString()
      },
      expiresAt: Date.now() + SESSION_DURATION_MS
    };

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      if (persistInLocal) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('Storage unavailable for session:', e);
    }

    return session.user;
  },

  /**
   * Securely terminates session
   */
  logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  },

  /**
   * Verifies if a user possesses the required role
   * @param {Object} user User object
   * @param {string|string[]} allowedRoles Single role or array of allowed roles
   */
  hasRole(user, allowedRoles) {
    if (!user || !user.role) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase());
  },

  /**
   * Checks if user has admin privileges
   */
  isAdmin(user) {
    return this.hasRole(user, USER_ROLES.ADMIN);
  }
};

export default AuthService;
