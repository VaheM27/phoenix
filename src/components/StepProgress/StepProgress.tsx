import {MotiView} from '@motify/components';
import React, {FC} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '~/theme';
import {Text} from '..';

interface ProgressLineProps {
  totalSteps: number;
  step: number;
  style?: ViewStyle | ViewStyle[];
  width: number;
}

const StepProgress: FC<ProgressLineProps> = ({
  totalSteps,
  step,
  width,
  style,
}) => {
  const tempArr = Array.from({length: totalSteps}, (x, i) => i + 1);

  return (
    <View
      style={[
        styles.container,
        {
          width,
        },
        style,
      ]}>
      {tempArr.map((item, index) => {
        let isLast = index !== tempArr.length - 1;
        let completed = step > index;
        let determineBg = step >= index;
        return (
          <View
            key={index}
            style={[
              styles.stepContainer,
              {
                flex: isLast ? 1 : 0,
              },
            ]}>
            {
              <View
                style={[
                  styles.circleStyle,
                  {
                    backgroundColor: determineBg ? colors.black : colors.grey,
                  },
                ]}>
                <Text variant="caption1Regular" color={colors.white}>
                  {item}
                </Text>
              </View>
            }
            {isLast && (
              <View style={{width: '100%'}}>
                <View
                  style={[
                    styles.stepLine,
                    {
                      width: '100%',
                      backgroundColor: colors.grey,
                    },
                  ]}
                />

                <MotiView
                  from={{
                    width: completed ? 0 : width / (totalSteps - 1) - 30,
                  }}
                  animate={{
                    width: completed ? width / (totalSteps - 1) - 30 : 0,
                  }}
                  transition={{
                    shadowOpacity: {
                      type: 'spring',
                      mass: 5,
                    },
                    shadowRadius: {
                      mass: 3,
                    },
                  }}
                  style={{
                    flexDirection: 'row',

                    backgroundColor: colors.black,
                    height: 2,
                    position: 'absolute',
                  }}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circleStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepLine: {
    height: 2,
  },
});

export default StepProgress;
