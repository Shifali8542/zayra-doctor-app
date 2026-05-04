import React, { ReactNode } from 'react';
import { ScrollView, View, ViewStyle, StyleProp, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../utils/useResponsive';
import { getMaxContentWidth } from '../../utils/responsive';
import { createLayoutStyles } from './Layout.style';

interface LayoutProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  paddingHorizontal?: number;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: ('top' | 'bottom')[];
  showsVerticalScrollIndicator?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  bottomInsetExtra?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  scroll = true,
  padded = true,
  paddingHorizontal,
  contentStyle,
  containerStyle,
  backgroundColor,
  edges = ['top'],
  showsVerticalScrollIndicator = false,
  refreshing,
  onRefresh,
  bottomInsetExtra = 0,
}) => {
  const theme = useAppTheme();
  const { deviceType } = useResponsive();
  const insets = useSafeAreaInsets();
  const styles = createLayoutStyles(theme, deviceType);

  const maxWidth = getMaxContentWidth(deviceType);
  const hPad = paddingHorizontal ?? (padded ? theme.spacing.xl : 0);
  const topPad = edges.includes('top') ? insets.top : 0;
  const bottomPad =
    (edges.includes('bottom') ? insets.bottom : 0) + bottomInsetExtra;

  const innerWrapper: ViewStyle = {
    width: '100%',
    maxWidth,
    alignSelf: 'center',
    paddingHorizontal: hPad,
  };

  const bg = backgroundColor ?? theme.colors.background;

  if (!scroll) {
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: bg, paddingTop: topPad, paddingBottom: bottomPad },
          containerStyle,
        ]}
      >
        <View style={[innerWrapper, { flex: 1 }, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: bg, paddingTop: topPad },
        containerStyle,
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          innerWrapper,
          { paddingBottom: bottomPad + theme.spacing.xl },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};
