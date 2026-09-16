import { lazy } from 'react';

/**
 * Lazy Loaded Page Components
 * Implements route-based code splitting so each page is downloaded on demand.
 */
export const Home = lazy(() => import('../pages/Home'));
export const About = lazy(() => import('../pages/About'));
export const Features = lazy(() => import('../pages/Features'));
export const LiveTracking = lazy(() => import('../pages/LiveTracking'));
export const Routes = lazy(() => import('../pages/Routes'));
export const AiInsights = lazy(() => import('../pages/AiInsights'));
export const Contact = lazy(() => import('../pages/Contact'));
export const Login = lazy(() => import('../pages/Login'));
export const UserDashboard = lazy(() => import('../pages/UserDashboard'));
export const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const Analytics = lazy(() => import('../pages/Analytics'));
export const DigitalPass = lazy(() => import('../pages/DigitalPass'));
export const NotFound = lazy(() => import('../pages/NotFound'));
export const Unauthorized = lazy(() => import('../pages/Unauthorized'));

/**
 * Declarative Route Configuration
 * Easily extendable for future corridors, routes, and admin tools.
 */
export const ROUTES_CONFIG = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    component: Home,
    layout: 'public',
    title: 'SmartBus | Urban Intelligent Transit'
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    component: About,
    layout: 'public',
    title: 'About SmartBus | Vision & Infrastructure'
  },
  {
    id: 'features',
    path: '/features',
    label: 'Features',
    component: Features,
    layout: 'public',
    title: 'SmartBus Features | Smart Fleet Solutions'
  },
  {
    id: 'tracking',
    path: '/tracking',
    label: 'Live Tracking',
    component: LiveTracking,
    layout: 'public',
    title: 'Live Bus Radar | GPS Transit Telemetry'
  },
  {
    id: 'routes',
    path: '/routes',
    label: 'Routes',
    component: Routes,
    layout: 'public',
    title: 'Transit Routes & Corridors | SmartBus'
  },
  {
    id: 'analytics',
    path: '/analytics',
    label: 'Transit Analytics',
    component: Analytics,
    layout: 'public',
    title: 'Transit Analytics & Fleet Performance | SmartBus'
  },
  {
    id: 'pass',
    path: '/pass',
    alias: 'digital-pass',
    label: 'Digital Pass',
    component: DigitalPass,
    layout: 'public',
    title: 'Digital Bus Pass & Travel Card | SmartBus'
  },
  {
    id: 'ai-insights',
    path: '/ai-insights',
    alias: 'ai-assistant',
    label: 'AI Co-Pilot',
    component: AiInsights,
    layout: 'portal',
    title: 'Kinetic AI Assistant | Smart Transit Guidance'
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    component: Contact,
    layout: 'public',
    title: 'Contact Dispatch & Support | SmartBus'
  },
  {
    id: 'login',
    path: '/login',
    label: 'Portal Login',
    component: Login,
    layout: 'auth',
    title: 'Terminal Login | SmartBus Platform'
  },
  {
    id: 'user-dashboard',
    path: '/user-dashboard',
    alias: 'dashboard',
    label: 'Passenger Portal',
    component: UserDashboard,
    layout: 'portal',
    isProtected: true,
    allowedRoles: ['user', 'admin'],
    title: 'Passenger Hub | SmartBus'
  },
  {
    id: 'admin-dashboard',
    path: '/admin-dashboard',
    alias: 'admin',
    label: 'Admin Command',
    component: AdminDashboard,
    layout: 'portal',
    isProtected: true,
    allowedRoles: ['admin'],
    title: 'Fleet Command Center | SmartBus Dispatch'
  }
];

export const VALID_PAGE_IDS = ROUTES_CONFIG.map(r => r.id);
export default ROUTES_CONFIG;
