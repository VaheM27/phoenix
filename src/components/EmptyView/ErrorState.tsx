import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, spacing} from '../../theme';
import Text from '../Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
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

export interface ErrorStateProps {
  errorMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  onRetry: () => void;
}

export default function ErrorState(props: ErrorStateProps) {
  const {t} = useTranslation();
  const {
    errorMessage = t('something_went_wrong'), // Something went wrong
    errorTitle = t('error_happened'), // Error Happened
    retryButtonText = t('retry'), // Retry
    onRetry,
  } = props;

  return (
    <>
      <View>
        <MaterialIcons size={56} name="error" />
      </View>
      <Text
        center
        variant={'title2Medium'}
        top={'large'}
        bottom={'small'}
        text={errorTitle}
      />

      <Text variant={'body2Regular'} center text={errorMessage} />
      <TouchableOpacity
        style={{marginTop: spacing.large}}
        onPress={() => onRetry?.()}>
        <Text
          variant={'body1Regular'}
          style={styles.buttonStyle}
          text={retryButtonText}
        />
      </TouchableOpacity>
    </>
  );
}
