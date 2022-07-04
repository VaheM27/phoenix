import * as React from 'react';
import {
  Text as ReactNativeText,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {colors, spacing, typography} from '../../theme';
import {TextProps} from './Text.props';

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */

export default function Text(props: TextProps) {
  // grab the props
  const {
    variant = 'body1Regular',
    center,
    text,
    children,
    style: styleOverride,
    containerStyle,
    touchable,
    top = 'none',
    bottom = 'none',
    ...rest
  } = props;
  let {color = undefined} = props;
  // If there is no color and the text is touchable add link color
  if (!color && touchable) {
    color = colors.link;
  }

  // figure out which content to use
  const content = text || children;

  const customStyle: TextStyle = {
    marginTop: spacing[top],
    marginBottom: spacing[bottom],
    textAlign: center ? 'center' : 'left',
  };
  if (color) {
    customStyle.color = color;
  }

  const style = [typography[variant], customStyle, styleOverride];

  if (touchable) {
    return (
      <TouchableOpacity onPress={props.onPress} style={containerStyle}>
        <ReactNativeText {...rest} onPress={undefined} style={style}>
          {content}
        </ReactNativeText>
      </TouchableOpacity>
    );
  }
  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  );
}
