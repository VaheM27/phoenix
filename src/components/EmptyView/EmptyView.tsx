import AnimatedLottieView from 'lottie-react-native';
import React, {useCallback} from 'react';
import {
  StyleSheet,
  ViewProps,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing} from '../../theme';
import EmptyState, {EmptyStateProps} from './EmptyState';
import ErrorState, {ErrorStateProps} from './ErrorState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    color: colors.primary,
    backgroundColor: colors.transparent,
    borderRadius: 8,
    paddingHorizontal: spacing.xLarge,
    paddingVertical: spacing.medium,
    borderColor: colors.primary,
    borderWidth: 1,
  },
});

interface Props extends ViewProps, EmptyStateProps, ErrorStateProps {
  flex?: boolean;
  isLoading: Boolean;
  isFailed: Boolean;
  renderLoader?: React.FC;
}

export default function EmptyView(props: Props) {
  const {style, isFailed, isLoading, flex, renderLoader, ...rest} = props;

  const customStyle: ViewStyle = {
    flex: Number(!!flex), // If true then 1 else 0
  };

  const Loader = useCallback(() => {
    if (typeof renderLoader === 'function') {
      return renderLoader({});
    }
    return <ActivityIndicator color={colors.primary} />;
  }, [renderLoader]);

  return (
    <View style={[styles.container, customStyle, style]} {...rest}>
      {isLoading ? (
        <View style={{height: 100, width: '100%'}}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <>{isFailed ? <ErrorState {...props} /> : <EmptyState {...props} />}</>
      )}
    </View>
  );
}
