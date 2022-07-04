import React, {FC} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '~/components';
import {colors, spacing} from '~/theme';

interface DetailDisplayerProps {
  title: string;
  style?: ViewStyle | ViewStyle[];
  containerRight?: () => React.ReactNode;
}

const DetailDisplayer: FC<DetailDisplayerProps> = ({
  children,
  title,
  style,
  containerRight,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text variant="body1Bold">{title}</Text>
      <View style={styles.textContainer}>
        <Text variant="body1Bold" color={colors.darkGrey}>
          {children}
        </Text>
        {containerRight && containerRight()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  textContainer: {
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: spacing.small,
    padding: spacing.medium,
    paddingLeft: spacing.large,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default DetailDisplayer;
