import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from '../../utils/scaling';
import Text from '../base/Text';
import ukFlag from '../../../assets/icons/uk-flag.png';
import nigeriaFlag from '../../../assets/icons/nigeria-flag.png';

interface Language {
  code: string;
  displayName: string;
  flag?: any;
}

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  currentLanguage: string;
}

const languages: Language[] = [
  {
    code: 'English',
    displayName: 'English',
    flag: ukFlag,
  },
  {
    code: 'Yoruba',
    displayName: 'Yoruba',
    flag: nigeriaFlag,
  },
];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  onClose,
  onSelectLanguage,
  currentLanguage,
}) => {
  const { t } = useTranslation();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  const handleLanguageSelect = (code: string) => {
    onSelectLanguage(code);
    onClose();
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: event => {
      if (event.translationY > 100) {
        translateY.value = withSpring(SCREEN_HEIGHT);
        opacity.value = withTiming(0, { duration: 150 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 0.4,
      });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 90,
        mass: 0.4,
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <Animated.View style={[styles.container, animatedContainerStyle]}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View>
                <Pressable onPress={onClose}>
                  <View style={styles.handle} />
                </Pressable>
              </Animated.View>
            </PanGestureHandler>
            <Text style={styles.title}>{t('language.select')}</Text>

            {languages.map((language, index) => (
              <React.Fragment key={language.code}>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageContent}>
                    <Image source={language.flag} style={styles.flagIcon} resizeMode="contain" />
                    <Text style={styles.languageName}>{language.displayName}</Text>
                  </View>
                  <Ionicons
                    name={
                      currentLanguage === language.code ? 'checkmark-circle' : 'radio-button-off'
                    }
                    size={24}
                    color={currentLanguage === language.code ? '#00BA88' : '#C4C4C4'}
                  />
                </TouchableOpacity>
                {index < languages.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingTop: scale(12),
    paddingHorizontal: scale(16),
    paddingBottom: Platform.OS === 'ios' ? scale(34) : scale(16),
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  handle: {
    alignSelf: 'center',
    width: scale(32),
    height: scale(4),
    backgroundColor: '#E8E8E8',
    borderRadius: scale(2),
    marginBottom: scale(16),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#090909',
    marginBottom: scale(16),
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(8),
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  flagIcon: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
  },
  languageName: {
    fontSize: scale(16),
    fontWeight: '500',
    color: '#090909',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
});

export default LanguageSelectionModal;
