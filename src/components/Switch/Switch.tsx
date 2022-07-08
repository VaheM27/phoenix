import React, {FC} from 'react';
import {StyleSheet, View, Switch as RNSwitch} from 'react-native';
import {colors, spacing} from '~/theme';
import {Text} from '..';

interface SwitchProps {
  text: string;
  onPress: (value: boolean) => void;
  description: string;
  value: boolean;
}

const Switch: FC<SwitchProps> = ({description, onPress, text, value}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: spacing.medium,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text variant="body1Regular">{text}</Text>
        <RNSwitch value={value} onValueChange={value => onPress(value)} />
      </View>
      <Text
        top="medium"
        variant="caption1Regular"
        style={{maxWidth: '80%'}}
        color={colors.darkGrey}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Switch;
