import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { scale } from '../../utils/scaling';
import voiceIcon from '../../../assets/images/screenreader.png';

interface VoiceButtonProps {
  onPress: () => void;
  style?: any;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity
    style={[style]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel="Activate voice input"
  >
    <Image source={voiceIcon} style={styles.icon} resizeMode="contain" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  icon: {
    width: scale(30),
    height: scale(30),
  },
});

export default VoiceButton;
