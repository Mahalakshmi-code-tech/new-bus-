import { useState, useEffect } from 'react';

/**
 * Hook to track online/offline connectivity and slow network conditions
 * @returns {{ isOnline: boolean, isSlow: boolean, connectionType: string }}
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSlow, setIsSlow] = useState(false);
  const [connectionType, setConnectionType] = useState('4g');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API inspection (supported on Chrome/Edge/Android)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const updateConnection = () => {
        setConnectionType(connection.effectiveType || '4g');
        setIsSlow(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      };
      updateConnection();
      connection.addEventListener('change', updateConnection);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnection);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isSlow, connectionType };
}

export default useNetworkStatus;
