import {View} from '@motify/components';
import React, {FC} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Text} from '~/components';
import {colors, spacing} from '~/theme';

interface ConditionDisplayerProps {
  condition: string;
  style?: ViewStyle | ViewStyle[];
  width: number;
}

const ConditionDisplayer: FC<ConditionDisplayerProps> = ({
  condition,
  style,
  width,
}) => {
  const calculateWidth = () => {
    switch (condition) {
      case 'New':
        return width;
      case 'Mint':
        return width / 1.5;
      case 'Good':
        return width / 1.8;
      case 'Fair':
        return width / 3;
      default:
        return 0;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text
        variant="body1Bold"
        style={{position: 'absolute', top: 10, right: width - calculateWidth()}}
        color={colors.black}>
        {condition}
      </Text>
      <View
        style={{
          height: 3,
          width: calculateWidth(),
          position: 'absolute',
          backgroundColor: colors.black,
          borderRadius: 100,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xMedium,
    width: '100%',
    height: 4,
    backgroundColor: colors.grey,
    borderRadius: 100,
  },
});

export default ConditionDisplayer;
