import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreen/HomeScreen';
import { CasesScreen } from '../screens/cases/CasesScreen/CasesScreen';
import { TraceViewScreen } from '../screens/traceview/TraceViewScreen/TraceViewScreen';
import { AlynaScreen } from '../screens/alyna/AlynaScreen/AlynaScreen';
import { ImpactScreen } from '../screens/impact/ImpactScreen/ImpactScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen/ProfileScreen';
import { ClaimDetailScreen } from '../screens/claim/ClaimDetailScreen/ClaimDetailScreen';
import { BottomTabs } from '../components/BottomTabs/BottomTabs';

export type AppStackParamList = {
  Tabs: undefined;
  ClaimDetail: { patientId?: number };
  Profile: undefined;
};

export type AppTabsParamList = {
  PulseDesk: undefined;
  Cases: undefined;
  TraceView: { patientId?: number; caseId?: number } | undefined;
  Alyna: { patientId?: number } | undefined;
  Impact: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<AppTabsParamList>();

const TabsNavigator: React.FC = () => (
  <Tabs.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomTabs {...props} />}
  >
    <Tabs.Screen name="PulseDesk" component={HomeScreen} />
    <Tabs.Screen name="Cases" component={CasesScreen} />
    <Tabs.Screen name="TraceView" component={TraceViewScreen} />
    <Tabs.Screen name="Alyna" component={AlynaScreen} />
    <Tabs.Screen name="Impact" component={ImpactScreen} />
  </Tabs.Navigator>
);

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="ClaimDetail" component={ClaimDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
