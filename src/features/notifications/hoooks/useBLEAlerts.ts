import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL, getAccessToken } from '../../../api/api';
import type { WSMIAlert, AlertClaimedEvent, WSDoctorNotification } from '../../../types';

function toWsUrl(base: string): string {
  return base.replace(/^http/, 'ws').replace('/api/v1', '');
}

interface UseBLEAlertsOptions {
  onDoctorNotification?: (n: WSDoctorNotification) => void;
}

export const useBLEAlerts = (options?: UseBLEAlertsOptions) => {
  const [alerts, setAlerts]       = useState<WSMIAlert[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef                     = useRef<WebSocket | null>(null);
  const reconnectTimerRef         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNotifRef                = useRef(options?.onDoctorNotification);
  onNotifRef.current              = options?.onDoctorNotification;

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token) return;

    const url = `${toWsUrl(API_BASE_URL)}/ws/ecg-alerts/?token=${token}`;
    console.log('[useBLEAlerts] connecting to WS:', url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[useBLEAlerts] WS connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: WSMIAlert | AlertClaimedEvent | WSDoctorNotification =
          JSON.parse(event.data);
        console.log('[useBLEAlerts] WS message type:', data.type);

        if (data.type === 'mi_alert' && (data as WSMIAlert).mi_detected) {
          const incoming = data as WSMIAlert;
          setAlerts((prev) => {
            if (incoming.alert_id && prev.some((a) => a.alert_id === incoming.alert_id)) {
              return prev;
            }
            return [incoming, ...prev].slice(0, 20);
          });
        }

        if (data.type === 'alert_claimed') {
          const { alert_id } = data as AlertClaimedEvent;
          setAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
        }

        if (data.type === 'doctor_notification') {
          onNotifRef.current?.(data as WSDoctorNotification);
        }
      } catch (e) {
        console.log('[useBLEAlerts] WS parse error:', e);
      }
    };

    ws.onclose = () => {
      console.log('[useBLEAlerts] WS closed — reconnecting in 5s');
      setConnected(false);
      reconnectTimerRef.current = setTimeout(connect, 5000);
    };

    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const dismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const dismissAll = useCallback(() => setAlerts([]), []);

  const claimAlert = useCallback(async (alertId: string) => {
    try {
      await fetch(
        `${API_BASE_URL}/patients/alerts/${alertId}/claim/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );
    } catch {}
  }, []);

  return { alerts, connected, dismissAlert, dismissAll, claimAlert };
};