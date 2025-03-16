import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '../../utils/scaling';
import { colors } from '../../theme/colors';

interface HeaderProps {
  showBack?: boolean;
  onBackPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  showBack,
  onBackPress,
  leftComponent,
  rightComponent,
}) => {
  const insets = useSafeAreaInsets();

  const topPadding = Platform.select({
    ios: Math.max(insets.top - scale(8), 0), // Increased reduction for iOS
    android: insets.top,
  });

  return (
    <View style={[styles.wrapper, { paddingTop: topPadding }]}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={scale(24)} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {leftComponent}
        </View>
        <View style={styles.rightContainer}>{rightComponent}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
    paddingBottom: scale(4),
  },
  container: {
    width: '100%',
    height: scale(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    gap: scale(8),
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  backButton: {
    padding: scale(4),
  },
});

export default Header;
