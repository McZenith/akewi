import { scale, verticalScale } from '../../utils/scaling';

export const LOGIN_SCREEN_LAYOUT = {
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: verticalScale(300),
  },
  header: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
    },
  },
  form: {
    container: {
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      paddingHorizontal: scale(24),
      paddingTop: scale(32),
      paddingBottom: scale(24),
    },
    logo: {
      width: scale(120),
      height: scale(120),
      marginBottom: scale(24),
    },
    description: {
      marginBottom: scale(32),
      paddingHorizontal: scale(16),
    },
    continueButton: {
      width: '100%',
      height: verticalScale(48),
      borderRadius: scale(8),
      marginTop: scale(16),
    },
  },
  alternative: {
    marginVertical: scale(16),
  },
  social: {
    container: {
      gap: scale(16),
    },
  },
} as const;
