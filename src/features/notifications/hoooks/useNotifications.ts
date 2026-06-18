import { useState, useEffect, useCallback, useRef } from 'react';
import { api, getAccessToken } from '../../../api/api';
import type { DoctorNotification, WSDoctorNotification } from '../../../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [activePatientCode, setActivePatientCode] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchList = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.notifications.getList({ limit: 20 });
      setNotifications(res.results);
      setUnreadCount(res.unread);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await api.notifications.getCount();
      setUnreadCount(res.unread);
    } catch {}
  }, []);

  // Initial load + 30s poll
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCount();
    }
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Called by useBLEAlerts when WS doctor_notification arrives
  const handleWsNotification = useCallback((n: WSDoctorNotification) => {
    const newNotif: DoctorNotification = {
      id:                n.id,
      notification_type: n.notification_type,
      title:             n.title,
      message:           n.message,
      payload:           n.payload,
      is_read:           false,
      created_at:        n.created_at,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
    setUnreadCount(n.unread_count);

   if (n.notification_type === 'patient_online' && n.payload?.patient_code) {
      setActivePatientCode(n.payload.patient_code as string);
    }
    if (n.notification_type === 'patient_offline') {
      setActivePatientCode(null);
    }
  }, []);

  const markRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await api.notifications.markRead(id);
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await api.notifications.markAllRead();
    } catch {
      fetchList();
    }
  }, [fetchList]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchList,
    markRead,
    markAllRead,
    handleWsNotification,
    activePatientCode,
  };
};