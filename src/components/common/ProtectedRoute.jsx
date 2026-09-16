import React, { lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
const Unauthorized = lazy(() => import('../../pages/Unauthorized'));

/**
 * ProtectedRoute component enforces authentication and role-based authorization.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children Child component to render if authorized
 * @param {string[]} [props.allowedRoles] Roles allowed to access this route (e.g. ['admin'])
 * @param {Function} props.setCurrentPage Navigation state setter
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  setCurrentPage 
}) {
  const { isAuthenticated, currentUser, hasRole } = useAuth();

  // 1. Not Authenticated -> Redirect or Prompt Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-[#0b1120] text-on-surface dark:text-slate-100">
        <div className="max-w-md w-full glass-card dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-outline-variant/40 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary dark:text-cyan-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-headline font-bold text-2xl">Authentication Required</h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
              Please authenticate with your commuter credentials or dispatch token to access this command portal.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="btn-primary py-3 px-6 rounded-full text-xs font-bold"
            >
              Go to Login Portal
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="btn-ghost py-3 px-6 rounded-full text-xs font-bold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but lacks required role -> Show Unauthorized (403)
  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <Suspense fallback={null}>
        <Unauthorized 
          setCurrentPage={setCurrentPage} 
          requiredRole={allowedRoles.join(' or ')} 
          currentRole={currentUser?.role} 
        />
      </Suspense>
    );
  }

  // 3. Authorized -> Render requested view
  return <>{children}</>;
}
