import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {colors, shadow, spacing} from '~/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  container: {
    ...shadow.normal,
    position: 'absolute',
    bottom: spacing.content,
    right: spacing.content,
    justifyContent: 'center',
    alignItems: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
});

type Props = {
  style?: TouchableOpacityProps['style'];
  onPress: () => void;
};

export default function FloatingAddButton({onPress, style}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Icon size={26} name={'plus'} color={colors.white} />
    </TouchableOpacity>
  );
}
