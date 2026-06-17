import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNotifications } from '../features/notifications/hoooks/useNotifications';
import { useBLEAlerts } from '../features/notifications/hoooks/useBLEAlerts';
import { MIAlertModal } from '../components/MIAlertModal/MIAlertModal';
import { NotificationPanel } from '../components/NotificationPanel/NotificationPanel';
import { HomeScreen } from '../screens/home/HomeScreen/HomeScreen';
import { CasesScreen } from '../screens/cases/CasesScreen/CasesScreen';
import { TraceViewScreen } from '../screens/traceview/TraceViewScreen/TraceViewScreen';
import { AlynaScreen } from '../screens/alyna/AlynaScreen/AlynaScreen';
import { ImpactScreen } from '../screens/impact/ImpactScreen/ImpactScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen/ProfileScreen';
import { ClaimDetailScreen } from '../screens/claim/ClaimDetailScreen/ClaimDetailScreen';
import { GrandRoundsScreen } from '../screens/grandRounds/GrandRoundsScreen/GrandRoundsScreen';
import { EarningsScreen } from '../screens/earnings/EarningsScreen/EarningsScreen';
import { EcgAtlasScreen } from '../screens/ecgAtlas/EcgAtlasScreen/EcgAtlasScreen';
import { BottomTabs } from '../components/BottomTabs/BottomTabs';

export type AppStackParamList = {
  Tabs: undefined;
  ClaimDetail: { caseId?: number; patientId?: number };
  Profile: undefined;
  GrandRounds: undefined;
  Earnings: undefined;
  EcgAtlas: undefined;
};

export type AppTabsParamList = {
  PulseDesk: undefined;
  Cases: undefined;
  TraceView: { patientId?: number; caseId?: number } | undefined;
  Alyna: { patientId?: number; caseId?: number } | undefined;
  Impact: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tabs  = createBottomTabNavigator<AppTabsParamList>();

interface TabsNavigatorProps {
  unreadCount?: number;
  onBellPress?: () => void;
}

const TabsNavigator: React.FC<TabsNavigatorProps> = ({ unreadCount = 0, onBellPress }) => (
  <Tabs.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomTabs {...props} />}
  >
    <Tabs.Screen name="PulseDesk" children={(props) => <HomeScreen {...props} unreadCount={unreadCount} onBellPress={onBellPress} />} />
    <Tabs.Screen name="Cases"     children={(props) => <CasesScreen {...props} unreadCount={unreadCount} onBellPress={onBellPress} />} />
    <Tabs.Screen name="TraceView" component={TraceViewScreen} />
    <Tabs.Screen name="Alyna"     component={AlynaScreen} />
    <Tabs.Screen name="Impact"    children={(props) => <ImpactScreen {...props} unreadCount={unreadCount} onBellPress={onBellPress} />} />
  </Tabs.Navigator>
);

export const AppNavigator: React.FC = () => {
  const [showNotifPanel, setShowNotifPanel] = React.useState(false);

  const {
    notifications, unreadCount, loading: notifLoading,
    fetchList, markRead, markAllRead, handleWsNotification,
  } = useNotifications();

  const { alerts, dismissAlert, claimAlert } = useBLEAlerts({
    onDoctorNotification: handleWsNotification,
  });

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        screenListeners={{
          state: (e) => console.log('[NAV] state change:', JSON.stringify(e.data?.state?.routes?.map((r: any) => r.name))),
          focus: (e) => console.log('[NAV] focused:', e.target),
          blur: (e) => console.log('[NAV] blurred:', e.target),
        }}
      >
        <Stack.Screen
          name="Tabs"
          children={(props) => (
            <TabsNavigator
              {...props}
              unreadCount={unreadCount}
              onBellPress={() => { fetchList(); setShowNotifPanel(true); }}
            />
          )}
        />
        <Stack.Screen
          name="ClaimDetail"
          children={(props) => (
            <ClaimDetailScreen
              {...props}
              unreadCount={unreadCount}
              onBellPress={() => { fetchList(); setShowNotifPanel(true); }}
            />
          )}
        />
        <Stack.Screen name="Profile"     component={ProfileScreen} />
        <Stack.Screen name="GrandRounds" component={GrandRoundsScreen} />
        <Stack.Screen name="Earnings"    component={EarningsScreen} />
        <Stack.Screen name="EcgAtlas"    component={EcgAtlasScreen} />
      </Stack.Navigator>

      {/* MI Alert Modal — visible on every screen */}
      <MIAlertModal
        alerts={alerts}
        onClaim={claimAlert}
        onDismiss={dismissAlert}
      />

      {/* Notification Panel */}
      <NotificationPanel
        visible={showNotifPanel}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={notifLoading}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onClose={() => setShowNotifPanel(false)}
      />
    </>
  );
};