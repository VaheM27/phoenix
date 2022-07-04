/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast, {BaseToast, BaseToastProps} from 'react-native-toast-message';
import {colors, spacing, shadow, font} from '../../theme';

const CustomToast: React.FC<BaseToastProps & {color: string}> = ({
  color,
  text1,
  text2,
  ...props
}) => {
  return (
    <BaseToast
      {...props}
      style={{
        ...shadow.normal,
        borderLeftWidth: 0,
        shadowColor: color,
        borderRadius: 4,
        backgroundColor: color,
        height: 'auto',
      }}
      contentContainerStyle={{
        padding: spacing.normal,
      }}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      text1Style={{
        ...props.text1Style,
        color: colors.white,
        fontSize: font.size.body1,
        fontFamily: font.medium,
      }}
      text2Style={{
        ...props.text2Style,
        color: colors.white,
        fontSize: font.size.body1,
        fontFamily: font.regular,
      }}
      text1={text1}
      text2={text2}
    />
  );
};
const toastConfig = {
  success: (props: BaseToastProps) => (
    <CustomToast {...props} color={colors.success} />
  ),
  error: (props: BaseToastProps) => (
    <CustomToast {...props} color={colors.danger} />
  ),
  info: (props: BaseToastProps) => (
    <CustomToast {...props} color={colors.blue} />
  ),
};

const GlobalToast: React.FC = () => {
  const {top} = useSafeAreaInsets();
  return <Toast topOffset={top + spacing.small} config={toastConfig} />;
};

export default GlobalToast;
