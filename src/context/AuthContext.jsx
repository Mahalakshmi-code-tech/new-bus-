import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AuthService, { USER_ROLES } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());

  // Listen for storage events across tabs to synchronize logout / session changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'smartbus_auth_session_v1') {
        const updated = AuthService.getCurrentUser();
        setCurrentUser(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((userData, role = USER_ROLES.USER, rememberMe = false) => {
    const user = AuthService.login(userData, role, rememberMe);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setCurrentUser(null);
  }, []);

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
  const isCommuter = currentUser?.role === USER_ROLES.USER;

  const value = useMemo(() => ({
    currentUser,
    user: currentUser,
    isAuthenticated,
    isAdmin,
    isCommuter,
    role: currentUser?.role || 'guest',
    login,
    logout,
    hasRole: (allowedRoles) => AuthService.hasRole(currentUser, allowedRoles)
  }), [currentUser, isAuthenticated, isAdmin, isCommuter, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
