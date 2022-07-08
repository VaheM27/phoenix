import AnimatedLottieView from 'lottie-react-native';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '~/components';
import {screen, spacing} from '~/theme';

interface OnboardingTipDisplayerProps {
  animation: any;
  description: string;
}

const OnboardingTipDisplayer: FC<OnboardingTipDisplayerProps> = ({
  animation,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.animationContainer}>
          <AnimatedLottieView autoPlay loop source={animation} />
        </View>
        <Text variant="subTitle2Bold" top="medium" center>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screen.width,
    alignItems: 'center',
  },
  bodyContainer: {
    height: '100%',
    width: screen.contentWidth,
    paddingTop: spacing.medium,
    paddingHorizontal: spacing.small,
  },
  animationContainer: {
    width: screen.contentWidth - screen.contentOffset,
    height: screen.contentWidth - screen.contentOffset,
  },
});

export default OnboardingTipDisplayer;
