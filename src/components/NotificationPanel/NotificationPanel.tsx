/**
 * NotificationPanel.tsx
 * Slide-in notification drawer — matches doctor web's NotificationPanel.
 */
import React from 'react';
import {
  Modal, Pressable, ScrollView, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon } from '../Icon';
import { createNotificationPanelStyles } from './NotificationPanel.style';
import type { DoctorNotification } from '../../types';

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface NotificationPanelProps {
  visible: boolean;
  notifications: DoctorNotification[];
  unreadCount: number;
  loading: boolean;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  visible, notifications, unreadCount, loading, onMarkRead, onMarkAllRead, onClose,
}) => {
  const theme  = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createNotificationPanelStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.panel, { marginTop: insets.top + 56 }]} onPress={() => {}}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerRight}>
              {unreadCount > 0 && (
                <Pressable onPress={onMarkAllRead} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
                  <Text style={styles.markAllText}>Mark all read</Text>
                </Pressable>
              )}
              <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
                <Icon name="close-circle" size={18} color={theme.colors.textTertiary} />
              </Pressable>
            </View>
          </View>

          {/* List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {loading && notifications.length === 0 ? (
              <Text style={styles.emptyText}>Loading…</Text>
            ) : notifications.length === 0 ? (
              <Text style={styles.emptyText}>No notifications yet</Text>
            ) : (
              notifications.map((n) => (
                <Pressable
                  key={n.id}
                  onPress={() => { onMarkRead(n.id); onClose(); }}
                  style={({ pressed }) => [
                    styles.notifRow,
                    !n.is_read && styles.notifRowUnread,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  {/* Type dot */}
                  <View style={[
                    styles.typeDot,
                    { backgroundColor: n.notification_type === 'mi_alert' ? theme.colors.danger : theme.colors.success },
                  ]} />

                  <View style={styles.notifContent}>
                    <Text style={[styles.notifTitle, !n.is_read && { fontWeight: '700' }]} numberOfLines={1}>
                      {n.title}
                    </Text>
                    <Text style={styles.notifMessage} numberOfLines={2}>{n.message}</Text>
                    <Text style={styles.notifTime}>{timeAgo(n.created_at)}</Text>
                  </View>

                  {/* Unread indicator */}
                  {!n.is_read && <View style={styles.unreadDot} />}
                </Pressable>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};