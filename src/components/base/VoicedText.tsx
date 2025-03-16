import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useVoiceGuidance } from '../../providers/VoiceGuidanceProvider';

interface VoicedTextProps {
  children: React.ReactNode;
  voiceElementId: string;
  style?: TextStyle;
}

export const VoicedText: React.FC<VoicedTextProps> = ({ children, voiceElementId, style }) => {
  const { currentElementId } = useVoiceGuidance();
  const isBeingVoiced = currentElementId === voiceElementId;

  return (
    <Text
      style={[styles.text, isBeingVoiced && styles.highlighted, style]}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000000',
  },
  highlighted: {
    backgroundColor: '#FF4B26',
    color: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    padding: 2,
  },
});
