import {useHeaderHeight} from '@react-navigation/elements';
import * as React from 'react';
import {KeyboardAvoidingView, ScrollView, View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, isIOS, spacing} from '../../theme';
import {ScreenProps} from './Screen.props';

const ScrollContainer = React.forwardRef((props, ref) => {
  return (
    <ScrollView // @ts-ignore
      ref={ref} // @ts-ignore
      style={[{flex: 1}, props.style]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={{flexGrow: 1}}>
      {props.children}
    </ScrollView>
  );
});

function ScreenComponent(props: ScreenProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const {
    safe,
    scrollRef,
    horizontal = 'content',
    top = 'none',
    bottom = 'none',
    color = 'background',
    scrollable,
    style,
  } = props;

  const paddingBottom = safe
    ? Math.max(insets.bottom, spacing.normal)
    : spacing[bottom];

  const customStyle = {
    paddingTop: spacing[top],
    paddingBottom,
    backgroundColor: colors[color],
    paddingHorizontal: spacing[horizontal],
  };

  const keyboardOffset = headerHeight + spacing.medium - paddingBottom;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardOffset}
      style={{flex: 1}}
      behavior={isIOS ? 'padding' : undefined}>
      {scrollable ? (
        <ScrollContainer // @ts-ignore
          ref={scrollRef}
          style={{backgroundColor: colors[color]}}>
          <View style={[styles.container, customStyle, style]}>
            {props.children}
          </View>
        </ScrollContainer>
      ) : (
        <View style={[styles.container, customStyle, style]}>
          {props.children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

export default function Screen({...props}: ScreenProps) {
  return <ScreenComponent {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.content,
  },
});
