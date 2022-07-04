import {MutableRefObject} from 'react';
import {ScrollView, ViewStyle} from 'react-native';
import {colors, spacing} from '../../theme';
export interface ScreenProps {
  children?: React.ReactNode;
  style?: ViewStyle;

  /*
   * Screen background color
   * Default value if it's a safe screen 'white' otherwise 'background'
   */
  color?: keyof typeof colors;

  scrollable?: boolean; // Wrap content inside ScrollView? Defaults to false.
  scrollRef?: MutableRefObject<ScrollView | undefined>; // ScrollView ref

  safe?: boolean; // Wrap content inside SafeAreaView? Defaults to false.
  horizontal?: keyof typeof spacing; // Horizontal Padding: Default 'content'
  top?: keyof typeof spacing; // Padding top
  bottom?: keyof typeof spacing; // Padding bottom

  keyboardOffset?: number;
}
