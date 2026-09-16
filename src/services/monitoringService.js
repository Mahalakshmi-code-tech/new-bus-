/**
 * SmartBus Telemetry & Performance Monitoring Service
 * -------------------------------------------------------------
 * Safely collects non-intrusive performance and error metrics.
 * GUARANTEES: Never logs passwords, auth tokens, credit cards, or PII.
 */

import { stripSensitiveFields } from '../utils/sanitization';

class MonitoringService {
  constructor() {
    this.metrics = [];
    this.maxStoredMetrics = 50;
    this.isEnabled = import.meta.env?.VITE_ENABLE_PERF_MONITORING !== 'false';
  }

  /**
   * Tracks a route transition time
   */
  logRouteTransition(fromRoute, toRoute, durationMs) {
    if (!this.isEnabled) return;
    const metric = {
      type: 'ROUTE_TRANSITION',
      from: fromRoute,
      to: toRoute,
      durationMs: Math.round(durationMs),
      timestamp: new Date().toISOString()
    };
    this.pushMetric(metric);
  }

  /**
   * Logs a slow operation or Web Vital
   */
  logPerformanceMetric(name, valueMs) {
    if (!this.isEnabled) return;
    const metric = {
      type: 'PERFORMANCE',
      name,
      valueMs: Math.round(valueMs),
      timestamp: new Date().toISOString()
    };
    this.pushMetric(metric);
  }

  /**
   * Safely captures and sanitizes application or API errors
   */
  logError(context, error, extraData = {}) {
    if (!this.isEnabled) return;
    const safeData = stripSensitiveFields(extraData);
    const metric = {
      type: 'ERROR',
      context,
      message: error?.message || String(error),
      data: safeData,
      timestamp: new Date().toISOString()
    };
    this.pushMetric(metric);
    console.warn(`[SmartBus Monitor] Error in ${context}:`, metric.message);
  }

  pushMetric(metric) {
    if (this.metrics.length >= this.maxStoredMetrics) {
      this.metrics.shift();
    }
    this.metrics.push(metric);
  }

  getMetricsSummary() {
    return {
      totalLogged: this.metrics.length,
      recentMetrics: [...this.metrics]
    };
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;
