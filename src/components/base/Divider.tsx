import React from 'react';
import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale, verticalScale } from '../../utils/scaling';
import { VoicedText } from './VoicedText';
import useAppTranslation from '../../hooks/useAppTranslation';

interface DividerProps {
  text?: string;
  translationKey?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  voiceElementId?: string;
}

const Divider = ({ text, translationKey, style, textStyle, voiceElementId }: DividerProps) => {
  const { t } = useAppTranslation();

  const displayText = translationKey ? t(translationKey, text || '') : text;

  // If there's no text, render a simple line
  if (!displayText) {
    return <View style={[styles.divider, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <VoicedText style={[styles.text, textStyle]} voiceElementId={voiceElementId}>
        {displayText}
      </VoicedText>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    width: '100%',
    marginVertical: verticalScale(16),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: verticalScale(16),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  text: {
    paddingHorizontal: scale(16),
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
});

export default Divider;
