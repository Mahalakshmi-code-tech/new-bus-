/**
 * SmartBus Digital Pass Service
 * ------------------------------------------------------------------
 * Business logic and data transformation engine for SmartBus digital
 * transit credentials. Decoupled from UI components for high
 * testability and future database readiness (Firestore / Supabase / REST).
 */

export const PASS_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING SOON',
  EXPIRED: 'EXPIRED'
};

export const PASS_TIERS = {
  'monthly': {
    id: 'monthly',
    label: 'Monthly All-Corridor',
    category: 'Monthly All-Corridor Metro Pass',
    defaultRoute: 'All Metro Corridors',
    codePrefix: 'SB-METRO',
    passId: 'SB-METRO-2026-X889',
    validityDays: 30,
    tripsAllowed: 'Unlimited',
    estimatedTrips: 42,
    fareSaved: '$34.50',
    description: 'Full network access across all metropolitan bus routes, express shuttles, and intermodal depots.',
    gradient: 'from-[#031b4e] via-[#0044b3] to-[#0066ff] dark:from-[#06142e] dark:via-[#0c2452] dark:to-[#12387d]'
  },
  'student': {
    id: 'student',
    label: 'Student Pass',
    category: 'Student Subsidized Metro Pass',
    defaultRoute: 'Central Station → University Campus',
    codePrefix: 'SB-STUD',
    passId: 'SB-STUD-2026-S402',
    validityDays: 90,
    tripsAllowed: 'Unlimited (Term)',
    estimatedTrips: 88,
    fareSaved: '$62.00',
    description: 'Subsidized semester transit for registered university and technical college students.',
    gradient: 'from-[#021f3f] via-[#005088] to-[#007cc7] dark:from-[#05172d] dark:via-[#09294a] dark:to-[#0e3f70]'
  },
  'daily': {
    id: 'daily',
    label: 'Daily Unlimited',
    category: '24-Hour Unlimited Metro Pass',
    defaultRoute: 'Central Station → Airport Express',
    codePrefix: 'SB-DAY',
    passId: 'SB-DAY-2026-D115',
    validityDays: 1,
    tripsAllowed: 'Unlimited (24h)',
    estimatedTrips: 6,
    fareSaved: '$8.20',
    description: 'Flexible 24-hour pass for tourists, weekend commuters, and frequent city travelers.',
    gradient: 'from-[#191d42] via-[#243666] to-[#3a528c] dark:from-[#11142b] dark:via-[#1a2645] dark:to-[#29385e]'
  },
  'general': {
    id: 'general',
    label: 'General Zone Pass',
    category: 'Standard Urban Transit Pass',
    defaultRoute: 'Guindy → Chennai Central',
    codePrefix: 'SB-ZONE',
    passId: 'SB-ZONE-2026-G520',
    validityDays: 14,
    tripsAllowed: '30 Trips',
    estimatedTrips: 22,
    fareSaved: '$18.00',
    description: 'Point-to-point urban corridor transit credential with high-frequency transfer privileges.',
    gradient: 'from-[#002b49] via-[#005b96] to-[#0088cc] dark:from-[#031c33] dark:via-[#083866] dark:to-[#0e5c9e]'
  }
};

/**
 * Calculates days remaining, progress ratio, and current validity status
 * @param {string} validUntil - ISO or YYYY-MM-DD date string
 * @param {string} validFrom - ISO or YYYY-MM-DD date string
 * @returns {Object} Expiry evaluation metrics
 */
export function calculatePassExpiry(validUntil, validFrom) {
  try {
    const now = new Date();
    // Use mid-day reference to avoid timezone day-boundary skews
    const expiryDate = new Date(validUntil);
    const startDate = validFrom ? new Date(validFrom) : new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const diffMs = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // Total span in milliseconds
    const totalSpanMs = Math.max(1, expiryDate.getTime() - startDate.getTime());
    const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
    const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalSpanMs) * 100)));

    let status = PASS_STATUS.ACTIVE;
    if (diffMs <= 0 || daysRemaining === 0) {
      status = PASS_STATUS.EXPIRED;
    } else if (daysRemaining <= 5) {
      status = PASS_STATUS.EXPIRING_SOON;
    }

    return {
      daysRemaining,
      percentElapsed,
      percentRemaining: 100 - percentElapsed,
      isExpired: status === PASS_STATUS.EXPIRED,
      isExpiringSoon: status === PASS_STATUS.EXPIRING_SOON,
      status
    };
  } catch (err) {
    console.warn('Error calculating pass expiry:', err);
    return {
      daysRemaining: 14,
      percentElapsed: 50,
      percentRemaining: 50,
      isExpired: false,
      isExpiringSoon: false,
      status: PASS_STATUS.ACTIVE
    };
  }
}

/**
 * Retrieves accessible status styling, iconography, and textual messaging
 * @param {string} status - 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED'
 * @returns {Object} Status presentation metadata
 */
export function getPassStatusMeta(status) {
  const normStatus = (status || '').toUpperCase();

  switch (normStatus) {
    case PASS_STATUS.EXPIRED:
      return {
        label: 'EXPIRED',
        code: 'expired',
        dotColor: 'bg-red-500',
        badgeClass: 'bg-red-950/70 border-red-500/50 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
        cardBanner: 'bg-red-500/10 dark:bg-red-500/15 border-red-500/30 text-red-800 dark:text-red-300',
        textColor: 'text-red-600 dark:text-red-400',
        title: 'Pass Expired',
        message: 'This pass has expired. Renewal is required for boarding.',
        actionLabel: 'Renew Pass',
        actionUrgent: true
      };

    case PASS_STATUS.EXPIRING_SOON:
      return {
        label: 'EXPIRING SOON',
        code: 'expiring',
        dotColor: 'bg-amber-400',
        badgeClass: 'bg-amber-950/70 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        cardBanner: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300',
        textColor: 'text-amber-600 dark:text-amber-400',
        title: 'Expiring Soon',
        message: 'Your pass expires soon. Please prepare for renewal.',
        actionLabel: 'Extend Pass',
        actionUrgent: true
      };

    case PASS_STATUS.ACTIVE:
    default:
      return {
        label: 'ACTIVE',
        code: 'active',
        dotColor: 'bg-emerald-400',
        badgeClass: 'bg-emerald-950/70 border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        cardBanner: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        title: 'Pass Active',
        message: 'Your pass is currently valid.',
        actionLabel: 'View Schedule',
        actionUrgent: false
      };
  }
}

/**
 * Native Device or Clipboard Sharing for transit credential
 * @param {Object} passData - Pass details
 * @returns {Promise<{success: boolean, method: string, message: string}>}
 */
export async function sharePass(passData) {
  const shareText = `SmartBus Digital Travel Pass:
• Passenger: ${passData.passengerName}
• Pass ID: ${passData.passId}
• Type: ${passData.passType}
• Route: ${passData.route}
• Valid Until: ${passData.validUntil}
• Status: ${passData.status}
(SmartBus Urban Intelligent Transit)`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'SmartBus Digital Travel Pass',
        text: shareText,
        url: window.location.href
      });
      return { success: true, method: 'native', message: 'Pass shared via system dialog.' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'native', message: 'Sharing cancelled.' };
      }
      // Fallback to clipboard on share error
    }
  }

  // Fallback to Clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'clipboard', message: 'Pass credential copied to clipboard!' };
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }

  return { success: false, method: 'none', message: 'Sharing is not supported on this browser.' };
}

/**
 * Prepares and triggers browser print action for boarding pass
 */
export function printPass() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

/**
 * Downloads a text-based digital ticket receipt summary
 * @param {Object} passData
 */
export function downloadTicketReceipt(passData) {
  if (typeof document === 'undefined') return;

  const content = `=====================================================
SMARTBUS TRANSIT AUTHORITY — DIGITAL BOARDING PASS
=====================================================
PASS ID         : ${passData.passId}
PASSENGER       : ${passData.passengerName}
PASS TYPE       : ${passData.passType}
TRANSIT ROUTE   : ${passData.route}
VALIDITY PERIOD : ${passData.validFrom} to ${passData.validUntil}
STATUS          : ${passData.status}
ISSUED BY       : SmartBus Urban Intelligent Transit
SECURITY HASH   : ${btoa(passData.passId + passData.validUntil).substring(0, 16)}
=====================================================
DEMONSTRATION TRANSIT CREDENTIAL (SIMULATED DATA)
=====================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SmartBus-Pass-${passData.passId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
