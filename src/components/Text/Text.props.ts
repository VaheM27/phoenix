import {
  TextStyle,
  TextProps as TextProperties,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import {spacing, typography} from '../../theme';

export interface TextProps extends TextProperties {
  /**
   * Children components.
   */
  children?: React.ReactNode;

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle | [TextStyle?];

  containerStyle?: ViewStyle;

  /**
   * One of the different types of text typography.
   */
  variant?: keyof typeof typography;

  color?: string;

  touchable?: boolean;
  center?: boolean;

  top?: keyof typeof spacing;
  bottom?: keyof typeof spacing;

  onPress?:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
}
