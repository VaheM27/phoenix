import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {colors, spacing} from '../../theme';
import Text from '../Text';

StyleSheet.create({
  container: {
    flex: 1,
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

export interface EmptyStateProps {
  title?: string;
  details?: string;
  renderIcon?: (props: any) => React.ReactNode;
}

export default function EmptyState(props: EmptyStateProps) {
  const {t} = useTranslation();
  const {
    title,
    details = t('there_is_no_data_pull_to_refresh'), // There is no data to display, pull down to refresh
    renderIcon,
  } = props;
  return (
    <>
      <View>
        {renderIcon?.({color: colors.black}) || (
          <View>{/* TODO: Add default icon */}</View>
        )}
      </View>
      {!!title && (
        <Text
          center
          style={{marginTop: spacing.huge}}
          variant={'title2Medium'}
          top={'xLarge'}
          bottom={'small'}
          text={title}
        />
      )}
      <Text
        style={{marginTop: spacing.xSmall}}
        variant={'body2Regular'}
        center
        text={details}
      />
    </>
  );
}
