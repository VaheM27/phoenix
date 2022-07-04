import {Dimensions, Platform} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const spacing = {
  none: 0,
  tiny: 4,
  smaller: 6,
  small: 8,
  xSmall: 10,
  medium: 12,
  xMedium: 14,
  normal: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 28,
  xxxLarge: 34,
  huge: 40,
  massive: 60,
  content: 24,
};

export const screen = {
  width,
  height,
  contentWidth: width - spacing.content * 2,
  contentOffset: spacing.content,
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const TAB_BAR_HEIGHT = 80;
