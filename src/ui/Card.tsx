import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Original card dimensions from design
const DESIGN_CARD_WIDTH = 338;
const DESIGN_CARD_HEIGHT = 386;

// Calculate responsive width and maintain aspect ratio
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, DESIGN_CARD_WIDTH);
const CARD_HEIGHT = (CARD_WIDTH * DESIGN_CARD_HEIGHT) / DESIGN_CARD_WIDTH;

// Scale factor for responsive text positioning
const SCALE_FACTOR = CARD_WIDTH / DESIGN_CARD_WIDTH;

const theme = {
  colors: {
    primary: '#FD5312',
    secondary: '#BA0000',
    tertiary: '#FF4747',
    white: '#FFFFFF',
    transparent: 'transparent',
  },
} as const;

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  stats?: {
    tracks: number;
    oriki: number;
  };
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
  backgroundColor?: string;
  useComplexGradient?: boolean;
}

export default function Card({
  title,
  subtitle,
  description,
  stats,
  style,
  onPress,
  testID,
  backgroundColor,
  useComplexGradient = false,
}: Readonly<CardProps>) {
  const CardBackground = ({ children }: { children: React.ReactNode }) => {
    if (backgroundColor) {
      return <View style={[styles.gradient, { backgroundColor }]}>{children}</View>;
    }

    if (useComplexGradient) {
      // Create overlapping gradients to match Figma design
      return (
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['#FD5312', '#FF4747']}
            style={[styles.gradient, styles.absoluteFill]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.83, y: 0.83 }} // Approximates 146.02 degrees
            locations={[0.0042, 0.5586]}
          />
          <LinearGradient
            colors={['#FD5312', '#BA0000']}
            style={[styles.gradient, styles.absoluteFill]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.83, y: 0.83 }} // Approximates 146.02 degrees
            locations={[0.0042, 0.5586]}
          />
          <View style={styles.content}>{children}</View>
        </View>
      );
    }

    return (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.83, y: 0.83 }}
        locations={[0.0042, 0.5586]}
      >
        {children}
      </LinearGradient>
    );
  };

  return (
    <Pressable style={[styles.cardContainer, style]} onPress={onPress} testID={testID}>
      <CardBackground>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2} allowFontScaling={false}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1} allowFontScaling={false}>
                {subtitle}
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            {description && (
              <Text style={styles.description} numberOfLines={3} allowFontScaling={false}>
                {description}
              </Text>
            )}

            {stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsText} allowFontScaling={false}>
                  {stats.tracks} tracks
                </Text>
                <View style={styles.dot} />
                <Text style={styles.statsText} allowFontScaling={false}>
                  {stats.oriki} Oriki
                </Text>
              </View>
            )}
          </View>
        </View>
      </CardBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24 * SCALE_FACTOR,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(188, 14, 14, 0.25)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 24 * SCALE_FACTOR,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24 * SCALE_FACTOR,
  },
  header: {
    alignItems: 'flex-end',
    width: '100%',
  },
  title: {
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      android: 'Inter-Bold',
    }),
    fontSize: Math.max(32 * SCALE_FACTOR, 24),
    lineHeight: Math.max(32 * SCALE_FACTOR, 24) * 1.1,
    letterSpacing: -0.96 * SCALE_FACTOR,
    color: '#FFFFFF',
    textAlign: 'right',
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium',
    }),
    fontSize: Math.max(16 * SCALE_FACTOR, 14),
    lineHeight: Math.max(22.4 * SCALE_FACTOR, 18),
    color: '#FFFFFF',
    textAlign: 'right',
    opacity: 0.85,
    marginTop: 4 * SCALE_FACTOR,
    includeFontPadding: false,
  },
  footer: {
    gap: 13 * SCALE_FACTOR,
  },
  description: {
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium',
    }),
    fontSize: Math.max(11 * SCALE_FACTOR, 11),
    lineHeight: Math.max(15.4 * SCALE_FACTOR, 15.4),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5 * SCALE_FACTOR,
  },
  statsText: {
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
    }),
    fontSize: Math.max(12 * SCALE_FACTOR, 12),
    lineHeight: Math.max(15.6 * SCALE_FACTOR, 15.6),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  dot: {
    width: 2.93 * SCALE_FACTOR,
    height: 2.93 * SCALE_FACTOR,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
});
