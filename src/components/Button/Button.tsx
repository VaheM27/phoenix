import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  TextStyle,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import {colors, typography, spacing} from '~/theme';
import Text from '../Text';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.normal,
    borderRadius: 8,
  },
  outlinedButton: {
    color: colors.primary,
    backgroundColor: colors.transparent,
    borderRadius: 8,
    paddingVertical: spacing.normal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  buttonTextStyle: {
    textAlign: 'center', // <-- the magic
  },
});

interface Props extends TouchableOpacityProps {
  waitAsync?: boolean;
  color?: string;
  textColor?: string;
  textVariant?: keyof typeof typography;
  loading?: boolean;
  isOutlined?: boolean;
  text?: string;
  children?: React.ReactNode;
  textStyle?: TextStyle;
  top?: keyof typeof spacing;
  start?: keyof typeof spacing;
  end?: keyof typeof spacing;
  bottom?: keyof typeof spacing;
  flex?: boolean;
  onPromise?: () => Promise<void>;
  onPress?: ((event: GestureResponderEvent) => void) & (() => void);
}

export default function Button(props: Props) {
  const {
    color = colors.primary,
    textColor = colors.white,
    textStyle,
    textVariant = 'body1Regular',
    loading,
    text,
    children,
    isOutlined,
    onPress,
    style,
    top = 'none',
    bottom = 'none',
    start = 'none',
    end = 'none',
    flex = false,
    onPromise,
    ...rest
  } = props;

  // If disabled show disabled color
  let backgroundColor = props.disabled ? colors.disabled : color;
  backgroundColor = isOutlined ? colors.transparent : backgroundColor;
  const buttonStyle = isOutlined ? styles.outlinedButton : styles.container;
  const buttonTextColor = isOutlined ? colors.primary : textColor;
  const content = children || (
    <Text
      variant={textVariant}
      style={[styles.buttonTextStyle, textStyle]}
      color={buttonTextColor}
      text={text}
    />
  );
  const customStyle: ViewStyle = {
    marginTop: spacing[top],
    marginBottom: spacing[bottom],
    marginStart: spacing[start],
    marginEnd: spacing[end],
    backgroundColor,
    flex: flex ? 1 : 0,
  };

  const [disabledButton, setDisabled] = useState(false);

  const clickButton = async () => {
    setDisabled(true);
    if (onPromise) {
      await onPromise();
      setDisabled(false);
    } else if (onPress) {
      onPress();
      setDisabled(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={disabledButton}
      activeOpacity={0.7}
      onPress={clickButton}
      style={[buttonStyle, customStyle, style]}
      {...rest}>
      {loading ? <ActivityIndicator color={colors.white} /> : content}
    </TouchableOpacity>
  );
}
