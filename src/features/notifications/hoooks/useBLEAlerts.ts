import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL, getAccessToken } from '../../../api/api';
import type { WSMIAlert, AlertClaimedEvent, WSDoctorNotification } from '../../../types';

function toWsUrl(base: string): string {
  return base.replace(/^http/, 'ws').replace('/api/v1', '');
}

interface UseBLEAlertsOptions {
  onDoctorNotification?: (n: WSDoctorNotification) => void;
  onActivePatientChange?: (code: string | null) => void;
}

export const useBLEAlerts = (options?: UseBLEAlertsOptions) => {
  const [alerts, setAlerts]             = useState<WSMIAlert[]>([]);
  const [connected, setConnected]       = useState(false);
  const [activePatientCode, setActivePatientCode] = useState<string | null>(null);
  const wsRef                           = useRef<WebSocket | null>(null);
  const reconnectTimerRef               = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePatientTimerRef           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNotifRef                      = useRef(options?.onDoctorNotification);
  const onActivePatientChangeRef        = useRef(options?.onActivePatientChange);
  const lastNotifKeyRef                 = useRef<string | null>(null);
  onNotifRef.current                    = options?.onDoctorNotification;
  onActivePatientChangeRef.current      = options?.onActivePatientChange;

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
          const notif = data as WSDoctorNotification;

          // Deduplicate 
          const timeWindow = Math.floor(Date.now() / 2000);
          const dedupKey = notif.id
            ? `id_${notif.id}`
            : `${notif.notification_type}_${(notif.payload as any)?.patient_code}_${timeWindow}`;
          if (lastNotifKeyRef.current === dedupKey) {
            console.log('[useBLEAlerts] duplicate suppressed — type:', notif.notification_type);
          } else {
            lastNotifKeyRef.current = dedupKey;
            onNotifRef.current?.(notif);

            if (notif.notification_type === 'patient_online' && notif.payload?.patient_code) {
              const code = notif.payload.patient_code as string;
              setActivePatientCode(code);
              onActivePatientChangeRef.current?.(code);
            }

            if (notif.notification_type === 'patient_offline') {
              setActivePatientCode(null);
              onActivePatientChangeRef.current?.(null);
            }
          }
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

  return { alerts, connected, activePatientCode, dismissAlert, dismissAll, claimAlert };
};