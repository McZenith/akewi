import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useVoiceGuidance } from '../../providers/VoiceGuidanceProvider';
import { scale } from '../../utils/scaling';

// Import the three state icons
import voiceInactiveIcon from '../../../assets/images/voice-inactive.png';
import voiceActiveIcon from '../../../assets/images/voice-active.png';
import voiceWaitingIcon from '../../../assets/images/voice-waiting.png';

interface VoiceButtonProps {
  size?: number;
  style?: any;
  onPress?: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  size = 30,
  style,
  onPress: externalOnPress,
}) => {
  const { isActive, isWaitingForInput, startVoiceGuidance, stopVoiceGuidance } = useVoiceGuidance();

  const handlePress = () => {
    if (externalOnPress) {
      externalOnPress();
    } else {
      if (isActive) {
        stopVoiceGuidance();
      } else {
        startVoiceGuidance();
      }
    }
  };

  const getIcon = () => {
    if (isWaitingForInput) {
      return voiceWaitingIcon;
    }
    if (isActive) {
      return voiceActiveIcon;
    }
    return voiceInactiveIcon;
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={isActive ? 'Stop voice guidance' : 'Start voice guidance'}
    >
      <Image
        source={getIcon()}
        style={[styles.icon, { width: scale(size), height: scale(size) }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: scale(8),
  },
  icon: {
    width: scale(30),
    height: scale(30),
  },
});
