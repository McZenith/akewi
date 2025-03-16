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
  BackHandler,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { scale } from '../../utils/scaling';
import Text from '../base/Text';
import ukFlag from '../../../assets/icons/uk-flag.png';
import nigeriaFlag from '../../../assets/icons/nigeria-flag.png';
import { colors } from '../../theme/colors';

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

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible]);

  const handleLanguageSelect = (code: string) => {
    onSelectLanguage(code);
    onClose();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 50,
        stiffness: 300,
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.handle} />
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
                  name={currentLanguage === language.code ? 'checkmark-circle' : 'radio-button-off'}
                  size={24}
                  color={currentLanguage === language.code ? '#00BA88' : '#C4C4C4'}
                />
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: Platform.OS === 'ios' ? scale(34) : scale(24),
    ...Platform.select({
      android: {
        elevation: 24,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
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
    color: colors.text.primary,
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
    color: colors.text.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
});

export default LanguageSelectionModal;
