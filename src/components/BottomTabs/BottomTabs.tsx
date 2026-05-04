import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '../../context/ThemeContext';
import { Icon, IconName } from '../Icon';
import { createBottomTabsStyles } from './BottomTabs.style';

const ICON_FOR_ROUTE: Record<string, IconName> = {
  PulseDesk: 'pulse',
  Cases: 'cases',
  TraceView: 'trace',
  Alyna: 'sparkle',
  Impact: 'trophy',
};

export const BottomTabs: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createBottomTabsStyles(theme, insets.bottom);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabBtn,
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <View
                style={[
                  styles.iconWrap,
                  focused && styles.iconWrapActive,
                ]}
              >
                <Icon
                  name={ICON_FOR_ROUTE[route.name] ?? 'cases'}
                  size={20}
                  color={focused ? theme.colors.tabIconActive : theme.colors.tabIconInactive}
                  strokeWidth={focused ? 2.2 : 1.8}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  focused ? styles.labelActive : styles.labelInactive,
                ]}
                numberOfLines={1}
              >
                {label as string}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
