import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar/Avatar';
import { createHeaderStyles } from './Header.style';

const logoImage = require('../../assets/icon.png');

interface HeaderProps {
  onProfilePress?: () => void;
  onBellPress?: () => void;
  unreadCount?: number;
}

const computeInitials = (
  firstName?: string,
  lastName?: string,
  email?: string,
): string => {
  const f = (firstName?.[0] || email?.[0] || 'D').toUpperCase();
  const l = (lastName?.[0] || 'R').toUpperCase();
  return `${f}${l}`;
};

export const Header: React.FC<HeaderProps> = ({
  onProfilePress,
  onBellPress,
  unreadCount = 0,
}) => {
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const styles = createHeaderStyles(theme);

  const initials = computeInitials(user?.first_name, user?.last_name, user?.email);

  const handleProfile = () => {
    if (onProfilePress) onProfilePress();
    else navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandWrap}>
        <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onBellPress}
          style={({ pressed }) => [styles.bellBtn, pressed && styles.pressed]}
          hitSlop={6}
        >
          <Icon name="bell" size={18} color={theme.colors.textPrimary} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={handleProfile}
          style={({ pressed }) => [pressed && styles.pressed]}
          hitSlop={6}
        >
          <Avatar initials={initials} size={40} />
        </Pressable>
      </View>
    </View>
  );
};