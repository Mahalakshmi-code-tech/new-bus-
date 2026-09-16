import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TransitProvider, useTransit } from './context/TransitContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import { PageSkeleton } from './components/common/Skeleton';
import OfflineBanner from './components/common/OfflineBanner';
import { monitoringService } from './services/monitoringService';

// Lazy-loaded page components for route-based code splitting
import {
  Home,
  About,
  Features,
  LiveTracking,
  Routes,
  Analytics,
  DigitalPass,
  AiInsights,
  Contact,
  Login,
  UserDashboard,
  AdminDashboard,
  NotFound
} from './routes/routesConfig';

// Global system modals
import NotificationCenter from './components/notifications/NotificationCenter';
import NotificationToast from './components/notifications/NotificationToast';
import IncidentReportModal from './components/IncidentReportModal';
import DigitalPassModal from './components/DigitalPassModal';
import SmartSearchModal from './components/SmartSearchModal';
import FloatingAiCopilot from './components/FloatingAiCopilot';
import { Bot } from 'lucide-react';

const VALID_PAGES = new Set([
  'home', 'about', 'features', 'tracking', 'routes', 'analytics', 'pass',
  'ai-insights', 'contact', 'login', 'user-dashboard', 'admin-dashboard'
]);

const ROUTE_ALIASES = {
  'dashboard': 'user-dashboard',
  'admin': 'admin-dashboard',
  'ai-assistant': 'ai-insights',
  'ticket': 'pass',
  'digital-pass': 'pass'
};

function SmartBusMain() {
  const [currentPage, setCurrentPage] = useState('home');
  const { currentUser, logout } = useAuth();
  const { activeToast, dismissToast, setSelectedBusId } = useTransit();

  // Route hash synchronization with aliases support
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase().trim();
      if (!rawHash) {
        setCurrentPage('home');
        return;
      }

      // Check alias or direct page
      const resolvedPage = ROUTE_ALIASES[rawHash] || rawHash;
      if (VALID_PAGES.has(resolvedPage)) {
        setCurrentPage(resolvedPage);
      } else {
        // Unknown route -> render 404
        setCurrentPage('404');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update route and hash with transition logging
  const handlePageChange = useCallback((pageId) => {
    const start = performance.now();
    setCurrentPage(prevPage => {
      monitoringService.logRouteTransition(prevPage, pageId, performance.now() - start);
      return pageId;
    });

    if (pageId !== '404') {
      window.location.hash = pageId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handlePageChange('home');
  }, [logout, handlePageChange]);

  const isPortalView = ['user-dashboard', 'admin-dashboard', 'ai-insights'].includes(currentPage);
  const isLoginPage = currentPage === 'login';
  const is404Page = currentPage === '404';

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100 antialiased font-sans transition-colors duration-300">
      {/* Network Connectivity Indicator */}
      <OfflineBanner />

      {/* Global Accessibility Cursor Hook */}
      <CustomCursor />

      {/* Show Top Navbar on all non-portal/login public pages */}
      {!isPortalView && !isLoginPage && !is404Page && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Dynamic Viewport with Suspense & ErrorBoundary */}
      <div className={`flex-grow ${!isPortalView && !isLoginPage && !is404Page ? 'pb-20 md:pb-0' : ''}`}>
        <ErrorBoundary key={currentPage} onReset={() => handlePageChange('home')}>
          <Suspense fallback={<PageSkeleton />}>
            {currentPage === 'home' && <Home setCurrentPage={handlePageChange} />}
            {currentPage === 'about' && <About setCurrentPage={handlePageChange} />}
            {currentPage === 'features' && <Features setCurrentPage={handlePageChange} />}
            {currentPage === 'tracking' && <LiveTracking setCurrentPage={handlePageChange} />}
            {currentPage === 'routes' && <Routes setCurrentPage={handlePageChange} />}
            {currentPage === 'analytics' && <Analytics setCurrentPage={handlePageChange} />}
            {currentPage === 'pass' && <DigitalPass setCurrentPage={handlePageChange} />}
            {currentPage === 'contact' && <Contact setCurrentPage={handlePageChange} />}
            {currentPage === 'login' && (
              <Login
                setCurrentPage={handlePageChange}
                onLoginSuccess={() => { }}
              />
            )}
            {currentPage === 'user-dashboard' && (
              <ProtectedRoute allowedRoles={['user', 'admin']} setCurrentPage={handlePageChange}>
                <UserDashboard
                  setCurrentPage={handlePageChange}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            )}
            {currentPage === 'admin-dashboard' && (
              <ProtectedRoute allowedRoles={['admin']} setCurrentPage={handlePageChange}>
                <AdminDashboard
                  setCurrentPage={handlePageChange}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            )}
            {currentPage === 'ai-insights' && (
              <AiInsights
                setCurrentPage={handlePageChange}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
            {currentPage === '404' && (
              <NotFound setCurrentPage={handlePageChange} />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Floating AI Co-Pilot Widget on public pages */}
      {!isPortalView && !isLoginPage && !is404Page && (
        <FloatingAiCopilot onNavigate={handlePageChange} />
      )}

      {/* Show Footer on public pages */}
      {!isPortalView && !isLoginPage && !is404Page && (
        <Footer setCurrentPage={handlePageChange} />
      )}

      {/* Global System Modals */}
      <SmartSearchModal setCurrentPage={handlePageChange} />
      <NotificationCenter setCurrentPage={handlePageChange} />
      <IncidentReportModal />
      <DigitalPassModal />

      {/* Global Floating Transit Alert Toast */}
      <NotificationToast
        toast={activeToast}
        onDismiss={dismissToast}
        onActionClick={(toast) => {
          if (toast.busId && setSelectedBusId) {
            setSelectedBusId(toast.busId);
          }
          const target = toast.action?.page || (toast.busId ? 'tracking' : 'routes');
          handlePageChange(target);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TransitProvider>
        <AuthProvider>
          <SmartBusMain />
        </AuthProvider>
      </TransitProvider>
    </ThemeProvider>
  );
}
